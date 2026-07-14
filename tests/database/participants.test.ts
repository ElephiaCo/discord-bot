import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { StandupDatabase } from "../../src/database/connection";
import { createDatabase } from "../../src/database/connection";
import {
	addParticipant,
	getParticipants,
	isParticipant,
	removeParticipant,
} from "../../src/database/participants";

describe("participant storage", () => {
	let database: StandupDatabase;

	beforeEach(() => {
		database = createDatabase(":memory:");
	});

	afterEach(() => {
		database.close();
	});

	it("adds a participant", () => {
		const added = addParticipant(database, "guild-1", "user-1");

		expect(added).toBe(true);
		expect(isParticipant(database, "guild-1", "user-1")).toBe(true);
	});

	it("does not add the same participant twice", () => {
		const firstResult = addParticipant(database, "guild-1", "user-1");
		const secondResult = addParticipant(database, "guild-1", "user-1");

		expect(firstResult).toBe(true);
		expect(secondResult).toBe(false);
		expect(getParticipants(database, "guild-1")).toHaveLength(1);
	});

	it("removes a participant", () => {
		addParticipant(database, "guild-1", "user-1");

		const removed = removeParticipant(database, "guild-1", "user-1");

		expect(removed).toBe(true);
		expect(isParticipant(database, "guild-1", "user-1")).toBe(false);
	});

	it("returns participants from only the requested guild", () => {
		addParticipant(database, "guild-1", "user-1");
		addParticipant(database, "guild-2", "user-2");

		const participants = getParticipants(database, "guild-1");

		expect(participants).toHaveLength(1);
		expect(participants[0]?.userId).toBe("user-1");
	});
});
