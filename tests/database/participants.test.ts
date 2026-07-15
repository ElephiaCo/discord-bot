import { describe, expect } from "vitest";
import {
	addParticipant,
	getParticipants,
	isParticipant,
	removeParticipant,
} from "../../src/database/participants";
import { test } from "../fixtures/database";

describe("participant storage", () => {
	test("adds a participant", ({ database }) => {
		const added = addParticipant(database, "guild-1", "user-1");

		expect(added).toBe(true);
		expect(isParticipant(database, "guild-1", "user-1")).toBe(true);
	});

	test("does not add the same participant twice", ({ database }) => {
		const firstResult = addParticipant(database, "guild-1", "user-1");
		const secondResult = addParticipant(database, "guild-1", "user-1");

		expect(firstResult).toBe(true);
		expect(secondResult).toBe(false);
		expect(getParticipants(database, "guild-1")).toHaveLength(1);
	});

	test("removes a participant", ({ database }) => {
		addParticipant(database, "guild-1", "user-1");

		const removed = removeParticipant(database, "guild-1", "user-1");

		expect(removed).toBe(true);
		expect(isParticipant(database, "guild-1", "user-1")).toBe(false);
	});

	test("returns participants from only the requested guild", ({ database }) => {
		addParticipant(database, "guild-1", "user-1");
		addParticipant(database, "guild-2", "user-2");

		const participants = getParticipants(database, "guild-1");

		expect(participants).toHaveLength(1);
		expect(participants[0]?.userId).toBe("user-1");
	});
});
