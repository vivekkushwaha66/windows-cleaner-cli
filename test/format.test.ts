import { describe, it, expect } from 'vitest';
import { formatBytes, formatDuration, formatNumber, truncatePath } from '../src/utils/format.js';

describe('formatBytes', () => {
  it('formats zero and negative bytes', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(-100)).toBe('0 B');
  });

  it('formats small bytes', () => {
    expect(formatBytes(500)).toBe('500 B');
    expect(formatBytes(1023)).toBe('1023 B');
  });

  it('formats kilobytes, megabytes, gigabytes', () => {
    expect(formatBytes(1024)).toBe('1.00 KB');
    expect(formatBytes(1024 * 1024)).toBe('1.00 MB');
    expect(formatBytes(1572864)).toBe('1.50 MB');
    expect(formatBytes(1024 * 1024 * 1024 * 2.5)).toBe('2.50 GB');
  });
});

describe('formatNumber', () => {
  it('adds thousands separators', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1234567)).toBe('1,234,567');
  });
});

describe('formatDuration', () => {
  it('formats milliseconds and seconds', () => {
    expect(formatDuration(450)).toBe('450ms');
    expect(formatDuration(2500)).toBe('2.5s');
  });
});

describe('truncatePath', () => {
  it('keeps short paths unchanged', () => {
    expect(truncatePath('C:\\test\\file.txt', 50)).toBe('C:\\test\\file.txt');
  });

  it('truncates long paths with ellipsis', () => {
    const longPath = 'C:\\very\\long\\directory\\structure\\with\\many\\nested\\levels\\file.txt';
    const truncated = truncatePath(longPath, 30);
    expect(truncated).toContain('...');
    expect(truncated.length).toBeLessThanOrEqual(30);
  });
});
