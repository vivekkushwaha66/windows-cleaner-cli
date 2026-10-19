import path from 'node:path';
import { normalizePath, isInside } from '../utils/paths.js';
import {
  PROTECTED_PATHS,
  PROTECTED_USER_PERSONAL_FOLDERS,
  PROTECTED_USER_DIRECTORIES,
  PROTECTED_SYSTEM_DIRECTORIES,
} from '../constants/paths.js';

export {
  PROTECTED_PATHS,
  PROTECTED_USER_PERSONAL_FOLDERS,
  PROTECTED_USER_DIRECTORIES,
  PROTECTED_SYSTEM_DIRECTORIES,
};

/**
 * Validates whether a given path is completely safe to scan and clean.
 * Rejects drive roots, critical system roots, and user personal directories.
 */
export function isSafeTargetPath(targetPath: string, allowedRoots: string[]): boolean {
  if (!targetPath) return false;

  const resolved = path.resolve(targetPath);
  const normalized = normalizePath(resolved);

  // 1. Never operate on a drive root (e.g. C:\ or D:\)
  if (path.dirname(resolved) === resolved) {
    return false;
  }

  // 2. Never target a protected directory directly
  if (PROTECTED_PATHS.includes(normalized)) {
    return false;
  }

  // 3. User personal directories check:
  // e.g. Desktop, Documents, Downloads should never be cleaned even as subpaths
  for (const personalFolder of PROTECTED_USER_PERSONAL_FOLDERS) {
    if (isInside(normalized, personalFolder)) {
      return false;
    }
  }

  // 4. Must belong to an explicitly allowed whitelist root
  const normalizedAllowedRoots = allowedRoots.map(normalizePath);
  const isAllowed = normalizedAllowedRoots.some(root => isInside(normalized, root));

  return isAllowed;
}
