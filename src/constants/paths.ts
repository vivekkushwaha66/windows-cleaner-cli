import path from 'node:path';
import os from 'node:os';
import { normalizePath } from '../utils/paths.js';

// Base system paths
export const USER_HOME = os.homedir();
export const USER_PROFILE = process.env.USERPROFILE || USER_HOME;
export const LOCAL_APPDATA = process.env.LOCALAPPDATA || path.join(USER_HOME, 'AppData', 'Local');
export const ROAMING_APPDATA = process.env.APPDATA || path.join(USER_HOME, 'AppData', 'Roaming');
export const WINDOWS_DIR = process.env.WINDIR || 'C:\\Windows';
export const PROGRAM_DATA = process.env.ProgramData || 'C:\\ProgramData';
export const PROGRAM_FILES = process.env.ProgramFiles || 'C:\\Program Files';
export const PROGRAM_FILES_X86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';

/**
 * Individual array of personal user data folders that must NEVER be touched (not even as subpaths).
 */
export const PROTECTED_USER_PERSONAL_FOLDERS: string[] = [
  path.join(USER_PROFILE, 'Desktop'),
  path.join(USER_PROFILE, 'Documents'),
  path.join(USER_PROFILE, 'Downloads'),
  path.join(USER_PROFILE, 'Pictures'),
  path.join(USER_PROFILE, 'Videos'),
  path.join(USER_PROFILE, 'Music'),
  path.join(USER_PROFILE, 'Contacts'),
  path.join(USER_PROFILE, 'Favorites'),
  path.join(USER_PROFILE, 'Saved Games'),
].map(normalizePath);

/**
 * Individual array of user profile root directories that must not be targeted directly.
 */
export const PROTECTED_USER_ROOTS: string[] = [
  USER_HOME,
  USER_PROFILE,
].map(normalizePath);

/**
 * Combined list of all protected user directories.
 */
export const PROTECTED_USER_DIRECTORIES: string[] = [
  ...PROTECTED_USER_ROOTS,
  ...PROTECTED_USER_PERSONAL_FOLDERS,
];

/**
 * Individual array of critical Windows system directories that must NEVER be touched directly.
 */
export const PROTECTED_SYSTEM_DIRECTORIES: string[] = [
  WINDOWS_DIR,
  path.join(WINDOWS_DIR, 'System32'),
  path.join(WINDOWS_DIR, 'SysWOW64'),
  PROGRAM_FILES,
  PROGRAM_FILES_X86,
  PROGRAM_DATA,
  path.resolve(USER_PROFILE, '..'), // e.g. C:\Users
].map(normalizePath);

/**
 * Combined list of all protected directory paths.
 */
export const PROTECTED_PATHS: string[] = [
  ...PROTECTED_USER_DIRECTORIES,
  ...PROTECTED_SYSTEM_DIRECTORIES,
];
