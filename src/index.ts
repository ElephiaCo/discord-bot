import { Client, Events, GatewayIntentBits, MessageFlags } from "discord.js";
import { commandsByName } from "./commands";
import { config } from "./config";
import { createDatabase } from "./database/connection";

const database = createDatabase();

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! loged in as ${readyClient.user.tag}`);
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
