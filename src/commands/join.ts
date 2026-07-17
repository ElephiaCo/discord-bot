import {
	type ChatInputCommandInteraction,
	MessageFlags,
	SlashCommandBuilder,
} from "discord.js";
import { addParticipant } from "../database/participants";
import type { BotCommand, CommandContext } from "./types";

async function executeJoin(
	interaction: ChatInputCommandInteraction,
	context: CommandContext,
): Promise<void> {
	const guildId = interaction.guildId;

	if (!guildId) {
		await interaction.reply({
			content: "This command can only be used in a Discord server bro 🥀",
			flags: MessageFlags.Ephemeral,
		});

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
		.setDescription("join the daily standup roaster"),
	execute: executeJoin,
};
