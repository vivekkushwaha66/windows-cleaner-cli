import fs from 'node:fs';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import type { DriveInfo } from '../types/index.js';

/**
 * Checks if the current Node process has elevated Windows Administrator privileges.
 */
export function isAdministrator(): boolean {
  if (process.platform !== 'win32') return false;
  try {
    execFileSync('net', ['session'], {
      stdio: 'ignore',
      windowsHide: true,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets disk capacity statistics for a given drive (e.g. 'C:\\').
 */
export function getDriveStats(drive: string = 'C:\\'): DriveInfo {
  const result: DriveInfo = {
    drive,
    totalBytes: null,
    freeBytes: null,
    usedBytes: null,
    freePercent: null,
  };

  try {
    const stat = fs.statfsSync(drive);
    const bsize = Number(stat.bsize);
    const bavail = Number(stat.bavail);
    const blocks = Number(stat.blocks);

    const freeBytes = bavail * bsize;
    const totalBytes = blocks * bsize;
    const usedBytes = Math.max(0, totalBytes - freeBytes);
    const freePercent = totalBytes > 0 ? (freeBytes / totalBytes) * 100 : 0;

    return {
      drive,
      totalBytes,
      freeBytes,
      usedBytes,
      freePercent,
    };
  } catch {
    return result;
  }
}

/**
 * Retrieves readable OS version (e.g. Windows 11 Build 22631, Windows 10, etc.)
 */
export function getWindowsVersion(): string {
  const release = os.release();
  const build = parseInt(release.split('.')[2] || '0', 10);

  if (build >= 22000) {
    return `Windows 11 (Build ${build})`;
  } else if (build >= 10240) {
    return `Windows 10 (Build ${build})`;
  }
  return `Windows (${release})`;
}

/**
 * Safely empties the Windows Recycle Bin using PowerShell.
 */
export function emptyRecycleBin(): { success: boolean; error?: string } {
  try {
    execFileSync(
      'powershell.exe',
      ['-NoProfile', '-NonInteractive', '-Command', 'Clear-RecycleBin -Force -ErrorAction Stop'],
      { stdio: 'ignore', windowsHide: true }
    );
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: message };
  }
}
