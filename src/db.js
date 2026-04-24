import path from "path";
import sqlite3 from "sqlite3"

const __dirname = import.meta.dirname;
let db;

// initialize db and create tables
export const db_initialize_create = async () => {
  let filename = path.join(__dirname, "db", "data.db");
  db = new sqlite3.Database(filename);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        owner_user_id INTEGER
    );
    `
  );

  return db;
}

export const get_db = () => {
  if (!db) throw new Error("DB not initialized. Call db_initialize_create() first.");
  return db;
}