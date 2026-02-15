# Tauri Commands Contract

**Feature**: Photo Album Organizer
**Date**: 2026-02-14
**Interface**: Frontend (JavaScript) ↔ Backend (Rust)

## Overview

This document defines the Tauri command interface between the JavaScript frontend and Rust backend. All commands are asynchronous and invoked via `window.__TAURI__.tauri.invoke(commandName, args)`.

## Command Categories

- **Album Operations**: Create, read, update, delete albums
- **Photo Operations**: Add, remove, list photos
- **File System Operations**: Open file picker, validate images
- **Database Operations**: Initialize, query metadata

---

## Album Operations

### get_albums

Retrieve all albums sorted by date or custom order.

**Input:**
```typescript
{
  sortBy?: 'date' | 'custom' // default: 'date'
}
```

**Output:**
```typescript
Album[] // Array of album objects

interface Album {
  id: number;
  name: string;
  date: string; // ISO 8601: YYYY-MM-DD
  displayOrder: number;
  photoCount: number;
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}
```

**Errors:**
- `DatabaseError`: Failed to query albums
- `InvalidSort`: Invalid sortBy parameter

**Example:**
```javascript
const albums = await window.__TAURI__.tauri.invoke('get_albums', {
  sortBy: 'date'
});
// Returns: [{ id: 1, name: "Summer 2024", date: "2024-07-15", ... }, ...]
```

---

### create_album

Create a new album with specified name and date.

**Input:**
```typescript
{
  name: string; // 1-255 characters
  date: string; // ISO 8601: YYYY-MM-DD
}
```

**Output:**
```typescript
Album // Newly created album object
```

**Errors:**
- `ValidationError`: Name empty, too long, or date invalid format
- `DatabaseError`: Failed to insert album

**Example:**
```javascript
const newAlbum = await window.__TAURI__.tauri.invoke('create_album', {
  name: "Vacation Photos",
  date: "2024-08-01"
});
// Returns: { id: 5, name: "Vacation Photos", date: "2024-08-01", ... }
```

---

### update_album

Update an existing album's name or date.

**Input:**
```typescript
{
  id: number;
  name?: string; // 1-255 characters
  date?: string; // ISO 8601: YYYY-MM-DD
}
```

**Output:**
```typescript
Album // Updated album object
```

**Errors:**
- `NotFound`: Album with given id doesn't exist
- `ValidationError`: Name/date validation failed
- `DatabaseError`: Failed to update album

**Example:**
```javascript
const updated = await window.__TAURI__.tauri.invoke('update_album', {
  id: 5,
  name: "Summer Vacation 2024"
});
```

---

### update_album_order

Update display order for albums after drag-and-drop reordering.

**Input:**
```typescript
{
  albumOrders: Array<{ id: number; displayOrder: number }>
}
```

**Output:**
```typescript
{ success: boolean; updatedCount: number }
```

**Errors:**
- `ValidationError`: Invalid album ids or negative displayOrder
- `DatabaseError`: Failed to update orders

**Example:**
```javascript
const result = await window.__TAURI__.tauri.invoke('update_album_order', {
  albumOrders: [
    { id: 3, displayOrder: 0 },
    { id: 1, displayOrder: 1 },
    { id: 2, displayOrder: 2 }
  ]
});
// Returns: { success: true, updatedCount: 3 }
```

---

### delete_album

Delete an album and all associated photo references (not the actual files).

**Input:**
```typescript
{
  id: number
}
```

**Output:**
```typescript
{
  success: boolean;
  deletedPhotoCount: number
}
```

**Errors:**
- `NotFound`: Album with given id doesn't exist
- `DatabaseError`: Failed to delete album

**Example:**
```javascript
const result = await window.__TAURI__.tauri.invoke('delete_album', { id: 5 });
// Returns: { success: true, deletedPhotoCount: 23 }
```

---

## Photo Operations

### get_photos

Retrieve all photos in a specific album.

**Input:**
```typescript
{
  albumId: number
}
```

**Output:**
```typescript
Photo[] // Array of photo objects

interface Photo {
  id: number;
  albumId: number;
  filePath: string; // Absolute path
  filename: string;
  fileSize: number; // Bytes
  addedAt: string; // ISO 8601 timestamp
  displayOrder: number;
}
```

**Errors:**
- `NotFound`: Album with given id doesn't exist
- `DatabaseError`: Failed to query photos

**Example:**
```javascript
const photos = await window.__TAURI__.tauri.invoke('get_photos', {
  albumId: 1
});
// Returns: [{ id: 1, filePath: "/Users/me/photos/img001.jpg", ... }, ...]
```

---

### add_photos

Add photos to an album by file paths (obtained from file picker).

**Input:**
```typescript
{
  albumId: number;
  filePaths: string[]; // Absolute paths to photo files
}
```

**Output:**
```typescript
{
  success: boolean;
  added: Photo[]; // Successfully added photos
  failed: Array<{ path: string; reason: string }>; // Failed validations
}
```

**Errors:**
- `NotFound`: Album with given id doesn't exist
- `ValidationError`: File paths invalid or file size exceeds 25MB
- `UnsupportedFormat`: File is not a valid JPEG, PNG, GIF, or WebP
- `DatabaseError`: Failed to insert photos

**Example:**
```javascript
const result = await window.__TAURI__.tauri.invoke('add_photos', {
  albumId: 1,
  filePaths: [
    "/Users/me/photos/photo1.jpg",
    "/Users/me/photos/photo2.png"
  ]
});
// Returns: {
//   success: true,
//   added: [{ id: 10, filePath: "/Users/me/photos/photo1.jpg", ... }],
//   failed: []
// }
```

---

### remove_photo

Remove a photo reference from an album (does not delete the actual file).

**Input:**
```typescript
{
  id: number // Photo id
}
```

**Output:**
```typescript
{ success: boolean }
```

**Errors:**
- `NotFound`: Photo with given id doesn't exist
- `DatabaseError`: Failed to delete photo

**Example:**
```javascript
const result = await window.__TAURI__.tauri.invoke('remove_photo', { id: 10 });
// Returns: { success: true }
```

---

## File System Operations

### open_file_picker

Open native file picker dialog for selecting image files.

**Input:**
```typescript
{
  multiple?: boolean; // default: true
  title?: string; // default: "Select Photos"
}
```

**Output:**
```typescript
string[] | null // Array of selected file paths, or null if cancelled
```

**Errors:**
- `PermissionDenied`: User denied file system access
- `SystemError`: File picker failed to open

**Example:**
```javascript
const files = await window.__TAURI__.tauri.invoke('open_file_picker', {
  multiple: true,
  title: "Add Photos to Album"
});
// Returns: ["/Users/me/photos/img1.jpg", "/Users/me/photos/img2.png"] or null
```

---

### validate_image_file

Validate that a file is a supported image format (checks magic bytes).

**Input:**
```typescript
{
  filePath: string
}
```

**Output:**
```typescript
{
  valid: boolean;
  format?: 'jpeg' | 'png' | 'gif' | 'webp';
  fileSize?: number; // Bytes
  error?: string; // If invalid
}
```

**Errors:**
- `FileNotFound`: File doesn't exist at path
- `PermissionDenied`: No read access to file

**Example:**
```javascript
const validation = await window.__TAURI__.tauri.invoke('validate_image_file', {
  filePath: "/Users/me/photos/image.jpg"
});
// Returns: { valid: true, format: "jpeg", fileSize: 2048576 }
```

---

### generate_thumbnail

Generate thumbnail data URL for display in tile view.

**Input:**
```typescript
{
  filePath: string;
  maxWidth?: number; // default: 256
  maxHeight?: number; // default: 256
}
```

**Output:**
```typescript
{
  dataUrl: string; // Base64 data URL for <img src>
  width: number;
  height: number;
}
```

**Errors:**
- `FileNotFound`: File doesn't exist
- `InvalidImage`: File is corrupted or not a valid image
- `ThumbnailError`: Failed to generate thumbnail

**Example:**
```javascript
const thumb = await window.__TAURI__.tauri.invoke('generate_thumbnail', {
  filePath: "/Users/me/photos/image.jpg",
  maxWidth: 256,
  maxHeight: 256
});
// Returns: {
//   dataUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
//   width: 256,
//   height: 192
// }
```

---

## Database Operations

### initialize_database

Initialize database schema on first launch. Idempotent (safe to call multiple times).

**Input:**
```typescript
{} // No parameters
```

**Output:**
```typescript
{
  success: boolean;
  version: number; // Schema version
  created: boolean; // true if newly created, false if already existed
}
```

**Errors:**
- `DatabaseError`: Failed to create tables or indexes

**Example:**
```javascript
const result = await window.__TAURI__.tauri.invoke('initialize_database', {});
// Returns: { success: true, version: 1, created: true }
```

---

### check_orphaned_photos

Find photo references where the file no longer exists at the stored path.

**Input:**
```typescript
{} // No parameters
```

**Output:**
```typescript
{
  orphanedPhotos: Array<{ id: number; filePath: string; albumId: number }>
}
```

**Errors:**
- `DatabaseError`: Failed to query photos

**Example:**
```javascript
const orphans = await window.__TAURI__.tauri.invoke('check_orphaned_photos', {});
// Returns: {
//   orphanedPhotos: [
//     { id: 5, filePath: "/Users/me/old/photo.jpg", albumId: 2 }
//   ]
// }
```

---

## Error Handling

All commands return errors in a consistent format:

```typescript
interface TauriError {
  type: string; // Error type (e.g., "ValidationError")
  message: string; // Human-readable message
  details?: any; // Additional context
}
```

**Frontend Error Handling:**
```javascript
try {
  const album = await window.__TAURI__.tauri.invoke('create_album', {
    name: "",
    date: "2024-08-01"
  });
} catch (error) {
  if (error.type === 'ValidationError') {
    showErrorToast(error.message);
  } else {
    showErrorToast('An unexpected error occurred');
  }
}
```

## Security Considerations

1. **Path Validation**: All file paths validated to be absolute and within permitted scope
2. **SQL Injection Prevention**: All queries use parameterized statements
3. **File Size Limits**: 25MB maximum enforced in backend
4. **Format Validation**: Magic byte checking prevents spoofed extensions
5. **Permission Model**: Tauri scoped file system access only for user-selected files

## Performance Requirements

- All commands must complete within 1 second for normal operations
- Thumbnail generation may take up to 2 seconds for 100 photos
- Database operations must complete within 50ms for 1,000 records

## Testing

### Contract Tests
Each command must have contract tests validating:
- Input parameter validation
- Output structure matches interface
- Error cases return expected error types
- Performance meets requirements

### Example Test:
```javascript
describe('create_album command', () => {
  it('creates album with valid input', async () => {
    const album = await invoke('create_album', {
      name: "Test Album",
      date: "2024-08-01"
    });

    expect(album).toHaveProperty('id');
    expect(album.name).toBe("Test Album");
    expect(album.date).toBe("2024-08-01");
  });

  it('rejects empty name', async () => {
    await expect(
      invoke('create_album', { name: "", date: "2024-08-01" })
    ).rejects.toMatchObject({ type: 'ValidationError' });
  });
});
```
