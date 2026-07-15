import { test as baseTest } from "vitest";
import { createDatabase } from "../../src/database/connection";
import { runMigrations } from "../../src/database/migrate";

export const test = baseTest.extend(
	"database",
	({ task: _task }, { onCleanup }) => {
		const database = createDatabase(":memory:");

		runMigrations(database);

		onCleanup(() => {
			database.close();
		});

		return database;
	},
);
