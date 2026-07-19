import {
	type ChatInputCommandInteraction,
	MessageFlags,
	SlashCommandBuilder,
} from "discord.js";
import { addParticipant } from "../database/participants";
import { getGuildId } from "./helpers";
import type { BotCommand, CommandContext } from "./types";

async function executeJoin(
	interaction: ChatInputCommandInteraction,
	context: CommandContext,
): Promise<void> {
	const guildId = await getGuildId(interaction);

	if (!guildId) {
		return;
	}

	const added = addParticipant(context.database, guildId, interaction.user.id);

	await interaction.reply({
		content: added
			? "You have joined the daily standup."
			: "You have already joined the daily standup",
		flags: MessageFlags.Ephemeral,
	});
}

export const joinCommand: BotCommand = {
	data: new SlashCommandBuilder()
		.setName("join")
		.setDescription("join the daily standup roster"),
	execute: executeJoin,
};
