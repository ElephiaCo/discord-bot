import type { StandupDatabase } from "../connection";

export const initialSchemaMigration = {
	version: 1,
	name: "initial schema",

	up(database: StandupDatabase): void {
		database.exec(`
            CREATE TABLE IF NOT EXISTS participants (
            guild_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            joined_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (guild_id, user_id)
            );
            
            CREATE TABLE IF NOT EXISTS guild_settings (
            guild_id TEXT PRIMARY KEY,
            standup_channel_id TEXT,
            standup_time TEXT
            );
        `);
	},
};
