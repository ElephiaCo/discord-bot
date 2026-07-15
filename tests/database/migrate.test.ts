import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { StandupDatabase } from "../../src/database/connection";
import { createDatabase } from "../../src/database/connection";
import { runMigrations } from "../../src/database/migrate";

describe("database migrations", () => {
	let database: StandupDatabase;

	beforeEach(() => {
		database = createDatabase(":memory:");
	});

	afterEach(() => {
		database.close();
	});

	it("creates the database tables", () => {
		runMigrations(database);

		const tables = database
			.prepare(`
            SELECT name
            FROM sqlite_master
            WHERE type = 'table'
        `)
			.all() as Array<{ name: string }>;

		const tableNames = tables.map((table) => table.name);

		expect(tableNames).toContain("participants");
		expect(tableNames).toContain("guild_settings");
		expect(tableNames).toContain("migrations");
	});

	it("does not apply the same migration twice", () => {
		runMigrations(database);
		runMigrations(database);

		const migrations = database.prepare("SELECT version FROM migrations").all();

		expect(migrations).toHaveLength(1);
	});
});
