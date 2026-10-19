import path from 'node:path';
import type { CleanTarget } from '../../types/index.js';
import { LOCAL_APPDATA, WINDOWS_DIR, PROGRAM_DATA } from '../paths.js';

/**
 * Individual array of crash dumps and diagnostic log targets.
 */
export const SYSTEM_DUMP_DIRECTORIES: CleanTarget[] = [
  {
    id: 'dumps-user-crash',
    name: 'User Crash Dumps',
    category: 'system-dumps',
    description: 'Application crash memory dumps',
    path: path.join(LOCAL_APPDATA, 'CrashDumps'),
    enabledByDefault: true,
  },
  {
    id: 'dumps-wer-archive',
    name: 'WER Report Archive',
    category: 'system-dumps',
    description: 'Windows Error Reporting archived telemetry',
    path: path.join(LOCAL_APPDATA, 'Microsoft', 'Windows', 'WER', 'ReportArchive'),
    enabledByDefault: true,
  },
  {
    id: 'dumps-wer-queue',
    name: 'WER Report Queue',
    category: 'system-dumps',
    description: 'Windows Error Reporting pending queue',
    path: path.join(LOCAL_APPDATA, 'Microsoft', 'Windows', 'WER', 'ReportQueue'),
    enabledByDefault: true,
  },
  {
    id: 'dumps-system-minidump',
    name: 'Windows Minidumps',
    category: 'system-dumps',
    description: 'Kernel and BSOD crash minidumps',
    path: path.join(WINDOWS_DIR, 'Minidump'),
    enabledByDefault: true,
    requiresAdmin: true,
  },
  {
    id: 'dumps-wer-programdata',
    name: 'System WER Archive',
    category: 'system-dumps',
    description: 'System-wide Windows Error Reporting archive',
    path: path.join(PROGRAM_DATA, 'Microsoft', 'Windows', 'WER', 'ReportArchive'),
    enabledByDefault: true,
    requiresAdmin: true,
  },
];
