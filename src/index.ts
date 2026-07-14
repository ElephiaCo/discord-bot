import { Client, Events, GatewayIntentBits } from "discord.js";
import { config } from "./config";

//import { createDatabase } from "./database/connection";

//const database = createDatabase();

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! loged in as ${readyClient.user.tag}`);
});

client.on(Events.Error, (error) => {
	console.error("Discord client error:", error);
});

client.login(config.discordToken).catch((error: unknown) => {
	console.error("Failed to log in to Discord:", error);
	process.exit(1);
});
