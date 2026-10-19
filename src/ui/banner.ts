import chalk from 'chalk';
import { isAdministrator, getDriveStats, getWindowsVersion } from '../utils/system.js';
import { formatBytes } from '../utils/format.js';
import { logger } from './logger.js';

export function printBanner(options: { apply?: boolean; ageDays?: number }): void {
  const isAdmin = isAdministrator();
  const osVer = getWindowsVersion();
  const cDrive = getDriveStats('C:\\');
  const mode = options.apply ? chalk.red.bold('DELETE (LIVE)') : chalk.green.bold('DRY RUN (SAFE)');
  const age = options.ageDays ?? 7;

  console.log(
    chalk.cyan(`
  ██╗    ██╗██╗███╗   ██╗ ██████╗██╗     ███████╗ █████╗ ███╗   ██╗
  ██║    ██║██║████╗  ██║██╔════╝██║     ██╔════╝██╔══██╗████╗  ██║
  ██║ █╗ ██║██║██╔██╗ ██║██║     ██║     █████╗  ███████║██╔██╗ ██║
  ██║███╗██║██║██║╚██╗██║██║     ██║     ██╔══╝  ██╔══██║██║╚██╗██║
  ╚███╔███╔╝██║██║ ╚████║╚██████╗███████╗███████╗██║  ██║██║ ╚████║
   ╚══╝╚══╝ ╚═╝╚═╝  ╚═══╝ ╚═════╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝
    `) + chalk.gray('           High-Performance Windows Disk Cleanup CLI\n')
  );

  const adminBadge = isAdmin
    ? logger.badge('ADMIN: ELEVATED', 'green')
    : logger.badge('ADMIN: NO (STANDARD)', 'yellow');

  console.log(chalk.gray('─'.repeat(68)));
  console.log(`  ${chalk.bold('OS:')}         ${chalk.white(osVer)}   ${adminBadge}`);
  console.log(`  ${chalk.bold('Mode:')}       ${mode}   ${chalk.gray(`(Cutoff: ${age} days)`)}`);

  if (cDrive.totalBytes && cDrive.freeBytes) {
    const freePct = cDrive.freePercent ? cDrive.freePercent.toFixed(1) : '0';
    const used = formatBytes(cDrive.usedBytes || 0);
    const total = formatBytes(cDrive.totalBytes);
    const free = formatBytes(cDrive.freeBytes);

    console.log(
      `  ${chalk.bold('Drive C:')}    ${chalk.white(`${free} free`)} of ${total} (${freePct}% free)`
    );

    // Mini ASCII progress bar for disk usage
    const barWidth = 30;
    const usedRatio = Math.min(1, Math.max(0, (cDrive.usedBytes || 0) / cDrive.totalBytes));
    const filledChars = Math.round(usedRatio * barWidth);
    const emptyChars = barWidth - filledChars;
    const bar =
      chalk.red('█'.repeat(filledChars)) + chalk.gray('░'.repeat(emptyChars));
    console.log(`               [${bar}] ${used} used`);
  }
  console.log(chalk.gray('─'.repeat(68)) + '\n');
}
