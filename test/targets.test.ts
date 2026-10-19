import { describe, it, expect } from 'vitest';
import { getCleanTargets, filterTargets } from '../src/core/targets.js';
import {
  TEMP_DIRECTORIES,
  SYSTEM_DUMP_DIRECTORIES,
  DEV_CACHE_DIRECTORIES,
  IDE_CACHE_DIRECTORIES,
  BROWSER_CACHE_DIRECTORIES,
  APP_CACHE_DIRECTORIES,
  WINDOWS_UPDATE_DIRECTORIES,
} from '../src/constants/index.js';

describe('targets module & individual directory arrays', () => {
  it('exports individual directory arrays correctly', () => {
    expect(Array.isArray(TEMP_DIRECTORIES)).toBe(true);
    expect(TEMP_DIRECTORIES.length).toBeGreaterThan(0);

    expect(Array.isArray(SYSTEM_DUMP_DIRECTORIES)).toBe(true);
    expect(SYSTEM_DUMP_DIRECTORIES.length).toBeGreaterThan(0);

    expect(Array.isArray(DEV_CACHE_DIRECTORIES)).toBe(true);
    expect(DEV_CACHE_DIRECTORIES.length).toBeGreaterThan(0);

    expect(Array.isArray(IDE_CACHE_DIRECTORIES)).toBe(true);
    expect(IDE_CACHE_DIRECTORIES.length).toBeGreaterThan(0);

    expect(Array.isArray(BROWSER_CACHE_DIRECTORIES)).toBe(true);
    expect(BROWSER_CACHE_DIRECTORIES.length).toBeGreaterThan(0);

    expect(Array.isArray(APP_CACHE_DIRECTORIES)).toBe(true);
    expect(APP_CACHE_DIRECTORIES.length).toBeGreaterThan(0);

    expect(Array.isArray(WINDOWS_UPDATE_DIRECTORIES)).toBe(true);
    expect(WINDOWS_UPDATE_DIRECTORIES.length).toBeGreaterThan(0);
  });

  it('includes Brave Browser channels and other major browsers', () => {
    const braveTargets = BROWSER_CACHE_DIRECTORIES.filter(t => t.id.startsWith('browser-brave'));
    expect(braveTargets.length).toBeGreaterThanOrEqual(3);
    expect(braveTargets.some(t => t.id === 'browser-brave')).toBe(true);
    expect(braveTargets.some(t => t.id === 'browser-brave-beta')).toBe(true);
    expect(braveTargets.some(t => t.id === 'browser-brave-nightly')).toBe(true);

    const chromeTargets = BROWSER_CACHE_DIRECTORIES.filter(t => t.id.startsWith('browser-chrome'));
    expect(chromeTargets.length).toBeGreaterThanOrEqual(2);

    const edgeTargets = BROWSER_CACHE_DIRECTORIES.filter(t => t.id.startsWith('browser-edge'));
    expect(edgeTargets.length).toBeGreaterThanOrEqual(3);

    expect(BROWSER_CACHE_DIRECTORIES.some(t => t.id === 'browser-arc')).toBe(true);
    expect(BROWSER_CACHE_DIRECTORIES.some(t => t.id === 'browser-vivaldi')).toBe(true);
    expect(BROWSER_CACHE_DIRECTORIES.some(t => t.id === 'browser-firefox')).toBe(true);
  });

  it('includes Windows update, CBS logs, and upgrade folders', () => {
    expect(WINDOWS_UPDATE_DIRECTORIES.some(t => t.id === 'winupdate-download')).toBe(true);
    expect(WINDOWS_UPDATE_DIRECTORIES.some(t => t.id === 'winupdate-delivery')).toBe(true);
    expect(WINDOWS_UPDATE_DIRECTORIES.some(t => t.id === 'winupdate-cbs-logs')).toBe(true);
    expect(WINDOWS_UPDATE_DIRECTORIES.some(t => t.id === 'winupdate-dism-logs')).toBe(true);
    expect(WINDOWS_UPDATE_DIRECTORIES.some(t => t.id === 'winupdate-panther')).toBe(true);
    expect(WINDOWS_UPDATE_DIRECTORIES.some(t => t.id === 'winupdate-windows-bt')).toBe(true);
    expect(WINDOWS_UPDATE_DIRECTORIES.some(t => t.id === 'winupdate-windows-ws')).toBe(true);
  });

  it('aggregates all individual directory arrays into targets', () => {
    const targets = getCleanTargets();
    const sum =
      TEMP_DIRECTORIES.length +
      SYSTEM_DUMP_DIRECTORIES.length +
      DEV_CACHE_DIRECTORIES.length +
      IDE_CACHE_DIRECTORIES.length +
      BROWSER_CACHE_DIRECTORIES.length +
      APP_CACHE_DIRECTORIES.length +
      WINDOWS_UPDATE_DIRECTORIES.length;

    expect(targets.length).toBe(sum);
    for (const target of targets) {
      expect(target.id).toBeTruthy();
      expect(target.name).toBeTruthy();
      expect(target.category).toBeTruthy();
      expect(target.path).toBeTruthy();
    }
  });

  it('filters targets by category', () => {
    const targets = getCleanTargets();
    const filtered = filterTargets(targets, { categories: ['system-temp'] });
    expect(filtered.length).toBe(TEMP_DIRECTORIES.length);
    expect(filtered.every(t => t.category === 'system-temp')).toBe(true);
  });

  it('excludes browser targets by default unless flagged', () => {
    const targets = getCleanTargets();
    const defaultFiltered = filterTargets(targets, {});
    expect(defaultFiltered.some(t => t.category === 'browser-caches')).toBe(false);

    const withBrowsers = filterTargets(targets, { includeBrowsers: true });
    expect(withBrowsers.some(t => t.category === 'browser-caches')).toBe(true);
  });
});
