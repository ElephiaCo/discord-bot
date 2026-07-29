import { MessageFlags, PermissionFlagsBits, SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import { setStandupTime } from "../database/settings";
import { parseTime } from '../standup/time';
import type { BotCommand, CommandContext } from "./types";
import { getGuildId } from "./helpers";

async function executeSetTime(
    interaction: ChatInputCommandInteraction,
    context: CommandContext,
); Promise<void> {
    const guildId = getGuildId(interaction);

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

    setStandupTime(context.database, guildId, time);

    await interaction.reply({
        content: `The daily standup will begin at ${time} every weekday`,
        flags: MessageFlags.Ephemeral,
    });
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