import Table from 'cli-table3';
import chalk from 'chalk';
import type { ScanSummary, DeleteSummary, CleanTarget } from '../types/index.js';
import { formatBytes, formatNumber } from '../utils/format.js';

export function renderScanTable(summary: ScanSummary): string {
  const table = new Table({
    head: [
      chalk.cyan.bold('Category'),
      chalk.cyan.bold('Target Location'),
      chalk.cyan.bold('Eligible Files'),
      chalk.cyan.bold('Reclaimable'),
      chalk.cyan.bold('Status'),
    ],
    colWidths: [22, 38, 16, 16, 18],
    wordWrap: true,
    style: {
      head: [],
      border: ['gray'],
    },
  });

  for (const [, result] of summary.resultsByTarget) {
    const hasFiles = result.files.length > 0;
    let statusText: string;

    if (!result.exists) {
      statusText = chalk.gray('Not Found');
    } else if (result.errors.length > 0 && result.errors[0].includes('Administrator')) {
      statusText = chalk.yellow('Requires Admin');
    } else if (hasFiles) {
      statusText = chalk.green.bold('Ready to Clean');
    } else {
      statusText = chalk.gray('Clean (0 files)');
    }

    const filesStr = hasFiles
      ? chalk.yellow.bold(formatNumber(result.files.length))
      : chalk.gray('0');

    const bytesStr = hasFiles
      ? chalk.green.bold(formatBytes(result.totalBytes))
      : chalk.gray('0 B');

    table.push([
      chalk.white(result.target.name),
      chalk.gray(result.path),
      filesStr,
      bytesStr,
      statusText,
    ]);
  }

  return table.toString();
}

export function renderDeleteTable(
  deleteSummary: DeleteSummary,
  targets: CleanTarget[]
): string {
  const targetMap = new Map(targets.map(t => [t.id, t]));

  const table = new Table({
    head: [
      chalk.cyan.bold('Target Location'),
      chalk.cyan.bold('Files Deleted'),
      chalk.cyan.bold('Space Freed'),
    ],
    colWidths: [44, 20, 20],
    style: {
      head: [],
      border: ['gray'],
    },
  });

  for (const [targetId, stats] of deleteSummary.resultsByTarget) {
    if (stats.deletedCount === 0) continue;
    const target = targetMap.get(targetId);
    const name = target ? target.name : targetId;

    table.push([
      chalk.white(name),
      chalk.yellow.bold(formatNumber(stats.deletedCount)),
      chalk.green.bold(formatBytes(stats.deletedBytes)),
    ]);
  }

  return table.toString();
}
