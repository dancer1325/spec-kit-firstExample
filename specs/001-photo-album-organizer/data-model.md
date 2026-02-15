# Data Model: Photo Album Organizer

**Feature**: Photo Album Organizer
**Date**: 2026-02-14
**Database**: SQLite (via tauri-plugin-sql)

## Overview

The data model supports organizing photos into date-based albums with custom ordering. Photos remain in their original file system locations; only metadata and references are stored in the database. All entities use integer primary keys for performance.

## Entity Relationship Diagram

```
┌─────────────────┐         ┌─────────────────┐
│     Albums      │         │     Photos      │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │───┐     │ id (PK)         │
│ name            │   │     │ album_id (FK)   │───┐
│ date            │   └────<│ file_path       │   │
│ display_order   │         │ filename        │   │
│ created_at      │         │ file_size       │   │
│ updated_at      │         │ added_at        │   │
└─────────────────┘         │ display_order   │   │
                            └─────────────────┘   │
                                                  │
                            ┌─────────────────────┘
                            │ One album contains
                            │ zero or more photos
                            └─> 1:N relationship
```

## Schema Definitions

### Albums Table

Stores album metadata including name, associated date, and custom display ordering.

```sql
CREATE TABLE albums (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL CHECK(length(name) > 0 AND length(name) <= 255),
    date TEXT NOT NULL, -- ISO 8601 format: YYYY-MM-DD
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Index for chronological sorting (default view)
CREATE INDEX idx_albums_date ON albums(date DESC);

-- Index for custom ordering (drag-and-drop)
CREATE INDEX idx_albums_display_order ON albums(display_order ASC);

-- Index for name searching
CREATE INDEX idx_albums_name ON albums(name COLLATE NOCASE);

-- Trigger to update updated_at on modification
CREATE TRIGGER albums_updated_at
AFTER UPDATE ON albums
BEGIN
    UPDATE albums SET updated_at = datetime('now') WHERE id = NEW.id;
END;
```

**Field Constraints:**
- `name`: Required, 1-255 characters
- `date`: ISO 8601 date format (YYYY-MM-DD)
- `display_order`: Integer for manual positioning; lower numbers appear first
- `created_at`, `updated_at`: Automatic timestamps in ISO 8601 format

**Business Rules:**
- Album names do not need to be unique (user may have multiple "Vacation" albums for different dates)
- Date determines chronological position; display_order overrides for custom arrangements
- Deleting an album cascades to delete all photo references (but not the actual image files)

### Photos Table

Stores photo metadata and file references. Actual image files remain in their original locations.

```sql
CREATE TABLE photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    album_id INTEGER NOT NULL,
    file_path TEXT NOT NULL UNIQUE, -- Absolute path to photo file
    filename TEXT NOT NULL, -- Original filename for display
    file_size INTEGER NOT NULL CHECK(file_size > 0 AND file_size <= 26214400), -- Max 25MB
    added_at TEXT NOT NULL DEFAULT (datetime('now')),
    display_order INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
);

-- Index for album lookups (primary query pattern)
CREATE INDEX idx_photos_album_id ON photos(album_id);

-- Index for display order within albums
CREATE INDEX idx_photos_display_order ON photos(album_id, display_order ASC);

-- Index for file path uniqueness and orphan detection
CREATE INDEX idx_photos_file_path ON photos(file_path);

-- Trigger to validate file_path is absolute
CREATE TRIGGER photos_validate_path
BEFORE INSERT ON photos
BEGIN
    SELECT RAISE(ABORT, 'file_path must be absolute')
    WHERE NEW.file_path NOT LIKE '/%' -- Unix/macOS
      AND NEW.file_path NOT LIKE '_:\%'; -- Windows
END;
```

**Field Constraints:**
- `album_id`: Required foreign key to albums table
- `file_path`: Absolute file system path; must be unique across all photos
- `filename`: Display name extracted from file_path
- `file_size`: Bytes; maximum 26,214,400 (25MB)
- `added_at`: Automatic timestamp when photo added to album
- `display_order`: Integer for ordering within album (not used in current version; reserved for future photo reordering feature)

**Business Rules:**
- Each photo belongs to exactly one album
- File paths must be absolute (validated by trigger)
- Same physical file cannot be added to multiple albums (enforced by UNIQUE constraint on file_path)
- Removing a photo from an album deletes the reference but not the file
- File size validated on insert to enforce 25MB limit

## Application Data Storage

**Database Location:**
- **Windows**: `%APPDATA%\PhotoAlbumOrganizer\albums.db`
- **macOS**: `~/Library/Application Support/com.photoalbumorganizer/albums.db`
- **Linux**: `~/.local/share/photoalbumorganizer/albums.db`

**Permissions:**
- User-specific read/write access only
- OS-managed file permissions (0600 on Unix systems)

## Data Integrity Rules

### Referential Integrity
- `photos.album_id` → `albums.id`: CASCADE on delete (deleting album removes all photo references)
- No orphaned photos allowed; if album doesn't exist, photo insert fails

### Consistency Rules
1. **Album date ordering**: When `display_order` is 0 (default), albums sort by `date DESC`
2. **Custom ordering**: Non-zero `display_order` values override date-based sorting
3. **File path uniqueness**: A photo file can only be referenced once across all albums

### Validation Rules (Application Layer)
These are enforced by the application before database writes:

1. **File existence**: Verify file exists at `file_path` before inserting photo record
2. **File type**: Validate image format (JPEG, PNG, GIF, WebP) via magic bytes
3. **File size**: Check file size ≤ 25MB before accepting
4. **Path accessibility**: Ensure application has read permissions for the file

## Query Patterns

### Common Queries

**1. Get all albums sorted chronologically**
```sql
SELECT * FROM albums
ORDER BY date DESC, created_at DESC;
```

**2. Get all albums with custom ordering**
```sql
SELECT * FROM albums
ORDER BY display_order ASC, date DESC;
```

**3. Get all photos in an album**
```sql
SELECT * FROM photos
WHERE album_id = ?
ORDER BY display_order ASC, added_at ASC;
```

**4. Count photos per album**
```sql
SELECT a.id, a.name, a.date, COUNT(p.id) as photo_count
FROM albums a
LEFT JOIN photos p ON a.id = p.album_id
GROUP BY a.id
ORDER BY a.date DESC;
```

**5. Detect orphaned file references** (maintenance query)
```sql
SELECT id, file_path FROM photos
WHERE NOT EXISTS (
    SELECT 1 FROM albums WHERE id = photos.album_id
);
```

**6. Find duplicate file paths** (should return 0 rows due to UNIQUE constraint)
```sql
SELECT file_path, COUNT(*) as count
FROM photos
GROUP BY file_path
HAVING count > 1;
```

## Migration Strategy

### Initial Schema Creation
Run on first application launch if database doesn't exist:

```javascript
// Execute in order
await db.execute(createAlbumsTableSQL);
await db.execute(createAlbumsIndexesSQL);
await db.execute(createAlbumsTriggerSQL);
await db.execute(createPhotosTableSQL);
await db.execute(createPhotosIndexesSQL);
await db.execute(createPhotosTriggerSQL);
```

### Future Schema Versions
Use version table to track migrations:

```sql
CREATE TABLE schema_version (
    version INTEGER PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT INTO schema_version (version) VALUES (1);
```

Future migrations will increment version and apply differential changes.

## Performance Considerations

### Indexing Strategy
- **albums.date**: Supports chronological sorting (default view)
- **albums.display_order**: Supports custom ordering (drag-and-drop)
- **photos.album_id**: Critical for album → photos lookups
- **photos.file_path**: Uniqueness constraint creates implicit index

### Expected Performance
- Album list query: <10ms for 100 albums
- Photos in album: <20ms for 100 photos
- Photo count aggregation: <50ms for 1,000 photos across 100 albums

### Optimization Notes
- INTEGER PRIMARY KEY is alias for SQLite's ROWID (fastest lookup)
- Foreign key indexes created automatically on album_id
- TEXT fields use COLLATE NOCASE for case-insensitive searches
- Timestamps stored as ISO 8601 TEXT for portability and readability

## Data Lifecycle

### Album Lifecycle
1. **Create**: User creates album with name and date → INSERT INTO albums
2. **Update**: User renames or changes date → UPDATE albums SET ...
3. **Reorder**: User drags album → UPDATE albums SET display_order = ?
4. **Delete**: User confirms deletion → DELETE FROM albums WHERE id = ? (cascades to photos)

### Photo Lifecycle
1. **Add**: User selects files via picker → validate → INSERT INTO photos
2. **Remove**: User removes photo from album → DELETE FROM photos WHERE id = ?
3. **Orphan Check**: Periodic background check for file_path references where file no longer exists

## Security & Privacy

- No sensitive user data stored (only file paths and metadata)
- Database file protected by OS-level user permissions
- No encryption required (per clarification session)
- Application never writes to photo files, only reads
- File paths validated to prevent path traversal attacks

## Testing Considerations

### Unit Tests
- CRUD operations for albums and photos
- Constraint validation (name length, file size, path format)
- Trigger behavior (timestamps, path validation)
- Index usage verification

### Integration Tests
- Cascade delete behavior
- Foreign key constraints
- Transaction rollback on errors
- Query performance benchmarks

### Data Fixtures
Create test data sets:
- 10 albums, 100 photos (typical user)
- 100 albums, 1,000 photos (maximum supported scale)
- Edge cases: empty albums, albums with 1 photo, albums with 100 photos
