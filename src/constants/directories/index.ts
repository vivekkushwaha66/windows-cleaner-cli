import type { CleanTarget } from '../../types/index.js';
import { TEMP_DIRECTORIES } from './temp.js';
import { SYSTEM_DUMP_DIRECTORIES } from './dumps.js';
import { DEV_CACHE_DIRECTORIES } from './dev.js';
import { IDE_CACHE_DIRECTORIES } from './ide.js';
import { BROWSER_CACHE_DIRECTORIES } from './browsers.js';
import { APP_CACHE_DIRECTORIES } from './apps.js';
import { WINDOWS_UPDATE_DIRECTORIES } from './windows-update.js';

export * from './temp.js';
export * from './dumps.js';
export * from './dev.js';
export * from './ide.js';
export * from './browsers.js';
export * from './apps.js';
export * from './windows-update.js';

/**
 * Aggregated array containing all target directories across all categories.
 */
export const ALL_TARGET_DIRECTORIES: CleanTarget[] = [
  ...TEMP_DIRECTORIES,
  ...SYSTEM_DUMP_DIRECTORIES,
  ...DEV_CACHE_DIRECTORIES,
  ...IDE_CACHE_DIRECTORIES,
  ...BROWSER_CACHE_DIRECTORIES,
  ...APP_CACHE_DIRECTORIES,
  ...WINDOWS_UPDATE_DIRECTORIES,
];
