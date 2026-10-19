import path from 'node:path';
import type { CleanTarget } from '../../types/index.js';
import { LOCAL_APPDATA, ROAMING_APPDATA } from '../paths.js';

/**
 * Individual array of IDE and developer tool cache targets.
 */
export const IDE_CACHE_DIRECTORIES: CleanTarget[] = [
  {
    id: 'ide-vscode-cache',
    name: 'VS Code Cache',
    category: 'ide-caches',
    description: 'Visual Studio Code runtime HTTP cache',
    path: path.join(ROAMING_APPDATA, 'Code', 'Cache'),
    enabledByDefault: true,
  },
  {
    id: 'ide-vscode-cacheddata',
    name: 'VS Code Cached Data',
    category: 'ide-caches',
    description: 'Visual Studio Code V8 code cache',
    path: path.join(ROAMING_APPDATA, 'Code', 'CachedData'),
    enabledByDefault: true,
  },
  {
    id: 'ide-vscode-cachedextensions',
    name: 'VS Code Cached Extensions',
    category: 'ide-caches',
    description: 'Visual Studio Code extension cache',
    path: path.join(ROAMING_APPDATA, 'Code', 'CachedExtensionVSIXs'),
    enabledByDefault: true,
  },
  {
    id: 'ide-vscode-logs',
    name: 'VS Code Logs',
    category: 'ide-caches',
    description: 'Visual Studio Code old session logs',
    path: path.join(ROAMING_APPDATA, 'Code', 'logs'),
    enabledByDefault: true,
  },
  {
    id: 'ide-vite',
    name: 'Vite Cache',
    category: 'ide-caches',
    description: 'Vite development build cache',
    path: path.join(LOCAL_APPDATA, 'vite'),
    enabledByDefault: true,
  },
  {
    id: 'ide-electron',
    name: 'Electron Cache',
    category: 'ide-caches',
    description: 'Electron framework cache',
    path: path.join(LOCAL_APPDATA, 'electron', 'Cache'),
    enabledByDefault: true,
  },
];
