use crate::commands::ThumbnailResult;
use image::{imageops::FilterType, DynamicImage, ImageFormat};
use std::io::Cursor;

/// Generate thumbnail from image file
pub async fn generate_thumbnail(
    file_path: &str,
    max_width: Option<u32>,
    max_height: Option<u32>,
) -> Result<ThumbnailResult, String> {
    let width = max_width.unwrap_or(256);
    let height = max_height.unwrap_or(256);

    // Read image file
    let img = image::open(file_path)
        .map_err(|e| format!("InvalidImage: Failed to open image: {}", e))?;

    // Calculate thumbnail dimensions maintaining aspect ratio
    let (thumb_width, thumb_height) = calculate_thumbnail_size(img.width(), img.height(), width, height);

    // Resize image
    let thumbnail = img.resize(thumb_width, thumb_height, FilterType::Lanczos3);

    // Encode to JPEG for data URL
    let mut buffer = Cursor::new(Vec::new());
    thumbnail
        .write_to(&mut buffer, ImageFormat::Jpeg)
        .map_err(|e| format!("ThumbnailError: Failed to encode thumbnail: {}", e))?;

    // Convert to base64 data URL
    let base64_data = base64::encode(buffer.into_inner());
    let data_url = format!("data:image/jpeg;base64,{}", base64_data);

    Ok(ThumbnailResult {
        data_url,
        width: thumb_width,
        height: thumb_height,
    })
}

/// Calculate thumbnail dimensions maintaining aspect ratio
fn calculate_thumbnail_size(
    orig_width: u32,
    orig_height: u32,
    max_width: u32,
    max_height: u32,
) -> (u32, u32) {
    let width_ratio = max_width as f64 / orig_width as f64;
    let height_ratio = max_height as f64 / orig_height as f64;
    let ratio = width_ratio.min(height_ratio);

    let new_width = (orig_width as f64 * ratio) as u32;
    let new_height = (orig_height as f64 * ratio) as u32;

    (new_width.max(1), new_height.max(1))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_thumbnail_size_landscape() {
        let (w, h) = calculate_thumbnail_size(1920, 1080, 256, 256);
        assert_eq!(w, 256);
        assert_eq!(h, 144);
    }

    #[test]
    fn test_thumbnail_size_portrait() {
        let (w, h) = calculate_thumbnail_size(1080, 1920, 256, 256);
        assert_eq!(w, 144);
        assert_eq!(h, 256);
    }

    #[test]
    fn test_thumbnail_size_square() {
        let (w, h) = calculate_thumbnail_size(1000, 1000, 256, 256);
        assert_eq!(w, 256);
        assert_eq!(h, 256);
    }

    #[test]
    fn test_thumbnail_size_small_image() {
        let (w, h) = calculate_thumbnail_size(100, 100, 256, 256);
        assert_eq!(w, 100);
        assert_eq!(h, 100);
    }
}
