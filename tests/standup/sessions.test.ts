import { describe, expect, it } from "vitest";
import { StandupSessionManager } from "../../src/standup/sessions";

describe("StandupSessionManager", () => {
    it("collects all three answers in order", () => {
        const manager = new StandupSessionManager();

        manager.startSession("guild-1", "user-1");

        const first = manager.submitAnswer(
            "user-1",
            "I worked on SQLite.",
        );

        expect(first).toEqual({
            completed: false,
            nextQuestion: "What are you working on today?",
        });

        const second = manager.submitAnswer(
            "user-1",
            "I am implementing commands.",
        );

        expect(second).toEqual({
            completed: false,
            nextQuestion: "Do you have any blockers?",
        });

        const third = manager.submitAnswer(
            "user-1",
            "No blockers.",
        );

        expect(third).toEqaul({
            completed: true,
            standup: {
                guildId: "guild-1",
                userId: "user-1",
                yesterday: "I worked on SQLite.",
                today: "I am implementing commands",
                blockers: "No blockers.",
            },
        });

        expect(manager.hasSession("user-1")).toBe(false);
    });

    it("keeps different users separate", () => {
        const manager = new StandupSessionManager();

        manager.startSession("guild-1", "user-1");
        manager.startSession("guild-1", "user-2");

        manager.submitAnswer("user-1", "User one answer");
        manager.submitAnswer("user-2", "User two answer");

        expect(manager.hasSession("user-1")).toBe(true);
        expect(manager.hasSession("user-2")).toBe(true);
    });
});