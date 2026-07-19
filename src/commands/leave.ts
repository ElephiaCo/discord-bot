import {
	type ChatInputCommandInteraction,
	MessageFlags,
	SlashCommandBuilder,
} from "discord.js";
import { removeParticipant } from "../database/participants";
import { getGuildId } from "./helpers";
import type { BotCommand, CommandContext } from "./types";

async function executeLeave(
	interaction: ChatInputCommandInteraction,
	context: CommandContext,
): Promise<void> {
	const guildId = await getGuildId(interaction);

	if (!guildId) {
		return;
	}

	const removed = removeParticipant(
		context.database,
		guildId,
		interaction.user.id,
	);

	await interaction.reply({
		content: removed
			? "You have left the daily standup."
			: "You are not currently registered for the daily standup.",
		flags: MessageFlags.Ephemeral,
	});
}

export const leaveCommand: BotCommand = {
	data: new SlashCommandBuilder()
		.setName("leave")
		.setDescription("leave the daily standup roster"),
	execute: executeLeave,
};
