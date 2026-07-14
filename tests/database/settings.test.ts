import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { StandupDatabase } from "../../src/database/connection";
import { createDatabase } from "../../src/database/connection";
import { getStandupChannel, getStandupTime, setStandupChannel, setStandupTime } from "../../src/database/settings";

describe("guild settings storage", () => {
    let database: StandupDatabase;

    beforeEach(() => {
        database = createDatabase(":memory:");
    });

    afterEach(() => {
        database.close();
    });

    it("stores and retrieves the standup channel", () => {
        setStandupChannel(database, "guild-1", "channel-1");

        expect(getStandupChannel(database, "guild-1")).toBe("channel-1");
    });

    it("updates the standup channel", () => {
        setStandupChannel(database, "guild-1", "channel-1");
        setStandupChannel(database, "guild-1", "channel-2");

        expect(getStandupChannel(database, "guild-1")).toBe("channel-2");
    });

    it("stores and retrieves the standup time", () => {
        setStandupTime(database, "guild-1", "09:00"),

        expect(getStandupTime(database, "guild-1")).toBe("09:00");
    });
});