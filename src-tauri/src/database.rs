use serde::{Deserialize, Serialize};

/// Initialize database schema with albums and photos tables
pub async fn initialize_schema(db: &tauri_plugin_sql::Database) -> Result<(), String> {
    // Create albums table
    db.execute(
        "CREATE TABLE IF NOT EXISTS albums (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL CHECK(length(name) > 0 AND length(name) <= 255),
            date TEXT NOT NULL,
            display_order INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        )",
        vec![],
    )
    .await
    .map_err(|e| format!("Failed to create albums table: {}", e))?;

    // Create indexes for albums
    db.execute(
        "CREATE INDEX IF NOT EXISTS idx_albums_date ON albums(date DESC)",
        vec![],
    )
    .await
    .map_err(|e| format!("Failed to create albums date index: {}", e))?;

    db.execute(
        "CREATE INDEX IF NOT EXISTS idx_albums_display_order ON albums(display_order ASC)",
        vec![],
    )
    .await
    .map_err(|e| format!("Failed to create albums display_order index: {}", e))?;

    db.execute(
        "CREATE INDEX IF NOT EXISTS idx_albums_name ON albums(name COLLATE NOCASE)",
        vec![],
    )
    .await
    .map_err(|e| format!("Failed to create albums name index: {}", e))?;

    // Create trigger for albums updated_at
    db.execute(
        "CREATE TRIGGER IF NOT EXISTS albums_updated_at
        AFTER UPDATE ON albums
        BEGIN
            UPDATE albums SET updated_at = datetime('now') WHERE id = NEW.id;
        END",
        vec![],
    )
    .await
    .map_err(|e| format!("Failed to create albums trigger: {}", e))?;

    // Create photos table
    db.execute(
        "CREATE TABLE IF NOT EXISTS photos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            album_id INTEGER NOT NULL,
            file_path TEXT NOT NULL UNIQUE,
            filename TEXT NOT NULL,
            file_size INTEGER NOT NULL CHECK(file_size > 0 AND file_size <= 26214400),
            added_at TEXT NOT NULL DEFAULT (datetime('now')),
            display_order INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
        )",
        vec![],
    )
    .await
    .map_err(|e| format!("Failed to create photos table: {}", e))?;

    // Create indexes for photos
    db.execute(
        "CREATE INDEX IF NOT EXISTS idx_photos_album_id ON photos(album_id)",
        vec![],
    )
    .await
    .map_err(|e| format!("Failed to create photos album_id index: {}", e))?;

    db.execute(
        "CREATE INDEX IF NOT EXISTS idx_photos_display_order ON photos(album_id, display_order ASC)",
        vec![],
    )
    .await
    .map_err(|e| format!("Failed to create photos display_order index: {}", e))?;

    db.execute(
        "CREATE INDEX IF NOT EXISTS idx_photos_file_path ON photos(file_path)",
        vec![],
    )
    .await
    .map_err(|e| format!("Failed to create photos file_path index: {}", e))?;

    // Enable foreign key constraints
    db.execute("PRAGMA foreign_keys = ON", vec![])
        .await
        .map_err(|e| format!("Failed to enable foreign keys: {}", e))?;

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    // Tests will be added in Phase 2 contract tests
}
