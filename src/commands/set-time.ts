import {
	type ChatInputCommandInteraction,
	MessageFlags,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from "discord.js";
import { setStandupTime } from "../database/settings";
import { parseTime } from "../standup/time";
import { getGuildId } from "./helpers";
import type { BotCommand, CommandContext } from "./types";

async function executeSetTime(
	interaction: ChatInputCommandInteraction,
	context: CommandContext,
): Promise<void> {
	const guildId = await getGuildId(interaction);

	if (!guildId) {
		return;
	}

	const time = interaction.options.getString("time", true);
	const parsedTime = parseTime(time);

	if (!parsedTime) {
		await interaction.reply({
			content: "Please enter the time in 24-hour HH:mm format, such as 09:00.",
			flags: MessageFlags.Ephemeral,
		});

		return;
	}

	try {
		const saved = setStandupTime(context.database, guildId, time);

		if (!saved) {
			await interaction.reply({
				content: "Failed to save standup time. Please try again.",
				flags: MessageFlags.Ephemeral,
			});

			return;
		}

		await interaction.reply({
			content: `The daily standup will begin at ${time} every weekday`,
			flags: MessageFlags.Ephemeral,
		});
	} catch (error: unknown) {
		console.error(`Failed to save standup time for guild ${guildId}:`, error);

		await interaction.reply({
			content: "An unexpected error occurred while saving the standup time.",
			flags: MessageFlags.Ephemeral,
		});
	}
}

export const setTimeCommand: BotCommand = {
	data: new SlashCommandBuilder()
		.setName("set-time")
		.setDescription("Set the weekday standup start time")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addStringOption((option) =>
			option
				.setName("time")
				.setDescription("The standup time in 24-hour HH:mm format")
				.setRequired(true),
		),
	execute: executeSetTime,
};
