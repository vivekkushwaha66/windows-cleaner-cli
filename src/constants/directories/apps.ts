import path from 'node:path';
import type { CleanTarget } from '../../types/index.js';
import { LOCAL_APPDATA, ROAMING_APPDATA } from '../paths.js';

/**
 * Individual array of communication and media application cache targets.
 */
export const APP_CACHE_DIRECTORIES: CleanTarget[] = [
  {
    id: 'app-discord-cache',
    name: 'Discord Cache',
    category: 'app-caches',
    description: 'Discord desktop cache & GPU cache',
    path: path.join(ROAMING_APPDATA, 'discord', 'Cache'),
    enabledByDefault: false,
  },
  {
    id: 'app-discord-codecache',
    name: 'Discord Code Cache',
    category: 'app-caches',
    description: 'Discord V8 code cache',
    path: path.join(ROAMING_APPDATA, 'discord', 'Code Cache'),
    enabledByDefault: false,
  },
  {
    id: 'app-discord-gpucache',
    name: 'Discord GPU Cache',
    category: 'app-caches',
    description: 'Discord GPU shader cache',
    path: path.join(ROAMING_APPDATA, 'discord', 'GPUCache'),
    enabledByDefault: false,
  },
  {
    id: 'app-spotify-storage',
    name: 'Spotify Storage Cache',
    category: 'app-caches',
    description: 'Spotify local audio & artwork cache',
    path: path.join(LOCAL_APPDATA, 'Spotify', 'Storage'),
    enabledByDefault: false,
  },
  {
    id: 'app-spotify-data',
    name: 'Spotify Data Cache',
    category: 'app-caches',
    description: 'Spotify desktop client temporary data',
    path: path.join(LOCAL_APPDATA, 'Spotify', 'Data'),
    enabledByDefault: false,
  },
  {
    id: 'app-slack-cache',
    name: 'Slack Cache',
    category: 'app-caches',
    description: 'Slack desktop application cache',
    path: path.join(ROAMING_APPDATA, 'Slack', 'Cache'),
    enabledByDefault: false,
  },
];
