import type { CleanTarget, CliOptions } from '../types/index.js';
import { CATEGORIES, type CategoryInfo } from '../constants/categories.js';
import {
  ALL_TARGET_DIRECTORIES,
  TEMP_DIRECTORIES,
  SYSTEM_DUMP_DIRECTORIES,
  DEV_CACHE_DIRECTORIES,
  IDE_CACHE_DIRECTORIES,
  BROWSER_CACHE_DIRECTORIES,
  APP_CACHE_DIRECTORIES,
  WINDOWS_UPDATE_DIRECTORIES,
} from '../constants/directories/index.js';

export {
  CATEGORIES,
  type CategoryInfo,
  ALL_TARGET_DIRECTORIES,
  TEMP_DIRECTORIES,
  SYSTEM_DUMP_DIRECTORIES,
  DEV_CACHE_DIRECTORIES,
  IDE_CACHE_DIRECTORIES,
  BROWSER_CACHE_DIRECTORIES,
  APP_CACHE_DIRECTORIES,
  WINDOWS_UPDATE_DIRECTORIES,
};

/**
 * Returns all configured clean target directory definitions.
 */
export function getCleanTargets(): CleanTarget[] {
  return [...ALL_TARGET_DIRECTORIES];
}

/**
 * Filters targets based on CLI flags or selection.
 */
export function filterTargets(allTargets: CleanTarget[], options: CliOptions): CleanTarget[] {
  let selected = allTargets;

  // If specific categories are provided via --categories
  if (options.categories && options.categories.length > 0) {
    const requested = new Set(options.categories.map(c => c.toLowerCase()));
    selected = selected.filter(t => requested.has(t.category.toLowerCase()));
  } else if (!options.all) {
    // By default, enable targets that are enabledByDefault
    selected = selected.filter(t => t.enabledByDefault);
  }

  // Explicit flags toggle
  if (options.includeBrowsers) {
    const browserTargets = allTargets.filter(t => t.category === 'browser-caches');
    for (const bt of browserTargets) {
      if (!selected.some(s => s.id === bt.id)) {
        selected.push(bt);
      }
    }
  }

  if (options.includeWindowsUpdate) {
    const updateTargets = allTargets.filter(t => t.category === 'windows-update');
    for (const ut of updateTargets) {
      if (!selected.some(s => s.id === ut.id)) {
        selected.push(ut);
      }
    }
  }

  return selected;
}

/**
 * Returns all root paths of approved targets for safety verification.
 */
export function getAllowedRoots(targets: CleanTarget[]): string[] {
  return targets.map(t => t.path);
}
