# 🧹 @vivekkushwaha66/windows-cleaner-cli (`winclean`)

[![npm version](https://img.shields.io/npm/v/@vivekkushwaha66/windows-cleaner-cli.svg?style=flat-square)](https://www.npmjs.com/package/@vivekkushwaha66/windows-cleaner-cli)
[![license](https://img.shields.io/github/license/vivekkushwaha66/windows-cleaner-cli.svg?style=flat-square)](LICENSE)
[![node](https://img.shields.io/badge/node-%3E%3D18.0.0-blue.svg?style=flat-square)](https://nodejs.org/)
[![platform](https://img.shields.io/badge/platform-windows-0078D6.svg?style=flat-square)](https://www.microsoft.com/windows)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?style=flat-square)](https://www.typescriptlang.org/)

A safe, interactive, high-performance Windows disk cleaner CLI built with TypeScript. Reclaim gigabytes of wasted space from temp directories, package manager caches, crash dumps, and build artifacts without risking personal files or system stability.

```
  ██╗    ██╗██╗███╗   ██╗ ██████╗██╗     ███████╗ █████╗ ███╗   ██╗
  ██║    ██║██║████╗  ██║██╔════╝██║     ██╔════╝██╔══██╗████╗  ██║
  ██║ █╗ ██║██║██╔██╗ ██║██║     ██║     █████╗  ███████║██╔██╗ ██║
  ██║███╗██║██║██║╚██╗██║██║     ██║     ██╔══╝  ██╔══██║██║╚██╗██║
  ╚███╔███╔╝██║██║ ╚████║╚██████╗███████╗███████╗██║  ██║██║ ╚████║
   ╚══╝╚══╝ ╚═╝╚═╝  ╚═══╝ ╚═════╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝
               High-Performance Windows Disk Cleanup CLI
```

> [!IMPORTANT]
> **⚠️ Prerequisites for Non-Node.js Users:**
> Windows Cleaner CLI runs on **Node.js (18.0.0 or higher)**.
>
> If you don't have Node.js installed, install it in seconds with Windows Package Manager:
> ```powershell
> winget install OpenJS.NodeJS.LTS
> ```
> Or download the installer directly from [nodejs.org](https://nodejs.org/).
>
> **💡 Double-Click Launcher:** If you cloned or downloaded this repository, you can simply run **`winclean.cmd`** or **`winclean.ps1`**. They automatically verify if Node.js is installed and will offer to install it for you if missing!

---

## ✨ Features

- 🛡️ **Zero-Risk Safety Architecture**: Never touches drive roots, user profiles (`Documents`, `Desktop`, `Downloads`), or system critical directories.
- 🔍 **Safe Dry-Run By Default**: Scans and outputs tabular candidate reports with accurate file sizes before deleting a single byte.
- 🎛️ **Granular Folder Checks**: Interactive review prompt allows you to inspect and toggle specific folders, or require individual confirmation before deleting each folder (`-p` / `--prompt-folders`).
- 📊 **Dynamic CLI Progress Bars**: Real-time progress bars with elapsed time, ETA, items/sec, and formatted bytes freed.
- 🎨 **Colored Console Messages**: Rich terminal interface with disk capacity meters, status badges, and formatted tables.
- ⚡ **High Performance**: Recursively scans tens of thousands of files in seconds using native Node.js streams and fs APIs.
- 🔒 **Resilient Windows File Handling**: Smoothly handles in-use/locked files (`EBUSY`, `EPERM`) without crashing or aborting.
- 📦 **Modern TypeScript & ESM**: Strictly typed with TypeScript 5.7 and compiled to modern ESM.

---

## 🚀 Quick Start

### Run with `npx` (No installation needed)

```bash
# Safe dry-run scan
npx @vivekkushwaha66/windows-cleaner-cli scan

# Interactive mode
npx @vivekkushwaha66/windows-cleaner-cli -i
```

### Global Installation

```bash
npm install -g @vivekkushwaha66/windows-cleaner-cli
```

Once installed, use the short `winclean` command:

```bash
winclean --help
```

---

## 📖 Usage & Examples

### 1. Safe Dry-Run (Inspect Reclaimable Space)

```bash
winclean scan
```

### 2. Interactive Wizard (Recommended)

Interactively select which categories to clean and review target folders before deleting:

```bash
winclean -i
```

### 3. Folder-by-Folder Check Before Deletion

Prompt for user confirmation before deleting each individual folder:

```bash
winclean clean --prompt-folders
```

### 4. Custom Age Cutoff

Clean files older than 14 days (default is 7 days):

```bash
winclean --apply --age-days=14
```

### 5. Include Web Browser Caches

Clean Chrome, Edge, Brave, and Firefox caches (preserves cookies, sessions, passwords, and history):

```bash
winclean clean --include-browsers
```

### 6. Clean Specific Categories

```bash
winclean clean -c dev-caches system-temp
```

### 7. Automated / Unattended Run

```bash
winclean clean --apply --yes
```

---

## 🗂️ Supported Cleanup Targets

| Category | Targets Cleaned | Description | Default |
|---|---|---|:---:|
| **Temporary Files** (`system-temp`) | `%TEMP%`, `%LOCALAPPDATA%\Temp`, `Windows\Temp`, DirectX & GPU shader caches (`D3DSCache`, NVIDIA DX/GL, AMD) | User, system, and GPU shader temporary files | ✅ Yes |
| **Crash Dumps & Diagnostics** (`system-dumps`) | `%LOCALAPPDATA%\CrashDumps`, WER Report Archives, WER Queue, Minidumps | Application crashes and Windows Error Reporting telemetry | ✅ Yes |
| **Dev & Package Caches** (`dev-caches`) | `npm`, `yarn` (v1 & Berry), `pnpm`, `pip`, `nuget`, `gradle`, `cargo` | Downloaded tarballs and build caches | ✅ Yes |
| **IDE & Tool Caches** (`ide-caches`) | VS Code (Cache, CachedData, Extensions, Logs), Vite, Electron | Editor runtime caches and outdated logs | ✅ Yes |
| **Web Browser Caches** (`browser-caches`) | Brave (Stable, Beta, Nightly), Chrome (Stable, Beta, Canary), Edge (Stable, Beta, Dev, Canary), Arc, Vivaldi, Firefox, Waterfox, Opera, Opera GX, Chromium, Yandex | HTTP, code, and shader caches (*preserves cookies, passwords, history, logins*) | ⚙️ Opt-in |
| **Application Caches** (`app-caches`) | Discord, Spotify, Slack | Media and temporary application caches | ⚙️ Opt-in |
| **Windows Update & Upgrades** (`windows-update`) | `SoftwareDistribution\Download`, Delivery Optimization, CBS Logs, DISM Logs, Panther, `$WINDOWS.~BT`, `$WINDOWS.~WS`, BITS | Old update downloads, upgrade staging, and servicing logs (*Requires Admin*) | ⚙️ Opt-in |
| **Recycle Bin** (`recycle-bin`) | Windows Recycle Bin | Empties recycle bin across all drives | ⚙️ Opt-in |

---

## 🛡️ Safety Guarantees

1. **Root Drive Guard**: Never operates directly on a root drive (e.g. `C:\`, `D:\`).
2. **Protected Paths Blacklist**: User Profile root, `Desktop`, `Documents`, `Downloads`, `Pictures`, `Videos`, `Music`, `C:\Windows`, `C:\Windows\System32`, and `C:\Program Files` are strictly protected and blocked.
3. **Whitelist Validation**: Every candidate file must resolve inside an explicitly approved whitelist directory.
4. **Symlink / Junction Protection**: Symbolic links and directory junctions are never traversed or unlinked to prevent unintended data loss.
5. **Immediate Pre-Delete Re-check**: Right before calling `fs.unlinkSync`, the file is re-stated to verify it is still a regular file, has not been modified after the age cutoff, and is not a link.
6. **Confirmation Step**: Prompts the user before deleting files, with folder review and individual folder prompt options.

---

## 🛠️ CLI Options Reference

```text
Usage: winclean [options] [command]

A safe, interactive, high-performance Windows disk cleaner CLI.

Options:
  -V, --version                     Output the version number
  -a, --apply                       Apply deletion of eligible files (default: safe dry-run)
  -d, --dry-run                     Explicit dry-run mode (nothing will be deleted)
  -i, --interactive                 Interactive wizard to select categories and confirm folders
  --age-days <days>                 Only clean files older than specified days (default: 7)
  -c, --categories <categories...>  Specific categories to clean
  --all                             Include all standard categories
  --include-browsers                Include Web browser caches (Chrome, Edge, Brave, Firefox, Opera)
  --include-windows-update          Include Windows Update downloads cache (Requires Admin)
  --include-recycle-bin             Empty Windows Recycle Bin
  -p, --prompt-folders              Prompt for confirmation before deleting each individual folder
  -y, --yes                         Skip confirmation prompts
  -v, --verbose                     Show verbose output
  -h, --help                        Display help for command

Commands:
  scan [options]                    Perform a fast dry-run scan to inspect reclaimable disk space
  clean [options]                   Clean temporary files, build caches, and system junk
```

---

## 💻 Programmatic API

You can also use `windows-cleaner-cli` as a library in your own Node.js / TypeScript projects:

```typescript
import {
  scanTargets,
  deleteCandidateFiles,
  getCleanTargets,
  getAllowedRoots,
  isAdministrator,
  getDriveStats
} from 'windows-cleaner-cli';

// Check admin privileges
const isAdmin = isAdministrator();

// Retrieve drive stats
const drive = getDriveStats('C:\\');
console.log(`Free space: ${drive.freeBytes} bytes`);

// Scan targets
const targets = getCleanTargets().filter(t => t.enabledByDefault);
const allowedRoots = getAllowedRoots(targets);

const scanSummary = scanTargets({
  targets,
  allowedRoots,
  ageDays: 7,
  isAdmin,
});

console.log(`Found ${scanSummary.candidatesCount} files (${scanSummary.candidateBytes} bytes)`);
```

---

## 🚢 Publishing to npm

Follow these steps to publish this package to the npm registry:

### 1. Create an npm Account & Login
If you haven't already, create a free account on [npmjs.com](https://www.npmjs.com/). Then log in from your terminal:

```bash
npm login
```
Verify your authenticated username:
```bash
npm whoami
```

### 2. Verify Your Scoped Package Name
The package is pre-configured under your scope:
```json
{
  "name": "@vivekkushwaha66/windows-cleaner-cli",
  "publishConfig": {
    "access": "public"
  }
}
```

### 3. Verify the Build & Dry-Run
Run a dry-run test pack to preview the exact files included in your release:

```bash
# Automatically runs typecheck, vitest tests, and tsup build
npm run prepublishOnly

# Inspect the tarball contents without publishing
npm pack --dry-run
```

### 4. Publish to npm
Since `"publishConfig": { "access": "public" }` is pre-configured, simply run:

```bash
npm publish
```
*(Or `npm publish --access public`)*

### 5. Publishing Updates in the Future
Whenever you make updates and want to release a new version:
```bash
npm version patch   # increments 1.0.0 -> 1.0.1 (or minor / major)
git push --follow-tags
npm publish
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Install dependencies: `npm install`
4. Run tests: `npm test`
5. Run build: `npm run build`
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

---

## 📄 License

Distributed under the [MIT License](LICENSE).
Copyright (c) 2026 Vivek Kushwaha.
