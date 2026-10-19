import { checkbox, confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import type { CategoryId, TargetScanResult } from '../types/index.js';
import { CATEGORIES } from '../core/targets.js';
import { formatBytes, formatNumber } from '../utils/format.js';

/**
 * Interactive prompt allowing the user to pick which categories to clean.
 */
export async function promptCategorySelection(): Promise<CategoryId[]> {
  const choices = CATEGORIES.map(cat => ({
    name: `${chalk.bold(cat.name)} ${chalk.gray(`— ${cat.description}`)}`,
    value: cat.id,
    checked: cat.defaultSelected,
  }));

  const selected = await checkbox({
    message: 'Select cleanup categories:',
    choices,
    pageSize: 10,
  });

  return selected as CategoryId[];
}

/**
 * Interactive prompt allowing user to inspect and toggle specific folders before deletion.
 * User can uncheck any specific folder they want to keep.
 */
export async function promptSelectFoldersToDelete(
  targetsWithCandidates: TargetScanResult[]
): Promise<string[]> {
  if (targetsWithCandidates.length === 0) return [];

  const choices = targetsWithCandidates.map(res => {
    const count = formatNumber(res.files.length);
    const size = formatBytes(res.totalBytes);
    return {
      name: `${chalk.white.bold(res.target.name)} ${chalk.yellow(`(${count} files, ${size})`)}\n  ${chalk.gray(res.path)}`,
      value: res.target.id,
      checked: true,
    };
  });

  console.log('\n' + chalk.cyan.bold('Folder Cleanup Review:'));
  console.log(chalk.gray('Space to toggle, Enter to confirm selected folders to clean.\n'));

  const selected = await checkbox({
    message: 'Check folders to delete:',
    choices,
    pageSize: 15,
  });

  return selected;
}

/**
 * Individual check prompt before deleting a specific target folder.
 */
export async function promptConfirmFolder(
  folderName: string,
  folderPath: string,
  filesCount: number,
  bytes: number
): Promise<boolean> {
  const formattedCount = formatNumber(filesCount);
  const formattedSize = formatBytes(bytes);

  return await confirm({
    message: `Delete ${chalk.yellow(formattedCount)} files (${chalk.green(formattedSize)}) in ${chalk.cyan(folderName)}?\n  ${chalk.gray(folderPath)}\n `,
    default: true,
  });
}

/**
 * Final confirmation prompt before initiating file deletion.
 */
export async function promptConfirmDeletion(
  totalFiles: number,
  totalBytes: number
): Promise<boolean> {
  const countStr = formatNumber(totalFiles);
  const sizeStr = formatBytes(totalBytes);

  return await confirm({
    message: `Are you sure you want to permanently delete ${chalk.yellow.bold(countStr)} files (${chalk.green.bold(sizeStr)})?`,
    default: false,
  });
}
