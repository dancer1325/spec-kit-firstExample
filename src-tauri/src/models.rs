use serde::{Deserialize, Serialize};

/// Album model representing a photo album container
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Album {
    pub id: i64,
    pub name: String,
    pub date: String, // ISO 8601 format: YYYY-MM-DD
    pub display_order: i64,
    pub created_at: String,
    pub updated_at: String,
}

/// Photo model representing a photo file reference
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Photo {
    pub id: i64,
    pub album_id: i64,
    pub file_path: String,
    pub filename: String,
    pub file_size: i64, // Bytes, max 26214400 (25MB)
    pub added_at: String,
    pub display_order: i64,
}

/// Album with photo count for display
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AlbumWithCount {
    #[serde(flatten)]
    pub album: Album,
    pub photo_count: i64,
}

#[cfg(test)]
mod tests {
    use super::*;

    // Tests will be added in Phase 2 unit tests
}
