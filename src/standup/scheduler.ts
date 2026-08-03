import type { Client } from "discord.js";
import cron, { type ScheduledTask } from "node-cron";
import type { StandupDatabase } from "../database/connection";
import { getParticipants } from "../database/participants";
import { getConfiguredGuilds } from "../database/settings";

const FIRST_QUESTION = "What did you do yesterday?";

export type StartSession = (guildId: string, userId: string) => void;

interface SchedulerDependencies {
	client: Client;
	database: StandupDatabase;
	startSession: StartSession;
	timezone: string;
}

export function startStandupScheduler({
	client,
	database,
	startSession,
	timezone,
}: SchedulerDependencies): ScheduledTask {
	const lastRunByGuild = new Map<string, string>();

	const timeFormatter = new Intl.DateTimeFormat("en-GB", {
		timeZone: timezone,
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});

	const dateFormatter = new Intl.DateTimeFormat("en-CA", {
		timeZone: timezone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

	return cron.schedule(
		"* * * * 1-5",
		async () => {
			const now = new Date();

			const currentTime = timeFormatter.format(now);
			const currentDate = dateFormatter.format(now);

			for (const settings of getConfiguredGuilds(database)) {
				if (settings.standupTime !== currentTime) {
					continue;
				}

				if (lastRunByGuild.get(settings.guildId) === currentDate) {
					continue;
				}

				lastRunByGuild.set(settings.guildId, currentDate);

				const participants = getParticipants(database, settings.guildId);

				for (const participant of participants) {
					try {
						const user = await client.users.fetch(participant.userId);

						await user.send(FIRST_QUESTION);

						startSession(settings.guildId, participant.userId);
					} catch (error: unknown) {
						console.error(
							`Failed to start standup for user ${participant.userId}:`,
							error,
						);
					}
				}
			}
		},
		{
			timezone,
		},
	);
}
