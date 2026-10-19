import { describe, it, expect } from 'vitest';
import path from 'node:path';
import os from 'node:os';
import { isSafeTargetPath } from '../src/core/safety.js';
import { isInside, normalizePath } from '../src/utils/paths.js';
import {
  PROTECTED_PATHS,
  PROTECTED_USER_DIRECTORIES,
  PROTECTED_SYSTEM_DIRECTORIES,
} from '../src/constants/paths.js';

describe('paths utility', () => {
  it('detects child is inside parent', () => {
    const parent = 'C:\\Users\\test\\AppData\\Local\\Temp';
    const child = 'C:\\Users\\test\\AppData\\Local\\Temp\\nested\\file.txt';
    expect(isInside(normalizePath(child), normalizePath(parent))).toBe(true);
  });

  it('rejects path traversal or sibling directories', () => {
    const parent = 'C:\\Users\\test\\AppData\\Local\\Temp';
    const sibling = 'C:\\Users\\test\\AppData\\Local\\Temp2';
    expect(isInside(normalizePath(sibling), normalizePath(parent))).toBe(false);

    const outside = 'C:\\Windows\\System32';
    expect(isInside(normalizePath(outside), normalizePath(parent))).toBe(false);
  });
});

describe('protected directory constants', () => {
  it('exports individual arrays for user and system protected folders', () => {
    expect(PROTECTED_USER_DIRECTORIES.length).toBeGreaterThan(5);
    expect(PROTECTED_SYSTEM_DIRECTORIES.length).toBeGreaterThan(4);
    expect(PROTECTED_PATHS.length).toBe(
      PROTECTED_USER_DIRECTORIES.length + PROTECTED_SYSTEM_DIRECTORIES.length
    );
  });
});

describe('isSafeTargetPath', () => {
  const allowedRoots = [
    os.tmpdir(),
    path.join(process.env.LOCALAPPDATA || 'C:\\Users\\test\\AppData\\Local', 'Temp'),
    path.join(process.env.LOCALAPPDATA || 'C:\\Users\\test\\AppData\\Local', 'npm-cache'),
  ];

  it('allows safe temporary directories', () => {
    const safeFile = path.join(os.tmpdir(), 'subfolder', 'test.log');
    expect(isSafeTargetPath(safeFile, allowedRoots)).toBe(true);
  });

  it('rejects drive roots', () => {
    expect(isSafeTargetPath('C:\\', allowedRoots)).toBe(false);
    expect(isSafeTargetPath('D:\\', allowedRoots)).toBe(false);
  });

  it('rejects protected Windows system folders', () => {
    expect(isSafeTargetPath('C:\\Windows', allowedRoots)).toBe(false);
    expect(isSafeTargetPath('C:\\Windows\\System32', allowedRoots)).toBe(false);
    expect(isSafeTargetPath('C:\\Program Files', allowedRoots)).toBe(false);
  });

  it('rejects user personal folders', () => {
    const home = os.homedir();
    expect(isSafeTargetPath(home, allowedRoots)).toBe(false);
    expect(isSafeTargetPath(path.join(home, 'Documents'), allowedRoots)).toBe(false);
    expect(isSafeTargetPath(path.join(home, 'Desktop'), allowedRoots)).toBe(false);
    expect(isSafeTargetPath(path.join(home, 'Downloads'), allowedRoots)).toBe(false);
  });
});
