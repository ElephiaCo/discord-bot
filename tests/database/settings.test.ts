import { describe, expect } from "vitest";
import {
	getStandupChannel,
	getStandupTime,
	setStandupChannel,
	setStandupTime,
} from "../../src/database/settings";
import { test } from "../fixtures/database";

describe("guild settings storage", () => {
	test("stores and retrieves the standup channel", ({ database }) => {
		setStandupChannel(database, "guild-1", "channel-1");

		expect(getStandupChannel(database, "guild-1")).toBe("channel-1");
	});

	test("updates the standup channel", ({ database }) => {
		setStandupChannel(database, "guild-1", "channel-1");
		setStandupChannel(database, "guild-1", "channel-2");

		expect(getStandupChannel(database, "guild-1")).toBe("channel-2");
	});

	test("stores and retrieves the standup time", ({ database }) => {
		setStandupTime(database, "guild-1", "09:00");

		expect(getStandupTime(database, "guild-1")).toBe("09:00");
	});
});
