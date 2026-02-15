use crate::commands::ValidationResult;
use std::fs;
use std::path::Path;

/// Validate image file via extension and magic bytes
pub async fn validate_image(file_path: &str) -> Result<ValidationResult, String> {
    let path = Path::new(file_path);

    // Check file exists
    if !path.exists() {
        return Err("FileNotFound: File does not exist".to_string());
    }

    // Check file is readable
    let metadata = fs::metadata(path)
        .map_err(|_| "PermissionDenied: Cannot read file".to_string())?;

    let file_size = metadata.len() as i64;

    // Check file size limit (25MB)
    const MAX_FILE_SIZE: i64 = 26_214_400; // 25MB in bytes
    if file_size > MAX_FILE_SIZE {
        return Ok(ValidationResult {
            valid: false,
            format: None,
            file_size: Some(file_size),
            error: Some(format!(
                "File size ({} MB) exceeds maximum limit of 25 MB",
                file_size / 1_048_576
            )),
        });
    }

    // Read first bytes for magic byte detection
    let file_bytes = fs::read(path)
        .map_err(|_| "PermissionDenied: Cannot read file contents".to_string())?;

    if file_bytes.len() < 12 {
        return Ok(ValidationResult {
            valid: false,
            format: None,
            file_size: Some(file_size),
            error: Some("File too small to be a valid image".to_string()),
        });
    }

    // Magic byte detection
    let format = detect_image_format(&file_bytes);

    if let Some(fmt) = format {
        Ok(ValidationResult {
            valid: true,
            format: Some(fmt.to_string()),
            file_size: Some(file_size),
            error: None,
        })
    } else {
        Ok(ValidationResult {
            valid: false,
            format: None,
            file_size: Some(file_size),
            error: Some("Unsupported or invalid image format (JPEG, PNG, GIF, WebP only)".to_string()),
        })
    }
}

/// Detect image format from magic bytes
fn detect_image_format(bytes: &[u8]) -> Option<&'static str> {
    if bytes.len() < 12 {
        return None;
    }

    // JPEG magic bytes: FF D8 FF
    if bytes[0] == 0xFF && bytes[1] == 0xD8 && bytes[2] == 0xFF {
        return Some("jpeg");
    }

    // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
    if bytes[0..8] == [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] {
        return Some("png");
    }

    // GIF magic bytes: 47 49 46 38 (GIF8)
    if bytes[0..4] == [0x47, 0x49, 0x46, 0x38] {
        return Some("gif");
    }

    // WebP magic bytes: RIFF .... WEBP
    if bytes[0..4] == [0x52, 0x49, 0x46, 0x46] && bytes[8..12] == [0x57, 0x45, 0x42, 0x50] {
        return Some("webp");
    }

    None
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_detect_jpeg() {
        let jpeg_bytes = vec![0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01];
        assert_eq!(detect_image_format(&jpeg_bytes), Some("jpeg"));
    }

    #[test]
    fn test_detect_png() {
        let png_bytes = vec![0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D];
        assert_eq!(detect_image_format(&png_bytes), Some("png"));
    }

    #[test]
    fn test_detect_gif() {
        let gif_bytes = vec![0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
        assert_eq!(detect_image_format(&gif_bytes), Some("gif"));
    }

    #[test]
    fn test_detect_webp() {
        let webp_bytes = vec![0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50];
        assert_eq!(detect_image_format(&webp_bytes), Some("webp"));
    }

    #[test]
    fn test_detect_invalid() {
        let invalid_bytes = vec![0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00];
        assert_eq!(detect_image_format(&invalid_bytes), None);
    }
}
