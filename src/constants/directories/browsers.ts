import path from 'node:path';
import type { CleanTarget } from '../../types/index.js';
import { LOCAL_APPDATA } from '../paths.js';

/**
 * Common Chromium cache subdirectories (cookies, history, logins are NEVER touched).
 */
export const CHROMIUM_ALLOWED_CACHE_SUBDIRS = [
  'Cache',
  'Code Cache',
  'GPUCache',
  'DawnCache',
  'GrShaderCache',
  'ShaderCache',
  'Media Cache',
];

/**
 * Firefox & Gecko cache subdirectories.
 */
export const FIREFOX_ALLOWED_CACHE_SUBDIRS = [
  'cache2',
  'startupCache',
  'jumpListCache',
  'ShaderCache',
];

/**
 * Individual array of web browser cache targets.
 */
export const BROWSER_CACHE_DIRECTORIES: CleanTarget[] = [
  // ----------------------------------------------------
  // Brave Browser (Stable, Beta, Nightly)
  // ----------------------------------------------------
  {
    id: 'browser-brave',
    name: 'Brave Browser Cache',
    category: 'browser-caches',
    description: 'Brave Browser web, code, and shader caches',
    path: path.join(LOCAL_APPDATA, 'BraveSoftware', 'Brave-Browser', 'User Data'),
    enabledByDefault: false,
    allowedSubdirs: CHROMIUM_ALLOWED_CACHE_SUBDIRS,
  },
  {
    id: 'browser-brave-beta',
    name: 'Brave Browser Beta Cache',
    category: 'browser-caches',
    description: 'Brave Browser Beta edition caches',
    path: path.join(LOCAL_APPDATA, 'BraveSoftware', 'Brave-Browser-Beta', 'User Data'),
    enabledByDefault: false,
    allowedSubdirs: CHROMIUM_ALLOWED_CACHE_SUBDIRS,
  },
  {
    id: 'browser-brave-nightly',
    name: 'Brave Browser Nightly Cache',
    category: 'browser-caches',
    description: 'Brave Browser Nightly preview caches',
    path: path.join(LOCAL_APPDATA, 'BraveSoftware', 'Brave-Browser-Nightly', 'User Data'),
    enabledByDefault: false,
    allowedSubdirs: CHROMIUM_ALLOWED_CACHE_SUBDIRS,
  },

  // ----------------------------------------------------
  // Google Chrome (Stable, Beta, Canary)
  // ----------------------------------------------------
  {
    id: 'browser-chrome',
    name: 'Google Chrome Cache',
    category: 'browser-caches',
    description: 'Google Chrome web, shader, and code cache',
    path: path.join(LOCAL_APPDATA, 'Google', 'Chrome', 'User Data'),
    enabledByDefault: false,
    allowedSubdirs: CHROMIUM_ALLOWED_CACHE_SUBDIRS,
  },
  {
    id: 'browser-chrome-beta',
    name: 'Google Chrome Beta Cache',
    category: 'browser-caches',
    description: 'Google Chrome Beta web and code cache',
    path: path.join(LOCAL_APPDATA, 'Google', 'Chrome Beta', 'User Data'),
    enabledByDefault: false,
    allowedSubdirs: CHROMIUM_ALLOWED_CACHE_SUBDIRS,
  },
  {
    id: 'browser-chrome-canary',
    name: 'Google Chrome Canary Cache',
    category: 'browser-caches',
    description: 'Google Chrome Canary (SxS) cache',
    path: path.join(LOCAL_APPDATA, 'Google', 'Chrome SxS', 'User Data'),
    enabledByDefault: false,
    allowedSubdirs: CHROMIUM_ALLOWED_CACHE_SUBDIRS,
  },

  // ----------------------------------------------------
  // Microsoft Edge (Stable, Beta, Dev, Canary)
  // ----------------------------------------------------
  {
    id: 'browser-edge',
    name: 'Microsoft Edge Cache',
    category: 'browser-caches',
    description: 'Microsoft Edge web, shader, and code cache',
    path: path.join(LOCAL_APPDATA, 'Microsoft', 'Edge', 'User Data'),
    enabledByDefault: false,
    allowedSubdirs: CHROMIUM_ALLOWED_CACHE_SUBDIRS,
  },
  {
    id: 'browser-edge-beta',
    name: 'Microsoft Edge Beta Cache',
    category: 'browser-caches',
    description: 'Microsoft Edge Beta preview cache',
    path: path.join(LOCAL_APPDATA, 'Microsoft', 'Edge Beta', 'User Data'),
    enabledByDefault: false,
    allowedSubdirs: CHROMIUM_ALLOWED_CACHE_SUBDIRS,
  },
  {
    id: 'browser-edge-dev',
    name: 'Microsoft Edge Dev Cache',
    category: 'browser-caches',
    description: 'Microsoft Edge Dev build cache',
    path: path.join(LOCAL_APPDATA, 'Microsoft', 'Edge Dev', 'User Data'),
    enabledByDefault: false,
    allowedSubdirs: CHROMIUM_ALLOWED_CACHE_SUBDIRS,
  },
  {
    id: 'browser-edge-canary',
    name: 'Microsoft Edge Canary Cache',
    category: 'browser-caches',
    description: 'Microsoft Edge Canary build cache',
    path: path.join(LOCAL_APPDATA, 'Microsoft', 'Edge SxS', 'User Data'),
    enabledByDefault: false,
    allowedSubdirs: CHROMIUM_ALLOWED_CACHE_SUBDIRS,
  },

  // ----------------------------------------------------
  // Arc Browser & Vivaldi
  // ----------------------------------------------------
  {
    id: 'browser-arc',
    name: 'Arc Browser Cache',
    category: 'browser-caches',
    description: 'The Browser Company Arc browser caches',
    path: path.join(LOCAL_APPDATA, 'Arc', 'User Data'),
    enabledByDefault: false,
    allowedSubdirs: CHROMIUM_ALLOWED_CACHE_SUBDIRS,
  },
  {
    id: 'browser-vivaldi',
    name: 'Vivaldi Browser Cache',
    category: 'browser-caches',
    description: 'Vivaldi web browser cache and GPU cache',
    path: path.join(LOCAL_APPDATA, 'Vivaldi', 'User Data'),
    enabledByDefault: false,
    allowedSubdirs: CHROMIUM_ALLOWED_CACHE_SUBDIRS,
  },

  // ----------------------------------------------------
  // Mozilla Firefox & Waterfox
  // ----------------------------------------------------
  {
    id: 'browser-firefox',
    name: 'Mozilla Firefox Cache',
    category: 'browser-caches',
    description: 'Mozilla Firefox profile cache2 and startup cache',
    path: path.join(LOCAL_APPDATA, 'Mozilla', 'Firefox', 'Profiles'),
    enabledByDefault: false,
    allowedSubdirs: FIREFOX_ALLOWED_CACHE_SUBDIRS,
  },
  {
    id: 'browser-waterfox',
    name: 'Waterfox Browser Cache',
    category: 'browser-caches',
    description: 'Waterfox profile cache2 and startup cache',
    path: path.join(LOCAL_APPDATA, 'Waterfox', 'Profiles'),
    enabledByDefault: false,
    allowedSubdirs: FIREFOX_ALLOWED_CACHE_SUBDIRS,
  },

  // ----------------------------------------------------
  // Opera & Opera GX
  // ----------------------------------------------------
  {
    id: 'browser-opera',
    name: 'Opera Browser Cache',
    category: 'browser-caches',
    description: 'Opera web browser cache',
    path: path.join(LOCAL_APPDATA, 'Opera Software', 'Opera Stable', 'Cache'),
    enabledByDefault: false,
  },
  {
    id: 'browser-opera-gx',
    name: 'Opera GX Cache',
    category: 'browser-caches',
    description: 'Opera GX gaming browser cache',
    path: path.join(LOCAL_APPDATA, 'Opera Software', 'Opera GX Stable', 'Cache'),
    enabledByDefault: false,
  },

  // ----------------------------------------------------
  // Chromium & Yandex
  // ----------------------------------------------------
  {
    id: 'browser-chromium',
    name: 'Chromium Cache',
    category: 'browser-caches',
    description: 'Vanilla Chromium open-source browser cache',
    path: path.join(LOCAL_APPDATA, 'Chromium', 'User Data'),
    enabledByDefault: false,
    allowedSubdirs: CHROMIUM_ALLOWED_CACHE_SUBDIRS,
  },
  {
    id: 'browser-yandex',
    name: 'Yandex Browser Cache',
    category: 'browser-caches',
    description: 'Yandex web browser cache',
    path: path.join(LOCAL_APPDATA, 'Yandex', 'YandexBrowser', 'User Data'),
    enabledByDefault: false,
    allowedSubdirs: CHROMIUM_ALLOWED_CACHE_SUBDIRS,
  },
];
