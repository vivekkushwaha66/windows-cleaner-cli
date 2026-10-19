import path from 'node:path';
import type { CleanTarget } from '../../types/index.js';
import { WINDOWS_DIR, PROGRAM_DATA } from '../paths.js';

const systemDrive = process.env.SystemDrive || 'C:';

/**
 * Individual array of Windows Update staging, upgrade caches, and delivery optimization targets.
 */
export const WINDOWS_UPDATE_DIRECTORIES: CleanTarget[] = [
  {
    id: 'winupdate-download',
    name: 'Windows Update Downloads',
    category: 'windows-update',
    description: 'Downloaded Windows updates installer staging packages',
    path: path.join(WINDOWS_DIR, 'SoftwareDistribution', 'Download'),
    enabledByDefault: false,
    requiresAdmin: true,
  },
  {
    id: 'winupdate-delivery',
    name: 'Delivery Optimization Cache',
    category: 'windows-update',
    description: 'Windows P2P update delivery cache',
    path: path.join(WINDOWS_DIR, 'SoftwareDistribution', 'DeliveryOptimization', 'Cache'),
    enabledByDefault: false,
    requiresAdmin: true,
  },
  {
    id: 'winupdate-datastore-logs',
    name: 'Windows Update DataStore Logs',
    category: 'windows-update',
    description: 'Windows Update service transaction log files',
    path: path.join(WINDOWS_DIR, 'SoftwareDistribution', 'DataStore', 'Logs'),
    enabledByDefault: false,
    requiresAdmin: true,
  },
  {
    id: 'winupdate-cbs-logs',
    name: 'Windows Update CBS Logs',
    category: 'windows-update',
    description: 'Component Based Servicing (CBS) installation and persist logs',
    path: path.join(WINDOWS_DIR, 'Logs', 'CBS'),
    enabledByDefault: false,
    requiresAdmin: true,
  },
  {
    id: 'winupdate-dism-logs',
    name: 'Windows DISM Logs',
    category: 'windows-update',
    description: 'Deployment Image Servicing and Management operation logs',
    path: path.join(WINDOWS_DIR, 'Logs', 'DISM'),
    enabledByDefault: false,
    requiresAdmin: true,
  },
  {
    id: 'winupdate-panther',
    name: 'Windows Setup Panther Logs',
    category: 'windows-update',
    description: 'Windows Setup and feature update temporary action logs',
    path: path.join(WINDOWS_DIR, 'Panther'),
    enabledByDefault: false,
    requiresAdmin: true,
  },
  {
    id: 'winupdate-scanfile',
    name: 'Windows Update Scan Cache',
    category: 'windows-update',
    description: 'Windows Update client scan cache metadata',
    path: path.join(WINDOWS_DIR, 'SoftwareDistribution', 'ScanFile'),
    enabledByDefault: false,
    requiresAdmin: true,
  },
  {
    id: 'winupdate-windows-bt',
    name: 'Previous Windows Upgrade Temp ($WINDOWS.~BT)',
    category: 'windows-update',
    description: 'Temporary installation folder left after major Windows upgrades',
    path: path.join(`${systemDrive}\\`, '$WINDOWS.~BT'),
    enabledByDefault: false,
    requiresAdmin: true,
  },
  {
    id: 'winupdate-windows-ws',
    name: 'Windows Update Assistant Staging ($WINDOWS.~WS)',
    category: 'windows-update',
    description: 'Windows Media Creation / Update Assistant staging folder',
    path: path.join(`${systemDrive}\\`, '$WINDOWS.~WS'),
    enabledByDefault: false,
    requiresAdmin: true,
  },
  {
    id: 'winupdate-bits',
    name: 'BITS Download Queue Cache',
    category: 'windows-update',
    description: 'Background Intelligent Transfer Service download staging files',
    path: path.join(PROGRAM_DATA, 'Microsoft', 'Network', 'Downloader'),
    enabledByDefault: false,
    requiresAdmin: true,
  },
];
