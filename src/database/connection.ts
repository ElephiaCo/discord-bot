import Database from "better-sqlite3";

export type StandupDatabase = Database.Database;

export function createDatabase(
    filename = process.env.DATABASE_PATH ?? "data/standup.db",
): StandupDatabase {
    const  database = new Database(filename);

    
    database.pragma("journal_mode = WAL");
    database.pragma("foreign_keys = on");

    initializeDatabase(database);

    return database;
}

export function initializeDatabase(database: StandupDatabase): void {
    database.exec(`
        CREATE TABLE IF NOT EXIST participants (
        guild_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        joined_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY_KEY (guild_id user_id)
        );
        CREATE TABLE IF NOT EXIST guild_settings (
        guild_id TEXT PRIMARY_KEY,
        standup_channel_id,
        standup_time TEXT
        )`
    )
}