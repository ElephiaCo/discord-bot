import { describe, expect, it } from "vitest";
import { formatStandup } from "../../src/standup/formatter";

describe("formatStandup", () => {
	it("formats all answers into a readable message", () => {
		const message = formatStandup({
			guildId: "guild-1",
			userId: "user-1",
			yesterday: "implemented SQLite.",
			today: "Working on commands.",
			blockers: "None.",
		});

		expect(message).toContain("<@user-1");
		expect(message).toContain("implemented SQLite.");
		expect(message).toContain("Working on commands.");
		expect(message).toContain("None");
	});
});
