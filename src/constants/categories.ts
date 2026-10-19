import type { CategoryId } from '../types/index.js';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  description: string;
  defaultSelected: boolean;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'system-temp',
    name: 'Temporary Files',
    description: 'User, local, and system temporary files (%TEMP%, Windows\\Temp)',
    defaultSelected: true,
  },
  {
    id: 'system-dumps',
    name: 'Crash Dumps & WER Logs',
    description: 'Application crash dumps, Windows Error Reporting archives, minidumps',
    defaultSelected: true,
  },
  {
    id: 'dev-caches',
    name: 'Package Manager & Dev Caches',
    description: 'npm, Yarn, pnpm, Pip, NuGet, Cargo, Gradle build caches',
    defaultSelected: true,
  },
  {
    id: 'ide-caches',
    name: 'IDE & Tool Caches',
    description: 'VS Code caches/logs, Vite cache, Electron build caches',
    defaultSelected: true,
  },
  {
    id: 'browser-caches',
    name: 'Web Browser Caches',
    description: 'Chrome, Edge, Brave, Firefox, Opera web and shader caches (preserves cookies/logins)',
    defaultSelected: false,
  },
  {
    id: 'app-caches',
    name: 'Application Caches',
    description: 'Discord, Spotify, Slack app and media caches',
    defaultSelected: false,
  },
  {
    id: 'windows-update',
    name: 'Windows Update Downloads',
    description: 'Downloaded Windows update files and Delivery Optimization cache (Admin)',
    defaultSelected: false,
  },
  {
    id: 'recycle-bin',
    name: 'Recycle Bin',
    description: 'Windows Recycle Bin contents across drives',
    defaultSelected: false,
  },
];
