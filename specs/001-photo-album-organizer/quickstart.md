# Quickstart Guide: Photo Album Organizer

**Target Time**: Setup complete and running within 15 minutes
**Feature**: Photo Album Organizer
**Date**: 2026-02-14

## Prerequisites

Before starting, ensure you have:

- **Node.js**: v18.0.0 or higher ([download](https://nodejs.org/))
- **Rust**: Latest stable version ([install via rustup](https://rustup.rs/))
- **Git**: For cloning the repository
- **System Requirements**:
  - Windows 10+ / macOS 11+ / Linux (Ubuntu 20.04+)
  - 2GB RAM minimum
  - 500MB free disk space

**Verify installations:**
```bash
node --version  # Should show v18.0.0+
npm --version   # Should show 9.0.0+
rustc --version # Should show 1.70.0+
cargo --version # Should show 1.70.0+
```

---

## Step 1: Clone and Setup (2 minutes)

```bash
# Clone the repository
git clone <repository-url>
cd photo-album-organizer

# Checkout feature branch
git checkout 001-photo-album-organizer

# Install dependencies
npm install
```

**Expected output:**
```
added 45 packages in 15s
```

---

## Step 2: Configure Tauri (1 minute)

Tauri should be pre-configured, but verify the setup:

```bash
# Check Tauri CLI is available
npm run tauri --version
```

**Expected output:**
```
tauri-cli 1.6.x
```

If Tauri is not installed:
```bash
npm install --save-dev @tauri-apps/cli
```

---

## Step 3: Initialize Database Schema (1 minute)

The database initializes automatically on first run, but you can verify the schema:

```bash
# Database will be created at:
# - Windows: %APPDATA%\PhotoAlbumOrganizer\albums.db
# - macOS: ~/Library/Application Support/com.photoalbumorganizer/albums.db
# - Linux: ~/.local/share/photoalbumorganizer/albums.db
```

Schema is defined in `src-tauri/src/database.rs` and creates automatically when the app launches.

---

## Step 4: Run Development Server (2 minutes)

Start the development server with hot reload:

```bash
npm run tauri dev
```

**What happens:**
1. Vite development server starts on `http://localhost:5173`
2. Tauri compiles Rust backend (first compile takes ~2 minutes)
3. Desktop application window opens automatically
4. Hot reload enabled for frontend changes

**Expected output:**
```
   Compiling tauri v1.6.x
   Compiling photo-album-organizer v0.1.0
    Finished dev [unoptimized + debuginfo] target(s) in 1m 45s
```

**Troubleshooting:**
- **Port 5173 in use**: Change port in `vite.config.js` and `tauri.conf.json`
- **Rust compile errors**: Run `cargo clean` in `src-tauri/` and retry
- **Window doesn't open**: Check console for errors; try `npm run tauri dev -- --verbose`

---

## Step 5: Verify Application (5 minutes)

### 5.1 Test Album Creation

1. Click **"Create Album"** button
2. Enter name: "Test Album"
3. Select date: Today's date
4. Click **"Save"**

**Expected**: Album appears in main view sorted by date

### 5.2 Test Photo Addition

1. Click on the "Test Album" you just created
2. Click **"Add Photos"** button
3. Select 1-3 image files from your system (JPEG, PNG, or GIF)
4. Click **"Open"**

**Expected**: Photos appear in tile grid within 2 seconds

### 5.3 Test Drag-and-Drop

1. Return to main view (click back button)
2. Create a second album with a different date
3. Click and hold an album card
4. Drag it to a new position
5. Release

**Expected**: Album moves immediately; order persists after refresh

### 5.4 Verify Data Persistence

1. Close the application window
2. Restart with `npm run tauri dev`
3. Verify albums and photos remain

**Expected**: All data persists; database successfully storing metadata

---

## Project Structure

```
photo-album-organizer/
├── src/                     # Frontend code (Vite + Vanilla JS)
│   ├── main.js             # Entry point
│   ├── services/           # Business logic layer
│   │   ├── albumService.js # Album operations
│   │   └── photoService.js # Photo operations
│   ├── components/         # UI components
│   │   ├── AlbumGrid.js   # Main album view
│   │   ├── PhotoTile.js   # Tile-based photo display
│   │   └── DragDrop.js    # Drag-and-drop handler
│   ├── styles/            # CSS files
│   └── index.html         # HTML entry point
│
├── src-tauri/             # Backend code (Rust)
│   ├── src/
│   │   ├── main.rs       # Tauri app setup
│   │   ├── commands.rs   # Tauri command handlers
│   │   ├── database.rs   # SQLite operations
│   │   ├── photos.rs     # Image processing
│   │   └── validation.rs # File validation
│   ├── Cargo.toml        # Rust dependencies
│   └── tauri.conf.json   # Tauri configuration
│
├── tests/                # Tests
│   ├── unit/            # Unit tests (Vitest)
│   ├── integration/     # Integration tests
│   └── e2e/            # End-to-end tests (WebDriverIO)
│
├── specs/              # Feature specifications
│   └── 001-photo-album-organizer/
│       ├── spec.md
│       ├── plan.md
│       ├── data-model.md
│       └── contracts/
│
├── vite.config.js     # Vite configuration
├── package.json       # Node dependencies and scripts
└── README.md         # Project overview
```

---

## Development Workflow

### Frontend Development (Hot Reload)

Edit files in `src/` directory. Changes hot-reload automatically:

```javascript
// src/main.js
console.log('Hello from frontend!');
// Save file → changes appear immediately in running app
```

### Backend Development (Restart Required)

Edit files in `src-tauri/src/`. Restart dev server to see changes:

```rust
// src-tauri/src/commands.rs
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}
// Save → Stop dev server (Ctrl+C) → Run `npm run tauri dev` again
```

### Running Tests

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests (app must be running)
npm run test:e2e

# Run all tests
npm run test:all
```

---

## Common Commands

```bash
# Development
npm run tauri dev          # Start dev server

# Building
npm run tauri build        # Build production app

# Testing
npm run test               # Run all tests
npm run test:watch         # Run tests in watch mode

# Linting
npm run lint               # Check code quality
npm run lint:fix           # Auto-fix issues

# Formatting
npm run format             # Format code with Prettier
```

---

## Debugging

### Frontend Debugging

1. Open DevTools in running app: `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (macOS)
2. Console, Network, and Elements tabs available
3. Set breakpoints in Sources tab

### Backend Debugging

Add debug prints in Rust code:

```rust
println!("Debug: Album ID is {}", album_id);
```

Output appears in terminal where `npm run tauri dev` is running.

For advanced debugging, use VS Code with `rust-analyzer` extension.

---

## Database Inspection

### SQLite Database Location

Find your database:
```bash
# macOS/Linux
open ~/Library/Application\ Support/com.photoalbumorganizer/

# Windows
explorer %APPDATA%\PhotoAlbumOrganizer\
```

### Inspect with SQLite Tool

```bash
# Install sqlite3 CLI
# macOS: brew install sqlite3
# Ubuntu: sudo apt install sqlite3
# Windows: download from sqlite.org

# Open database
sqlite3 ~/Library/Application\ Support/com.photoalbumorganizer/albums.db

# Run queries
sqlite> SELECT * FROM albums;
sqlite> SELECT COUNT(*) FROM photos;
sqlite> .schema albums
sqlite> .exit
```

---

## Performance Profiling

### Measure Thumbnail Generation Time

```javascript
// Add to photoService.js
console.time('thumbnail-generation');
const thumbnail = await generateThumbnail(filePath);
console.timeEnd('thumbnail-generation');
// Output: thumbnail-generation: 85ms
```

### Measure Database Query Time

```rust
// Add to database.rs
use std::time::Instant;

let start = Instant::now();
let albums = query_albums(db)?;
println!("Query took: {:?}", start.elapsed());
```

---

## Troubleshooting

### Issue: "Failed to fetch" errors in console

**Cause**: Backend not responding
**Fix**: Check terminal for Rust compile errors; restart dev server

### Issue: Photos not displaying

**Cause**: File paths invalid or missing permissions
**Fix**:
1. Check photo file still exists at path
2. Verify file permissions (must be readable)
3. Check console for validation errors

### Issue: Drag-and-drop not working

**Cause**: Event listeners not attached
**Fix**:
1. Check console for JavaScript errors
2. Verify `draggable="true"` on album elements
3. Ensure event handlers registered on mount

### Issue: Database locked error

**Cause**: Multiple app instances accessing same database
**Fix**: Close all running instances and restart

### Issue: Slow thumbnail rendering

**Cause**: Large image files or many photos
**Fix**:
1. Verify files under 25MB limit
2. Check CPU usage during rendering
3. Consider reducing max photos per album

---

## Getting Help

- **Documentation**: `/specs/001-photo-album-organizer/`
- **Data Model**: `data-model.md`
- **API Contracts**: `contracts/tauri-commands.md`
- **Tauri Docs**: https://tauri.app/v1/guides/
- **Vite Docs**: https://vitejs.dev/guide/

---

## Next Steps

Once setup is complete:

1. **Read the spec**: `/specs/001-photo-album-organizer/spec.md`
2. **Review data model**: `/specs/001-photo-album-organizer/data-model.md`
3. **Understand contracts**: `/specs/001-photo-album-organizer/contracts/`
4. **Run tests**: `npm run test:all`
5. **Start implementing**: Follow TDD workflow (tests first!)

**Estimated time to productive development**: 15 minutes from clone to first test passing.
