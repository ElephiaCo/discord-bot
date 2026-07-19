import { deployCommands } from "./deploy-commands";

deployCommands().catch((error: unknown) => {
	console.error("failed to register commands:", error);
	process.exit(1);
});
