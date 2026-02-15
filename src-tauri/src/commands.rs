use crate::models::{Album, Photo, AlbumWithCount};
use crate::validation;
use crate::photos;
use serde::{Deserialize, Serialize};
use tauri::State;
use tauri_plugin_sql::{Migration, MigrationKind};

#[derive(Debug, Serialize, Deserialize)]
pub struct InitializeResult {
    pub success: bool,
    pub version: i32,
    pub created: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DeleteResult {
    pub success: bool,
    pub deleted_photo_count: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateOrderResult {
    pub success: bool,
    pub updated_count: usize,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AlbumOrder {
    pub id: i64,
    pub display_order: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AddPhotosResult {
    pub success: bool,
    pub added: Vec<Photo>,
    pub failed: Vec<FailedPhoto>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FailedPhoto {
    pub path: String,
    pub reason: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ThumbnailResult {
    pub data_url: String,
    pub width: u32,
    pub height: u32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ValidationResult {
    pub valid: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub format: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub file_size: Option<i64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

/// Initialize database with schema
#[tauri::command]
pub async fn initialize_database(
    db: State<'_, tauri_plugin_sql::DbInstance>,
) -> Result<InitializeResult, String> {
    let database = db
        .get_connection()
        .map_err(|e| format!("Failed to get database connection: {}", e))?;

    // Check if tables already exist
    let check_result: Result<Vec<(i64,)>, _> = database
        .query(
            "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='albums'",
            vec![],
        )
        .await;

    let created = match check_result {
        Ok(rows) => rows.is_empty() || rows[0].0 == 0,
        Err(_) => true,
    };

    // Initialize schema
    crate::database::initialize_schema(&database).await?;

    Ok(InitializeResult {
        success: true,
        version: 1,
        created,
    })
}

/// Get all albums with optional sorting
#[tauri::command]
pub async fn get_albums(
    db: State<'_, tauri_plugin_sql::DbInstance>,
    sort_by: Option<String>,
) -> Result<Vec<AlbumWithCount>, String> {
    let database = db
        .get_connection()
        .map_err(|e| format!("Failed to get database connection: {}", e))?;

    let sort = sort_by.unwrap_or_else(|| "date".to_string());

    let order_clause = match sort.as_str() {
        "date" => "ORDER BY a.date DESC, a.created_at DESC",
        "custom" => "ORDER BY a.display_order ASC, a.date DESC",
        _ => return Err("InvalidSort: sortBy must be 'date' or 'custom'".to_string()),
    };

    let query = format!(
        "SELECT a.id, a.name, a.date, a.display_order, a.created_at, a.updated_at,
                COUNT(p.id) as photo_count
         FROM albums a
         LEFT JOIN photos p ON a.id = p.album_id
         GROUP BY a.id
         {}",
        order_clause
    );

    let albums: Vec<AlbumWithCount> = database
        .query(&query, vec![])
        .await
        .map_err(|e| format!("DatabaseError: Failed to query albums: {}", e))?;

    Ok(albums)
}

/// Get all photos in a specific album
#[tauri::command]
pub async fn get_photos(
    db: State<'_, tauri_plugin_sql::DbInstance>,
    album_id: i64,
) -> Result<Vec<Photo>, String> {
    let database = db
        .get_connection()
        .map_err(|e| format!("Failed to get database connection: {}", e))?;

    // Check if album exists
    let album_check: Result<Vec<(i64,)>, _> = database
        .query("SELECT COUNT(*) FROM albums WHERE id = ?", vec![album_id.into()])
        .await;

    match album_check {
        Ok(rows) if rows.is_empty() || rows[0].0 == 0 => {
            return Err("NotFound: Album does not exist".to_string());
        }
        Err(e) => return Err(format!("DatabaseError: {}", e)),
        _ => {}
    }

    let photos: Vec<Photo> = database
        .query(
            "SELECT id, album_id, file_path, filename, file_size, added_at, display_order
             FROM photos
             WHERE album_id = ?
             ORDER BY display_order ASC, added_at ASC",
            vec![album_id.into()],
        )
        .await
        .map_err(|e| format!("DatabaseError: Failed to query photos: {}", e))?;

    Ok(photos)
}

/// Create a new album
#[tauri::command]
pub async fn create_album(
    db: State<'_, tauri_plugin_sql::DbInstance>,
    name: String,
    date: String,
) -> Result<Album, String> {
    // Validation
    if name.is_empty() || name.len() > 255 {
        return Err("ValidationError: Album name must be 1-255 characters".to_string());
    }

    // Validate date format (basic ISO 8601 YYYY-MM-DD check)
    if !date.chars().all(|c| c.is_ascii_digit() || c == '-') || date.len() != 10 {
        return Err("ValidationError: Date must be in ISO 8601 format (YYYY-MM-DD)".to_string());
    }

    let database = db
        .get_connection()
        .map_err(|e| format!("Failed to get database connection: {}", e))?;

    let result = database
        .execute(
            "INSERT INTO albums (name, date, display_order) VALUES (?, ?, 0)",
            vec![name.clone().into(), date.clone().into()],
        )
        .await
        .map_err(|e| format!("DatabaseError: Failed to create album: {}", e))?;

    let album_id = result.last_insert_id;

    // Retrieve the created album
    let albums: Vec<Album> = database
        .query(
            "SELECT id, name, date, display_order, created_at, updated_at
             FROM albums WHERE id = ?",
            vec![album_id.into()],
        )
        .await
        .map_err(|e| format!("DatabaseError: Failed to retrieve album: {}", e))?;

    albums
        .into_iter()
        .next()
        .ok_or_else(|| "DatabaseError: Album created but not found".to_string())
}

/// Open native file picker dialog
#[tauri::command]
pub async fn open_file_picker(
    multiple: Option<bool>,
    title: Option<String>,
) -> Result<Option<Vec<String>>, String> {
    use tauri::api::dialog::FileDialogBuilder;

    let multi = multiple.unwrap_or(true);
    let dialog_title = title.unwrap_or_else(|| "Select Photos".to_string());

    let mut builder = FileDialogBuilder::new().set_title(&dialog_title).add_filter(
        "Images",
        &["jpg", "jpeg", "png", "gif", "webp"],
    );

    let (tx, rx) = std::sync::mpsc::channel();

    if multi {
        builder.pick_files(move |files| {
            let _ = tx.send(files);
        });
    } else {
        builder.pick_file(move |file| {
            let _ = tx.send(file.map(|f| vec![f]));
        });
    }

    let selected = rx
        .recv()
        .map_err(|_| "SystemError: File picker failed".to_string())?;

    Ok(selected.map(|paths| {
        paths
            .into_iter()
            .map(|p| p.to_string_lossy().to_string())
            .collect()
    }))
}

/// Validate image file
#[tauri::command]
pub async fn validate_image_file(file_path: String) -> Result<ValidationResult, String> {
    validation::validate_image(&file_path).await
}

/// Generate thumbnail for image
#[tauri::command]
pub async fn generate_thumbnail(
    file_path: String,
    max_width: Option<u32>,
    max_height: Option<u32>,
) -> Result<ThumbnailResult, String> {
    photos::generate_thumbnail(&file_path, max_width, max_height).await
}

/// Add photos to an album
#[tauri::command]
pub async fn add_photos(
    db: State<'_, tauri_plugin_sql::DbInstance>,
    album_id: i64,
    file_paths: Vec<String>,
) -> Result<AddPhotosResult, String> {
    let database = db
        .get_connection()
        .map_err(|e| format!("Failed to get database connection: {}", e))?;

    // Check if album exists
    let album_check: Result<Vec<(i64,)>, _> = database
        .query("SELECT COUNT(*) FROM albums WHERE id = ?", vec![album_id.into()])
        .await;

    match album_check {
        Ok(rows) if rows.is_empty() || rows[0].0 == 0 => {
            return Err("NotFound: Album does not exist".to_string());
        }
        Err(e) => return Err(format!("DatabaseError: {}", e)),
        _ => {}
    }

    let mut added = Vec::new();
    let mut failed = Vec::new();

    for path in file_paths {
        // Validate the image
        match validation::validate_image(&path).await {
            Ok(validation_result) => {
                if !validation_result.valid {
                    failed.push(FailedPhoto {
                        path: path.clone(),
                        reason: validation_result
                            .error
                            .unwrap_or_else(|| "Invalid image".to_string()),
                    });
                    continue;
                }

                let filename = std::path::Path::new(&path)
                    .file_name()
                    .and_then(|n| n.to_str())
                    .unwrap_or("unknown")
                    .to_string();

                let file_size = validation_result.file_size.unwrap_or(0);

                // Insert into database
                match database
                    .execute(
                        "INSERT INTO photos (album_id, file_path, filename, file_size)
                         VALUES (?, ?, ?, ?)",
                        vec![
                            album_id.into(),
                            path.clone().into(),
                            filename.clone().into(),
                            file_size.into(),
                        ],
                    )
                    .await
                {
                    Ok(result) => {
                        let photo_id = result.last_insert_id;
                        let photos: Vec<Photo> = database
                            .query(
                                "SELECT id, album_id, file_path, filename, file_size, added_at, display_order
                                 FROM photos WHERE id = ?",
                                vec![photo_id.into()],
                            )
                            .await
                            .unwrap_or_default();

                        if let Some(photo) = photos.into_iter().next() {
                            added.push(photo);
                        }
                    }
                    Err(e) => {
                        failed.push(FailedPhoto {
                            path,
                            reason: format!("Database error: {}", e),
                        });
                    }
                }
            }
            Err(e) => {
                failed.push(FailedPhoto {
                    path,
                    reason: e,
                });
            }
        }
    }

    Ok(AddPhotosResult {
        success: true,
        added,
        failed,
    })
}

/// Update album order for drag-and-drop
#[tauri::command]
pub async fn update_album_order(
    db: State<'_, tauri_plugin_sql::DbInstance>,
    album_orders: Vec<AlbumOrder>,
) -> Result<UpdateOrderResult, String> {
    // Validation
    for order in &album_orders {
        if order.display_order < 0 {
            return Err("ValidationError: displayOrder cannot be negative".to_string());
        }
    }

    let database = db
        .get_connection()
        .map_err(|e| format!("Failed to get database connection: {}", e))?;

    let mut updated_count = 0;

    for order in album_orders {
        let result = database
            .execute(
                "UPDATE albums SET display_order = ? WHERE id = ?",
                vec![order.display_order.into(), order.id.into()],
            )
            .await
            .map_err(|e| format!("DatabaseError: Failed to update order: {}", e))?;

        updated_count += result.rows_affected as usize;
    }

    Ok(UpdateOrderResult {
        success: true,
        updated_count,
    })
}

/// Update album details
#[tauri::command]
pub async fn update_album(
    db: State<'_, tauri_plugin_sql::DbInstance>,
    id: i64,
    name: Option<String>,
    date: Option<String>,
) -> Result<Album, String> {
    if let Some(ref n) = name {
        if n.is_empty() || n.len() > 255 {
            return Err("ValidationError: Album name must be 1-255 characters".to_string());
        }
    }

    if let Some(ref d) = date {
        if !d.chars().all(|c| c.is_ascii_digit() || c == '-') || d.len() != 10 {
            return Err("ValidationError: Date must be in ISO 8601 format (YYYY-MM-DD)".to_string());
        }
    }

    let database = db
        .get_connection()
        .map_err(|e| format!("Failed to get database connection: {}", e))?;

    // Check album exists
    let exists: Vec<(i64,)> = database
        .query("SELECT COUNT(*) FROM albums WHERE id = ?", vec![id.into()])
        .await
        .map_err(|e| format!("DatabaseError: {}", e))?;

    if exists.is_empty() || exists[0].0 == 0 {
        return Err("NotFound: Album does not exist".to_string());
    }

    // Build UPDATE query dynamically
    let mut updates = Vec::new();
    let mut params: Vec<tauri_plugin_sql::Value> = Vec::new();

    if let Some(n) = name {
        updates.push("name = ?");
        params.push(n.into());
    }

    if let Some(d) = date {
        updates.push("date = ?");
        params.push(d.into());
    }

    if updates.is_empty() {
        return Err("ValidationError: No updates provided".to_string());
    }

    params.push(id.into());
    let query = format!("UPDATE albums SET {} WHERE id = ?", updates.join(", "));

    database
        .execute(&query, params)
        .await
        .map_err(|e| format!("DatabaseError: Failed to update album: {}", e))?;

    // Retrieve updated album
    let albums: Vec<Album> = database
        .query(
            "SELECT id, name, date, display_order, created_at, updated_at FROM albums WHERE id = ?",
            vec![id.into()],
        )
        .await
        .map_err(|e| format!("DatabaseError: {}", e))?;

    albums
        .into_iter()
        .next()
        .ok_or_else(|| "DatabaseError: Album not found after update".to_string())
}

/// Delete an album
#[tauri::command]
pub async fn delete_album(
    db: State<'_, tauri_plugin_sql::DbInstance>,
    id: i64,
) -> Result<DeleteResult, String> {
    let database = db
        .get_connection()
        .map_err(|e| format!("Failed to get database connection: {}", e))?;

    // Check album exists
    let exists: Vec<(i64,)> = database
        .query("SELECT COUNT(*) FROM albums WHERE id = ?", vec![id.into()])
        .await
        .map_err(|e| format!("DatabaseError: {}", e))?;

    if exists.is_empty() || exists[0].0 == 0 {
        return Err("NotFound: Album does not exist".to_string());
    }

    // Count photos before deletion
    let photo_count: Vec<(i64,)> = database
        .query(
            "SELECT COUNT(*) FROM photos WHERE album_id = ?",
            vec![id.into()],
        )
        .await
        .map_err(|e| format!("DatabaseError: {}", e))?;

    let deleted_photo_count = photo_count.first().map(|r| r.0).unwrap_or(0);

    // Delete album (cascade deletes photos)
    database
        .execute("DELETE FROM albums WHERE id = ?", vec![id.into()])
        .await
        .map_err(|e| format!("DatabaseError: Failed to delete album: {}", e))?;

    Ok(DeleteResult {
        success: true,
        deleted_photo_count,
    })
}

/// Remove a photo from an album
#[tauri::command]
pub async fn remove_photo(
    db: State<'_, tauri_plugin_sql::DbInstance>,
    id: i64,
) -> Result<serde_json::Value, String> {
    let database = db
        .get_connection()
        .map_err(|e| format!("Failed to get database connection: {}", e))?;

    // Check photo exists
    let exists: Vec<(i64,)> = database
        .query("SELECT COUNT(*) FROM photos WHERE id = ?", vec![id.into()])
        .await
        .map_err(|e| format!("DatabaseError: {}", e))?;

    if exists.is_empty() || exists[0].0 == 0 {
        return Err("NotFound: Photo does not exist".to_string());
    }

    database
        .execute("DELETE FROM photos WHERE id = ?", vec![id.into()])
        .await
        .map_err(|e| format!("DatabaseError: Failed to remove photo: {}", e))?;

    Ok(serde_json::json!({ "success": true }))
}
