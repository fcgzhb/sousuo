const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'seo.db');

function initDatabase() {
  const db = new Database(DB_PATH);

  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS keywords (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      keyword TEXT NOT NULL,
      search_volume INTEGER DEFAULT 0,
      competition_level TEXT DEFAULT '',
      status TEXT DEFAULT 'active',
      tags TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS suggestions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      keyword_id INTEGER,
      keyword TEXT DEFAULT '',
      priority_level TEXT DEFAULT '中',
      suggestion TEXT DEFAULT '',
      performance_metrics TEXT DEFAULT '',
      status TEXT DEFAULT 'pending',
      notes TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (keyword_id) REFERENCES keywords(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      avatar TEXT DEFAULT '',
      role TEXT DEFAULT 'user',
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS competitors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      website_url TEXT DEFAULT '',
      industry TEXT DEFAULT '',
      location TEXT DEFAULT '',
      is_active INTEGER DEFAULT 1,
      keywords TEXT DEFAULT '',
      analysis_notes TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS search_trends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      keyword TEXT NOT NULL,
      region TEXT DEFAULT '',
      trend_date DATE DEFAULT '',
      search_volume INTEGER DEFAULT 0,
      related_keywords TEXT DEFAULT '',
      trend_type TEXT DEFAULT '稳定',
      hot_score REAL DEFAULT 0,
      analysis_notes TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS traffic_sources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_type TEXT NOT NULL,
      source_name TEXT DEFAULT '',
      is_active INTEGER DEFAULT 1,
      start_date DATE DEFAULT '',
      channels TEXT DEFAULT '',
      description TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS content_strategies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content_title TEXT NOT NULL,
      content_description TEXT DEFAULT '',
      target_audience TEXT DEFAULT '',
      content_type TEXT DEFAULT '',
      content_formats TEXT DEFAULT '',
      publish_date DATE DEFAULT '',
      performance_metrics TEXT DEFAULT '',
      strategy_score REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS data_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      keyword TEXT NOT NULL,
      search_volume INTEGER DEFAULT 0,
      click_through_rate REAL DEFAULT 0,
      ranking INTEGER DEFAULT 0,
      performance_trend TEXT DEFAULT '稳定',
      date_range TEXT DEFAULT '',
      analysis_metrics TEXT DEFAULT '',
      keyword_impact_score REAL DEFAULT 0,
      notes TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role_name TEXT NOT NULL,
      role_description TEXT DEFAULT '',
      user_list TEXT DEFAULT '',
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('Database initialized successfully at', DB_PATH);
  return db;
}

module.exports = { initDatabase, DB_PATH };
