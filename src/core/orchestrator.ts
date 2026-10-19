import chalk from 'chalk';
import type { CliOptions, CandidateFile } from '../types/index.js';
import { getCleanTargets, filterTargets, getAllowedRoots, CATEGORIES } from './targets.js';
import { scanTargets } from './scanner.js';
import { deleteCandidateFiles } from './cleaner.js';
import { printBanner } from '../ui/banner.js';
import { logger } from '../ui/logger.js';
import { renderScanTable, renderDeleteTable } from '../ui/table.js';
import { createDeleteProgressBar, createScanProgressBar } from '../ui/progress.js';
import {
  promptCategorySelection,
  promptSelectFoldersToDelete,
  promptConfirmFolder,
  promptConfirmDeletion,
} from '../ui/prompts.js';
import {
  isAdministrator,
  getDriveStats,
  emptyRecycleBin,
} from '../utils/system.js';
import { formatBytes, formatNumber, truncatePath } from '../utils/format.js';

export async function runCleaner(options: CliOptions): Promise<void> {
  if (process.platform !== 'win32') {
    logger.error('Windows Cleaner CLI is designed specifically for Windows.');
    process.exit(1);
  }

  const isAdmin = isAdministrator();
  const allTargets = getCleanTargets();

  printBanner({ apply: options.apply, ageDays: options.ageDays });

  // Interactive category selection if requested or if run with no explicit targets & interactive
  let activeOptions = { ...options };
  if (options.interactive) {
    const selectedCategories = await promptCategorySelection();
    activeOptions.categories = selectedCategories;
  }

  const targets = filterTargets(allTargets, activeOptions);
  const allowedRoots = getAllowedRoots(targets);
  const ageDays = options.ageDays ?? 7;

  logger.step('SCAN', `Scanning ${targets.length} target locations (age cutoff: ${ageDays} days)...`);

  const scanBar = createScanProgressBar();
  scanBar.start(targets.length, 0, {
    foundFiles: 0,
    foundBytes: '0 B',
    targetName: 'Starting...',
  });

  let currentFoundFiles = 0;
  let currentFoundBytes = 0;

  const scanSummary = scanTargets({
    targets,
    allowedRoots,
    ageDays,
    isAdmin,
    onTargetStart: (target, index) => {
      scanBar.update(index - 1, {
        targetName: truncatePath(target.name, 25),
        foundFiles: currentFoundFiles,
        foundBytes: formatBytes(currentFoundBytes),
      });
    },
    onProgress: (_p, foundCount, foundBytes) => {
      currentFoundFiles = foundCount;
      currentFoundBytes = foundBytes;
      scanBar.update({
        foundFiles: currentFoundFiles,
        foundBytes: formatBytes(currentFoundBytes),
      });
    },
  });

  scanBar.update(targets.length, {
    foundFiles: scanSummary.candidatesCount,
    foundBytes: formatBytes(scanSummary.candidateBytes),
    targetName: 'Scan complete',
  });
  scanBar.stop();
  console.log('\n');

  // Display Table
  console.log('\n' + renderScanTable(scanSummary) + '\n');

  // Summary Metrics
  console.log(chalk.gray('─'.repeat(68)));
  console.log(
    `  ${chalk.bold('Files Scanned:')}         ${chalk.white(formatNumber(scanSummary.scannedCount))}`
  );
  console.log(
    `  ${chalk.bold('Eligible Candidates:')}   ${chalk.yellow.bold(formatNumber(scanSummary.candidatesCount))} files`
  );
  console.log(
    `  ${chalk.bold('Reclaimable Space:')}     ${chalk.green.bold(formatBytes(scanSummary.candidateBytes))}`
  );
  console.log(
    `  ${chalk.bold('Skipped (Recent):')}       ${chalk.gray(formatNumber(scanSummary.skippedRecentCount))}`
  );
  console.log(
    `  ${chalk.bold('Skipped (Unsafe/Link):')}  ${chalk.gray(formatNumber(scanSummary.skippedUnsafeCount))}`
  );
  console.log(chalk.gray('─'.repeat(68)) + '\n');

  if (scanSummary.candidatesCount === 0) {
    logger.success('No eligible temporary or cache files found to clean. Your system is already tidy!');
    return;
  }

  // If in Dry-Run mode and not applying
  if (!options.apply && !options.interactive) {
    logger.dryRun('DRY RUN ONLY — No files were deleted.');
    logger.info(`To delete these candidate files, re-run with: ${chalk.cyan.bold('winclean --apply')}`);
    logger.info(`Or run interactive mode: ${chalk.cyan.bold('winclean -i')}`);
    return;
  }

  // Collect candidate files from all targets
  const targetsWithCandidates = Array.from(scanSummary.resultsByTarget.values()).filter(
    r => r.files.length > 0
  );

  let selectedCandidateFiles: CandidateFile[] = [];

  // Folder-by-folder check:
  // In interactive mode or when --prompt-folders is specified, let user inspect & toggle folders
  if (options.interactive || options.promptFolders) {
    const selectedTargetIds = await promptSelectFoldersToDelete(targetsWithCandidates);

    if (selectedTargetIds.length === 0) {
      logger.info('No folders selected for deletion. Exiting without changes.');
      return;
    }

    // Individual check before deleting specific folder if --prompt-folders was explicitly requested
    for (const res of targetsWithCandidates) {
      if (!selectedTargetIds.includes(res.target.id)) continue;

      if (options.promptFolders) {
        const approved = await promptConfirmFolder(
          res.target.name,
          res.path,
          res.files.length,
          res.totalBytes
        );
        if (!approved) {
          logger.warn(`Skipping folder: ${res.target.name}`);
          continue;
        }
      }

      selectedCandidateFiles.push(...res.files);
    }
  } else {
    for (const res of targetsWithCandidates) {
      selectedCandidateFiles.push(...res.files);
    }
  }

  if (selectedCandidateFiles.length === 0) {
    logger.info('No files selected for deletion. Exiting.');
    return;
  }

  const totalSelectedBytes = selectedCandidateFiles.reduce((acc, f) => acc + f.size, 0);

  // Final confirmation prompt (skipped if --yes is passed)
  if (!options.yes) {
    const confirmed = await promptConfirmDeletion(
      selectedCandidateFiles.length,
      totalSelectedBytes
    );

    if (!confirmed) {
      logger.info('Cleanup cancelled by user. No files were deleted.');
      return;
    }
  }

  // Perform Deletion
  const driveBefore = getDriveStats('C:\\');
  logger.step('DELETE', `Starting cleanup of ${formatNumber(selectedCandidateFiles.length)} files...`);

  const progressBar = createDeleteProgressBar();
  progressBar.start(selectedCandidateFiles.length, 0, {
    freed: '0 B',
    status: 'Initializing...',
  });

  let currentFreedBytes = 0;

  const deleteSummary = deleteCandidateFiles({
    files: selectedCandidateFiles,
    targets,
    allowedRoots,
    ageDays,
    onProgress: (currentFile, index, total) => {
      currentFreedBytes += currentFile.size;
      progressBar.update(index, {
        freed: formatBytes(currentFreedBytes),
        status: truncatePath(currentFile.filePath, 32),
      });
    },
  });

  progressBar.stop();
  console.log('\n');

  // Handle Recycle Bin if requested
  if (options.includeRecycleBin) {
    logger.step('RECYCLE', 'Emptying Windows Recycle Bin...');
    const rbResult = emptyRecycleBin();
    if (rbResult.success) {
      logger.success('Recycle Bin emptied successfully.');
    } else {
      logger.warn(`Could not empty Recycle Bin: ${rbResult.error}`);
    }
  }

  // Display Deletion Report Table
  console.log(renderDeleteTable(deleteSummary, targets));

  // Drive capacity after deletion
  const driveAfter = getDriveStats('C:\\');

  console.log('\n' + chalk.gray('─'.repeat(68)));
  console.log(
    `  ${chalk.bold('Files Deleted:')}          ${chalk.green.bold(formatNumber(deleteSummary.deletedCount))}`
  );
  console.log(
    `  ${chalk.bold('Total Space Freed:')}      ${chalk.green.bold(formatBytes(deleteSummary.deletedBytes))}`
  );
  console.log(
    `  ${chalk.bold('Empty Dirs Pruned:')}      ${chalk.white(formatNumber(deleteSummary.emptyDirsRemoved))}`
  );
  console.log(
    `  ${chalk.bold('Files In-Use (Skipped):')} ${chalk.yellow(formatNumber(deleteSummary.skippedLockedCount))}`
  );
  console.log(
    `  ${chalk.bold('Failed Deletions:')}       ${chalk.red(formatNumber(deleteSummary.failedCount))}`
  );

  if (driveBefore.freeBytes !== null && driveAfter.freeBytes !== null) {
    const diff = driveAfter.freeBytes - driveBefore.freeBytes;
    if (diff > 0) {
      console.log(
        `  ${chalk.bold('Net Drive C: Gain:')}      ${chalk.green.bold(`+${formatBytes(diff)}`)}`
      );
    }
  }
  console.log(chalk.gray('─'.repeat(68)) + '\n');

  if (deleteSummary.errors.length > 0) {
    console.log(chalk.yellow.bold('Notices / Errors (first 10):'));
    deleteSummary.errors.slice(0, 10).forEach(e => console.log(chalk.gray(`  - ${e}`)));
  }

  logger.success('Windows cleanup completed successfully!');
}
