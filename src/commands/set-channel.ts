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

	if (channel.type !== ChannelType.GuildText) {
		await interaction.reply({
			content: "Please select a public text channel.",
			flags: MessageFlags.Ephemeral,
		});

		return;
	}

	setStandupChannel(context.database, guildId, channel.id);

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
