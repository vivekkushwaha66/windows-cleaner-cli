import path from 'node:path';
import os from 'node:os';
import type { CleanTarget } from '../../types/index.js';
import { LOCAL_APPDATA, WINDOWS_DIR } from '../paths.js';

/**
 * Individual array of temporary directory targets.
 */
export const TEMP_DIRECTORIES: CleanTarget[] = [
  {
    id: 'temp-user',
    name: 'User Temporary Files',
    category: 'system-temp',
    description: 'System user temp directory (%TEMP%)',
    path: os.tmpdir(),
    enabledByDefault: true,
  },
  {
    id: 'temp-local',
    name: 'Local AppData Temp',
    category: 'system-temp',
    description: 'Local AppData temporary directory',
    path: path.join(LOCAL_APPDATA, 'Temp'),
    enabledByDefault: true,
  },
  {
    id: 'temp-windows',
    name: 'Windows System Temp',
    category: 'system-temp',
    description: 'Windows system temp directory (C:\\Windows\\Temp)',
    path: path.join(WINDOWS_DIR, 'Temp'),
    enabledByDefault: true,
    requiresAdmin: true,
  },
  {
    id: 'temp-prefetch',
    name: 'Windows Prefetch',
    category: 'system-temp',
    description: 'Windows application prefetch files',
    path: path.join(WINDOWS_DIR, 'Prefetch'),
    enabledByDefault: false,
    requiresAdmin: true,
  },
  {
    id: 'temp-directx-shader',
    name: 'DirectX Shader Cache',
    category: 'system-temp',
    description: 'Windows DirectX graphics shader cache (D3DSCache)',
    path: path.join(LOCAL_APPDATA, 'D3DSCache'),
    enabledByDefault: true,
  },
  {
    id: 'temp-nvidia-dxcache',
    name: 'NVIDIA DirectX Shader Cache',
    category: 'system-temp',
    description: 'NVIDIA GPU compiled DirectX shader cache',
    path: path.join(LOCAL_APPDATA, 'NVIDIA', 'DXCache'),
    enabledByDefault: true,
  },
  {
    id: 'temp-nvidia-glcache',
    name: 'NVIDIA OpenGL Shader Cache',
    category: 'system-temp',
    description: 'NVIDIA GPU compiled OpenGL shader cache',
    path: path.join(LOCAL_APPDATA, 'NVIDIA', 'GLCache'),
    enabledByDefault: true,
  },
  {
    id: 'temp-amd-dxcache',
    name: 'AMD DirectX Shader Cache',
    category: 'system-temp',
    description: 'AMD GPU compiled DirectX shader cache',
    path: path.join(LOCAL_APPDATA, 'AMD', 'DxCache'),
    enabledByDefault: true,
  },
];
