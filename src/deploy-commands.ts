import { REST, Routes } from "discord.js";
import { commands } from "./commands";
import { config } from "./config";

const rest = new REST().setToken(config.discordToken);

async function deployCommands(): Promise<void> {
    const commandBodies = commands.map(( command ) => command.data.toJSON());

    await rest.put(
        Routes.applicationGuildCommands(
            config.discordClientId,
            config.discordGuildId,
        ),
        {
            body: commandBodies,
        },
    );

    console.log(`Registered ${commandBodies.length} giuld commands.`);
}

deployCommands().catch((error: unknown) => {
    console.error("failed to register commands:", error);
    process.exit(1);
});