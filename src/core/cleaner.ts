import fs from 'node:fs';
import path from 'node:path';
import type { CandidateFile, DeleteSummary, CleanTarget } from '../types/index.js';
import { isSafeTargetPath } from './safety.js';
import { normalizePath } from '../utils/paths.js';

export interface CleanerOptions {
  files: CandidateFile[];
  targets: CleanTarget[];
  allowedRoots: string[];
  ageDays: number;
  onProgress?: (currentFile: CandidateFile, index: number, total: number) => void;
}

export function deleteCandidateFiles(options: CleanerOptions): DeleteSummary {
  const { files, targets, allowedRoots, ageDays, onProgress } = options;
  const cutoffMs = Date.now() - ageDays * 86_400_000;

  const summary: DeleteSummary = {
    deletedCount: 0,
    deletedBytes: 0,
    failedCount: 0,
    skippedLockedCount: 0,
    skippedUnsafeCount: 0,
    emptyDirsRemoved: 0,
    errors: [],
    resultsByTarget: new Map(),
  };

  const targetRoots = new Set(targets.map(t => normalizePath(t.path)));
  const touchedDirs = new Set<string>();

  const total = files.length;

  for (let i = 0; i < total; i++) {
    const candidate = files[i];
    const filePath = candidate.filePath;

    // Safety re-check on allowed roots
    if (!isSafeTargetPath(filePath, allowedRoots)) {
      summary.skippedUnsafeCount++;
      continue;
    }

    try {
      // Re-verify immediately before deleting
      const current = fs.lstatSync(filePath);

      if (!current.isFile() || current.isSymbolicLink()) {
        summary.skippedUnsafeCount++;
        continue;
      }

      if (current.mtimeMs > cutoffMs) {
        // File modified while scanning
        continue;
      }

      fs.unlinkSync(filePath);

      summary.deletedCount++;
      summary.deletedBytes += candidate.size;

      const dir = path.dirname(filePath);
      touchedDirs.add(dir);

      let targetStat = summary.resultsByTarget.get(candidate.targetId);
      if (!targetStat) {
        targetStat = { deletedCount: 0, deletedBytes: 0 };
        summary.resultsByTarget.set(candidate.targetId, targetStat);
      }
      targetStat.deletedCount++;
      targetStat.deletedBytes += candidate.size;

      if (onProgress) {
        onProgress(candidate, i + 1, total);
      }
    } catch (err: unknown) {
      const nodeErr = err as NodeJS.ErrnoException;
      const code = nodeErr?.code || '';
      if (code === 'EBUSY' || code === 'EPERM' || code === 'EACCES') {
        summary.skippedLockedCount++;
      } else {
        summary.failedCount++;
        const msg = `${filePath}: ${nodeErr?.message || String(err)}`;
        if (summary.errors.length < 50) {
          summary.errors.push(msg);
        }
      }
    }
  }

  // Remove empty subdirectories that were cleaned out, sorted by depth (deepest first)
  const sortedDirs = Array.from(touchedDirs).sort((a, b) => b.length - a.length);

  for (const dir of sortedDirs) {
    const normalizedDir = normalizePath(dir);
    // Never remove a target root itself
    if (targetRoots.has(normalizedDir)) {
      continue;
    }

    try {
      const contents = fs.readdirSync(dir);
      if (contents.length === 0) {
        fs.rmdirSync(dir);
        summary.emptyDirsRemoved++;
      }
    } catch {
      // Locked or not empty, ignore
    }
  }

  return summary;
}
