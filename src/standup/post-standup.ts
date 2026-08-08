import { ChannelType, type Client, type TextChannel } from "discord.js";
import type { StandupDatabase } from "../database/connection";
import { getStandupChannel } from "../database/settings";
import { formatStandup } from "./formatter";
import type { CompletedStandup } from "./sessions";

interface PostStandupDependencies {
	client: Client;
	database: StandupDatabase;
}

export async function postCompletedStandup(
	standup: CompletedStandup,
	dependencies: PostStandupDependencies,
): Promise<void> {
	const channelId = getStandupChannel(dependencies.database, standup.guildId);

	if (!channelId) {
		throw new Error(
			`No standup channel configured for guild ${standup.guildId}`,
		);
	}

	const channel = await dependencies.client.channels.fetch(channelId);

	if (!channel || channel.type !== ChannelType.GuildText) {
		throw new Error(
			`Configured standup channel ${channelId} is not a text channel`,
		);
	}

	await (channel as TextChannel).send(formatStandup(standup));
}
