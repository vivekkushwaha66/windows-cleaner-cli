import path from 'node:path';

/**
 * Standardizes a path to absolute lowercase path with consistent separators.
 */
export function normalizePath(p: string): string {
  if (!p) return '';
  return path.resolve(p).toLowerCase();
}

/**
 * Checks if a child path is strictly inside or equal to parent path.
 */
export function isInside(child: string, parent: string): boolean {
  if (!child || !parent) return false;
  const rel = path.relative(parent, child);
  return (
    rel === '' ||
    (!rel.startsWith('..' + path.sep) && rel !== '..' && !path.isAbsolute(rel))
  );
}
