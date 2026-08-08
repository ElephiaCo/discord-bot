import {
	Client,
	Events,
	GatewayIntentBits,
	MessageFlags,
	Partials,
} from "discord.js";
import { commandsByName } from "./commands";
import { config } from "./config";
import { createDatabase } from "./database/connection";
import { runMigrations } from "./database/migrate";
import { StandupSessionManager } from "./standup/sessions";

const sessionManager = new StandupSessionManager();

const database = createDatabase();
runMigrations(database);

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Channel],
});

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) {
		return;
	}

	const command = commandsByName.get(interaction.commandName);

	if (!command) {
		return;
	}

	try {
		await command.execute(interaction, { database });
	} catch (error: unknown) {
		console.error(`Failed to execute /${interaction.commandName}:`, error);

		const response = {
			content: "Something went wrong while running this command.",
			flags: MessageFlags.Ephemeral,
		} as const;

		if (interaction.replied || interaction.deferred) {
			await interaction.followUp(response);
		} else {
			await interaction.reply(response);
		}
	}
});

client.on(Events.Error, (error) => {
	console.error("Discord client error:", error);
});

client.login(config.discordToken).catch((error: unknown) => {
	console.error("Failed to log in to Discord:", error);
	process.exit(1);
});

client.on(Events.MessageCreate, async (message) => {
	if (message.author.bot) {
		return;
	}

	if (message.guildId !== null) {
		return;
	}

	if (!sessionManager.hasSession(message.author.id)) {
		return;
	}

	const answer = message.content.trim();

	if (!answer) {
		return;
	}

	const result = sessionManager.submitAnswer(message.author.id, answer);

	if (!result) {
		return;
	}

	if (!result.completed) {
		await message.reply(result.nextQuestion);
		return;
	}

	try {
		await postCompletedStandup(result.standup, {
			client,
			database,
		});

		await message.reply(
			"Thank you! Your standup has been submitted.",
		);
	} catch (error: unknown) {
		console.error("Failed to post standup:", error);

		await message.reply(
			"Your standup could not be posted. Please contact an administrator.",
		);
	}
});
