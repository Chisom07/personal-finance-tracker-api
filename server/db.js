import Database from "better-sqlite3";

const db = new Database("finance.db");

// Create tables
db.prepare(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password TEXT
)
`).run();

db.prepare(`
CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  type TEXT,
  amount REAL,
  category TEXT,
  description TEXT,
  date TEXT
)
`).run();

export default db;