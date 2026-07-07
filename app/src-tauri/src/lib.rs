pub mod tools;

use tools::certdecoder::decode_certificate;
use tools::json::{json_format, json_get_subtree, json_parse_flatten, json_query, json_validate};
use tools::yaml::{json_to_yaml, yaml_to_json};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      json_parse_flatten,
      json_format,
      json_validate,
      json_get_subtree,
      json_query,
      yaml_to_json,
      json_to_yaml,
      decode_certificate
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
