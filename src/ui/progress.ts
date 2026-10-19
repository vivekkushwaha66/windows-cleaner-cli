import cliProgress from 'cli-progress';
import chalk from 'chalk';
import { formatBytes } from '../utils/format.js';

export function createDeleteProgressBar(): cliProgress.SingleBar {
  return new cliProgress.SingleBar(
    {
      format:
        chalk.cyan('{bar}') +
        ' ' +
        chalk.bold('{percentage}%') +
        ' │ ' +
        chalk.yellow('{value}/{total} files') +
        ' │ ' +
        chalk.green('{freed}') +
        ' │ ETA: ' +
        chalk.magenta('{eta}s') +
        ' │ ' +
        chalk.gray('{status}'),
      barCompleteChar: '█',
      barIncompleteChar: '░',
      hideCursor: true,
      clearOnComplete: false,
    },
    cliProgress.Presets.shades_classic
  );
}

export function createScanProgressBar(): cliProgress.SingleBar {
  return new cliProgress.SingleBar(
    {
      format:
        chalk.blue('{bar}') +
        ' ' +
        chalk.bold('{percentage}%') +
        ' │ Targets: ' +
        chalk.yellow('{value}/{total}') +
        ' │ Found: ' +
        chalk.green('{foundFiles} files ({foundBytes})') +
        ' │ ' +
        chalk.gray('{targetName}'),
      barCompleteChar: '━',
      barIncompleteChar: '─',
      hideCursor: true,
      clearOnComplete: false,
    },
    cliProgress.Presets.rect
  );
}
