import { type ChatInputCommandInteraction, MessageFlags } from "discord.js";

export async function getGuildId(
	interaction: ChatInputCommandInteraction,
): Promise<string | null> {
	if (!interaction.guildId) {
		await interaction.reply({
			content: "This command can only be used in a Discord server.",
			flags: MessageFlags.Ephemeral,
		});

		return null;
	}

	return interaction.guildId;
}
