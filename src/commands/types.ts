import type {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
} from "discord.js";
import type { StandupDatabase } from "../database/connection";

export interface CommandContext {
	database: StandupDatabase;
}

export interface BotCommand {
	data: SlashCommandBuilder;
	execute(
		interaction: ChatInputCommandInteraction,
		context: CommandContext,
	): Promise<void>;
}
