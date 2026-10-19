import chalk from 'chalk';

export const logger = {
  info: (msg: string) => console.log(chalk.cyan('ℹ ') + msg),
  success: (msg: string) => console.log(chalk.green('✔ ') + chalk.bold(msg)),
  warn: (msg: string) => console.log(chalk.yellow('⚠ ') + chalk.yellow(msg)),
  error: (msg: string) => console.error(chalk.red('✖ ') + chalk.red.bold(msg)),
  dryRun: (msg: string) => console.log(chalk.magenta('🔍 [DRY-RUN] ') + msg),
  step: (tag: string, msg: string) => console.log(chalk.blue.bold(`[${tag}] `) + msg),
  dim: (msg: string) => console.log(chalk.gray(msg)),
  title: (msg: string) => console.log('\n' + chalk.cyan.bold.underline(msg)),
  highlight: (msg: string) => chalk.yellow.bold(msg),
  path: (p: string) => chalk.gray(p),
  badge: (text: string, color: 'green' | 'red' | 'yellow' | 'blue' = 'blue') => {
    switch (color) {
      case 'green':
        return chalk.bgGreen.black.bold(` ${text} `);
      case 'red':
        return chalk.bgRed.white.bold(` ${text} `);
      case 'yellow':
        return chalk.bgYellow.black.bold(` ${text} `);
      default:
        return chalk.bgCyan.black.bold(` ${text} `);
    }
  },
};
