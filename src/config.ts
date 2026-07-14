import "dotenv/config";

function getRequiredEnvironmentVariable(name: string): string {
	const value = process.env[name];

	if (!value) {
		throw new Error(`Missing required environment variable: ${name}`);
	}

	return value;
}

export const config = {
	discordToken: getRequiredEnvironmentVariable("DISCORD_TOKEN"),
	discordClientId: getRequiredEnvironmentVariable("DISCORD_CLIENT_ID"),
	discordGuildId: getRequiredEnvironmentVariable("DISCORD_GUILD_ID"),
} as const;
