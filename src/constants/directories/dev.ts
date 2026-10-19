import path from 'node:path';
import type { CleanTarget } from '../../types/index.js';
import { USER_HOME, LOCAL_APPDATA } from '../paths.js';

/**
 * Individual array of package manager and development build cache targets.
 */
export const DEV_CACHE_DIRECTORIES: CleanTarget[] = [
  {
    id: 'dev-npm-local',
    name: 'npm Cache (Local AppData)',
    category: 'dev-caches',
    description: 'Node Package Manager cached tarballs & index',
    path: path.join(LOCAL_APPDATA, 'npm-cache'),
    enabledByDefault: true,
  },
  {
    id: 'dev-npm-home',
    name: 'npm Cache (User Home)',
    category: 'dev-caches',
    description: 'npm user home cache (_cacache)',
    path: path.join(USER_HOME, '.npm', '_cacache'),
    enabledByDefault: true,
  },
  {
    id: 'dev-yarn-local',
    name: 'Yarn Cache',
    category: 'dev-caches',
    description: 'Yarn package manager v1 cache',
    path: path.join(LOCAL_APPDATA, 'Yarn', 'Cache'),
    enabledByDefault: true,
  },
  {
    id: 'dev-yarn-berry',
    name: 'Yarn Berry Cache',
    category: 'dev-caches',
    description: 'Modern Yarn cache directory',
    path: path.join(LOCAL_APPDATA, 'yarn', 'berry', 'cache'),
    enabledByDefault: true,
  },
  {
    id: 'dev-pnpm',
    name: 'pnpm Metadata Cache',
    category: 'dev-caches',
    description: 'pnpm package manager metadata cache',
    path: path.join(LOCAL_APPDATA, 'pnpm-cache'),
    enabledByDefault: true,
  },
  {
    id: 'dev-pip',
    name: 'Pip (Python) Cache',
    category: 'dev-caches',
    description: 'Python pip wheels and HTTP download cache',
    path: path.join(LOCAL_APPDATA, 'pip', 'cache'),
    enabledByDefault: true,
  },
  {
    id: 'dev-nuget',
    name: 'NuGet Cache',
    category: 'dev-caches',
    description: '.NET NuGet package download cache',
    path: path.join(LOCAL_APPDATA, 'NuGet', 'v3-cache'),
    enabledByDefault: true,
  },
  {
    id: 'dev-gradle',
    name: 'Gradle Cache',
    category: 'dev-caches',
    description: 'Gradle build tool caches',
    path: path.join(USER_HOME, '.gradle', 'caches'),
    enabledByDefault: false,
  },
  {
    id: 'dev-cargo',
    name: 'Cargo / Rust Cache',
    category: 'dev-caches',
    description: 'Rust cargo downloaded registry cache',
    path: path.join(USER_HOME, '.cargo', 'registry', 'cache'),
    enabledByDefault: false,
  },
];
