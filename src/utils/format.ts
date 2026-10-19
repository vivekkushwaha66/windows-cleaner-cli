/**
 * Formats a byte number into a human-readable string (e.g. 1.25 MB, 4.20 GB).
 */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let value = bytes;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index++;
  }
  return `${value.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}

/**
 * Formats integer with thousands separators.
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Formats milliseconds duration into human-readable format.
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const seconds = (ms / 1000).toFixed(1);
  return `${seconds}s`;
}

/**
 * Shortens a long file path for clean CLI printing.
 */
export function truncatePath(filePath: string, maxLength: number = 60): string {
  if (filePath.length <= maxLength) return filePath;
  const half = Math.floor((maxLength - 5) / 2);
  return `${filePath.slice(0, half)}...${filePath.slice(-half)}`;
}
