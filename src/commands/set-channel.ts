import {
	ChannelType,
	type ChatInputCommandInteraction,
	MessageFlags,
	PermissionFlagsBits,
	SlashCommandBuilder,
} from "discord.js";
import { setStandupChannel } from "../database/settings";
import { getGuildId } from "./helpers";
import type { BotCommand, CommandContext } from "./types";

async function executeSetChannel(
	interaction: ChatInputCommandInteraction,
	context: CommandContext,
): Promise<void> {
	const guildId = await getGuildId(interaction);

	if (!guildId) {
		return;
	}

	const channel = interaction.options.getChannel("channel", true);

	try {
		setStandupChannel(context.database, guildId, channel.id);
	} catch (error) {
		console.error("Failed to set standup channel:", error);

		await interaction.reply({
			content: "Failed to set the standup channel. Please try again.",
			flags: MessageFlags.Ephemeral,
		});

		return;
	}

	await interaction.reply({
		content: `Standup updates will be posted in ${channel}.`,
		flags: MessageFlags.Ephemeral,
	});
}

export const setChannelCommand: BotCommand = {
	data: new SlashCommandBuilder()
		.setName("set-channel")
		.setDescription("Set the channel for completed standup updates")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addChannelOption((option) =>
			option
				.setName("channel")
				.setDescription("The channel where standups will be posted")
				.addChannelTypes(ChannelType.GuildText)
				.setRequired(true),
		),
	execute: executeSetChannel,
};
