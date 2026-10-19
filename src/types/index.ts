export type CategoryId =
  | 'system-temp'
  | 'system-dumps'
  | 'dev-caches'
  | 'ide-caches'
  | 'browser-caches'
  | 'app-caches'
  | 'windows-update'
  | 'recycle-bin';

export interface CleanTarget {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  path: string;
  enabledByDefault: boolean;
  requiresAdmin?: boolean;
  /** Subdirectory filter (e.g. for browser profiles) */
  allowedSubdirs?: string[];
  /** File extensions or regex filters if applicable */
  fileFilter?: (fileName: string) => boolean;
}

export interface CandidateFile {
  filePath: string;
  size: number;
  mtimeMs: number;
  targetId: string;
  category: CategoryId;
}

export interface TargetScanResult {
  target: CleanTarget;
  exists: boolean;
  path: string;
  files: CandidateFile[];
  totalBytes: number;
  skippedRecent: number;
  skippedUnsafe: number;
  errors: string[];
}

export interface ScanSummary {
  scannedCount: number;
  candidatesCount: number;
  candidateBytes: number;
  skippedRecentCount: number;
  skippedUnsafeCount: number;
  errorCount: number;
  errors: string[];
  resultsByTarget: Map<string, TargetScanResult>;
}

export interface DeleteSummary {
  deletedCount: number;
  deletedBytes: number;
  failedCount: number;
  skippedLockedCount: number;
  skippedUnsafeCount: number;
  emptyDirsRemoved: number;
  errors: string[];
  resultsByTarget: Map<string, { deletedCount: number; deletedBytes: number }>;
}

export interface CliOptions {
  apply?: boolean;
  dryRun?: boolean;
  interactive?: boolean;
  ageDays?: number;
  categories?: string[];
  all?: boolean;
  includeBrowsers?: boolean;
  includeWindowsUpdate?: boolean;
  includeRecycleBin?: boolean;
  promptFolders?: boolean;
  yes?: boolean;
  verbose?: boolean;
}

export interface DriveInfo {
  drive: string;
  totalBytes: number | null;
  freeBytes: number | null;
  usedBytes: number | null;
  freePercent: number | null;
}
