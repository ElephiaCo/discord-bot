import type { StandupDatabase } from "./connection";
import { initialSchemaMigration } from "./migrations/001-initial-shcema";

interface Migration {
	version: number;
	name: string;
	up(database: StandupDatabase): void;
}

const migrations: Migration[] = [initialSchemaMigration];

export function runMigrations(database: StandupDatabase): void {
	database.exec(`
        CREATE TABLE IF NOT EXISTS migrations (
        version INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    `);

	const appliedRows = database
		.prepare("SELECT version FROM migrations")
		.all() as Array<{ version: number }>;

	const appliedVersions = new Set(appliedRows.map((row) => row.version));

	const applyMigration = database.transaction((migration: Migration) => {
		migration.up(database);

		database
			.prepare("INSERT INTO migrations (version, name) VALUES (?, ?)")
			.run(migration.version, migration.name);
	});

	for (const migration of migrations) {
		if (!appliedVersions.has(migration.version)) {
			applyMigration(migration);
		}
	}
}
