
const Database = require("better-sqlite3");
const path = require("node:path");

const db = new Database(path.join(__dirname, "database.sqlite"));

db.pragma("journal_mode = WAL");

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
`);

const columns = db.prepare("PRAGMA table_info(users)").all();
const columnNames = columns.map((column) => column.name);

if (!columnNames.includes("password_hash")) {
    db.exec("ALTER TABLE users ADD COLUMN password_hash TEXT");
}

if (columnNames.includes("pasword_hash")) {
    db.exec(`
        UPDATE users
        SET password_hash = pasword_hash
        WHERE password_hash IS NULL
    `);
}

module.exports = db;
