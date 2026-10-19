import { Command } from 'commander';
import { runCleaner } from './core/orchestrator.js';
import type { CliOptions } from './types/index.js';

// Pre-flight check: Ensure Node.js 18+ is used
const [major] = process.versions.node.split('.').map(Number);
if (major < 18) {
  console.error(
    `\x1b[31m✖ [ERROR] Node.js 18.0.0 or higher is required.\x1b[0m\n` +
    `Current version is Node.js ${process.version}.\n` +
    `Please upgrade Node.js from https://nodejs.org/ or run:\n` +
    `  winget install OpenJS.NodeJS.LTS\n`
  );
  process.exit(1);
}

const program = new Command();

program
  .name('winclean')
  .description('A safe, interactive, high-performance Windows disk cleaner CLI.')
  .version('0.0.1-beta')
  .option('-a, --apply', 'Apply deletion of eligible files (default: safe dry-run)')
  .option('-d, --dry-run', 'Explicit dry-run mode (nothing will be deleted)')
  .option('-i, --interactive', 'Interactive wizard to select categories and confirm folders')
  .option('--age-days <days>', 'Only clean files older than specified days (default: 7)', '7')
  .option(
    '-c, --categories <categories...>',
    'Specific categories to clean (system-temp, system-dumps, dev-caches, ide-caches, browser-caches, app-caches, windows-update, recycle-bin)'
  )
  .option('--all', 'Include all standard categories')
  .option('--include-browsers', 'Include Web browser caches (Chrome, Edge, Brave, Firefox, Opera)')
  .option('--include-windows-update', 'Include Windows Update downloads cache (Requires Admin)')
  .option('--include-recycle-bin', 'Empty Windows Recycle Bin')
  .option('-p, --prompt-folders', 'Prompt for confirmation before deleting each individual folder')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('-v, --verbose', 'Show verbose output')
  .action(async (opts) => {
    const ageDays = parseInt(opts.ageDays, 10);
    if (isNaN(ageDays) || ageDays < 0 || ageDays > 3650) {
      console.error('Error: --age-days must be a valid number between 0 and 3650.');
      process.exit(1);
    }

    const options: CliOptions = {
      apply: opts.dryRun ? false : opts.apply,
      dryRun: opts.dryRun,
      interactive: opts.interactive,
      ageDays,
      categories: opts.categories,
      all: opts.all,
      includeBrowsers: opts.includeBrowsers,
      includeWindowsUpdate: opts.includeWindowsUpdate,
      includeRecycleBin: opts.includeRecycleBin,
      promptFolders: opts.promptFolders,
      yes: opts.yes,
      verbose: opts.verbose,
    };

    await runCleaner(options);
  });

program
  .command('scan')
  .description('Perform a fast dry-run scan to inspect reclaimable disk space')
  .option('--age-days <days>', 'Age cutoff in days', '7')
  .option('--include-browsers', 'Include browser caches')
  .option('--all', 'Include all categories')
  .action(async (opts) => {
    const ageDays = parseInt(opts.ageDays, 10) || 7;
    await runCleaner({
      apply: false,
      dryRun: true,
      ageDays,
      includeBrowsers: opts.includeBrowsers,
      all: opts.all,
    });
  });

program
  .command('clean')
  .description('Clean temporary files, build caches, and system junk')
  .option('--age-days <days>', 'Age cutoff in days', '7')
  .option('-p, --prompt-folders', 'Prompt for confirmation before deleting each folder')
  .option('--include-browsers', 'Include browser caches')
  .option('--include-windows-update', 'Include Windows update downloads cache')
  .option('--include-recycle-bin', 'Empty Windows Recycle Bin')
  .option('-y, --yes', 'Skip confirmation prompt')
  .action(async (opts) => {
    const ageDays = parseInt(opts.ageDays, 10) || 7;
    await runCleaner({
      apply: true,
      ageDays,
      promptFolders: opts.promptFolders,
      includeBrowsers: opts.includeBrowsers,
      includeWindowsUpdate: opts.includeWindowsUpdate,
      includeRecycleBin: opts.includeRecycleBin,
      yes: opts.yes,
    });
  });

program.parse(process.argv);
