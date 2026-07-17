import { MessageFlags, SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import { removeParticipant } from "../database/participants";
import type { BotCommand, CommandContext } from "./types";

async function executeLeave(
    interaction: ChatInputCommandInteraction,
    context: CommandContext,
): Promise<void> {
    const guildId = interaction.guildId;

    if (!guildId) {
        await interaction.reply({
            content: "This command can only be used in a Discord server.",
            flags: MessageFlags.Ephemeral,
        });

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
    .setDescription("leave the daily standup roaster"),
    execute: executeLeave,
};