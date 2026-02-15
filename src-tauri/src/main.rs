// Prevents additional console window on Windows in release builds
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
mod database;
mod models;
mod photos;
mod validation;

use tauri_plugin_sql::TauriSql;

fn main() {
    tauri::Builder::default()
        .plugin(TauriSql::default())
        .invoke_handler(tauri::generate_handler![
            commands::initialize_database,
            commands::get_albums,
            commands::get_photos,
            commands::create_album,
            commands::update_album,
            commands::update_album_order,
            commands::delete_album,
            commands::add_photos,
            commands::remove_photo,
            commands::open_file_picker,
            commands::validate_image_file,
            commands::generate_thumbnail,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
