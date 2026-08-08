import type { CompletedStandup } from "./sessions";

export function formatStandup(standup: CompletedStandup): string {
	return [
		`**Standup - <@${standup.userId}>**`,
		"",
		"**Yesterday:**",
		standup.yesterday,
		"",
		"**Today:**",
		standup.today,
		"",
		"**Blockers:**",
		standup.blockers,
	].join("\n");
}
