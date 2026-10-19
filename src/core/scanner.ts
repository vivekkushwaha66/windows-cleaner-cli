import fs from 'node:fs';
import path from 'node:path';
import type {
  CleanTarget,
  CandidateFile,
  TargetScanResult,
  ScanSummary,
} from '../types/index.js';
import { isSafeTargetPath } from './safety.js';

export interface ScanOptions {
  targets: CleanTarget[];
  allowedRoots: string[];
  ageDays: number;
  isAdmin: boolean;
  onTargetStart?: (target: CleanTarget, index: number, total: number) => void;
  onProgress?: (currentPath: string, totalFiles: number, totalBytes: number) => void;
}

export function scanTargets(options: ScanOptions): ScanSummary {
  const { targets, allowedRoots, ageDays, isAdmin, onTargetStart, onProgress } = options;
  const cutoffMs = Date.now() - ageDays * 86_400_000;

  let scannedCount = 0;
  let candidatesCount = 0;
  let candidateBytes = 0;
  let skippedRecentCount = 0;
  let skippedUnsafeCount = 0;
  let errorCount = 0;
  const globalErrors: string[] = [];
  const resultsByTarget = new Map<string, TargetScanResult>();

  for (let tIdx = 0; tIdx < targets.length; tIdx++) {
    const target = targets[tIdx];
    if (onTargetStart) {
      onTargetStart(target, tIdx + 1, targets.length);
    }
    const targetResult: TargetScanResult = {
      target,
      exists: false,
      path: target.path,
      files: [],
      totalBytes: 0,
      skippedRecent: 0,
      skippedUnsafe: 0,
      errors: [],
    };

    resultsByTarget.set(target.id, targetResult);

    // Skip if target requires admin and current session is not elevated
    if (target.requiresAdmin && !isAdmin) {
      targetResult.errors.push('Skipped: Requires Administrator privileges');
      continue;
    }

    if (!fs.existsSync(target.path)) {
      continue;
    }

    try {
      const rootStat = fs.lstatSync(target.path);
      if (!rootStat.isDirectory() || rootStat.isSymbolicLink()) {
        targetResult.skippedUnsafe++;
        skippedUnsafeCount++;
        continue;
      }
      targetResult.exists = true;
    } catch {
      continue;
    }

    // Double check safety of the target root
    if (!isSafeTargetPath(target.path, allowedRoots)) {
      targetResult.skippedUnsafe++;
      skippedUnsafeCount++;
      targetResult.errors.push(`Unsafe path rejected by safety guard: ${target.path}`);
      continue;
    }

    // Helper for browser profile subdirectory exploration
    const isBrowserTarget = target.category === 'browser-caches' && target.allowedSubdirs;

    function walk(currentDir: string, depth: number) {
      let entries: fs.Dirent[];
      try {
        entries = fs.readdirSync(currentDir, { withFileTypes: true });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        targetResult.errors.push(`${currentDir}: ${msg}`);
        errorCount++;
        if (globalErrors.length < 50) globalErrors.push(`${currentDir}: ${msg}`);
        return;
      }

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isSymbolicLink()) {
          targetResult.skippedUnsafe++;
          skippedUnsafeCount++;
          continue;
        }

        if (entry.isDirectory()) {
          // If browser target, only drill down if either:
          // 1. It's a profile root (depth === 0)
          // 2. The folder name matches one of the allowed cache subdirectories
          if (isBrowserTarget && target.allowedSubdirs) {
            if (target.allowedSubdirs.includes(entry.name)) {
              // Found allowed cache directory (at profile level or user data root)!
              walkCacheDir(fullPath);
            } else if (depth <= 1) {
              // Visit top-level profiles (e.g. "Default", "Profile 1", "<profile>.default-release")
              walk(fullPath, depth + 1);
            }
            continue;
          }

          walk(fullPath, depth + 1);
        } else if (entry.isFile()) {
          // If browser target, only clean inside recognized cache folders
          if (isBrowserTarget) {
            continue;
          }
          checkFile(fullPath);
        }
      }
    }

    // Unrestricted walk once inside a confirmed cache directory
    function walkCacheDir(currentDir: string) {
      let entries: fs.Dirent[];
      try {
        entries = fs.readdirSync(currentDir, { withFileTypes: true });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        targetResult.errors.push(`${currentDir}: ${msg}`);
        errorCount++;
        return;
      }

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        if (entry.isSymbolicLink()) {
          targetResult.skippedUnsafe++;
          skippedUnsafeCount++;
          continue;
        }

        if (entry.isDirectory()) {
          walkCacheDir(fullPath);
        } else if (entry.isFile()) {
          checkFile(fullPath);
        }
      }
    }

    function checkFile(filePath: string) {
      scannedCount++;
      let stat: fs.Stats;
      try {
        stat = fs.lstatSync(filePath);
      } catch {
        return;
      }

      if (stat.isSymbolicLink() || !stat.isFile()) {
        targetResult.skippedUnsafe++;
        skippedUnsafeCount++;
        return;
      }

      if (stat.mtimeMs > cutoffMs) {
        targetResult.skippedRecent++;
        skippedRecentCount++;
        return;
      }

      // Check fileFilter if specified on target
      if (target.fileFilter && !target.fileFilter(path.basename(filePath))) {
        return;
      }

      const candidate: CandidateFile = {
        filePath,
        size: stat.size,
        mtimeMs: stat.mtimeMs,
        targetId: target.id,
        category: target.category,
      };

      targetResult.files.push(candidate);
      targetResult.totalBytes += stat.size;
      candidatesCount++;
      candidateBytes += stat.size;

      if (onProgress && candidatesCount % 25 === 0) {
        onProgress(filePath, candidatesCount, candidateBytes);
      }
    }

    walk(target.path, 0);
  }

  return {
    scannedCount,
    candidatesCount,
    candidateBytes,
    skippedRecentCount,
    skippedUnsafeCount,
    errorCount,
    errors: globalErrors,
    resultsByTarget,
  };
}
