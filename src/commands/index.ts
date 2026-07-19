import { joinCommand } from "./join";
import { leaveCommand } from "./leave";
import type { BotCommand } from "./types";

export const commands: BotCommand[] = [joinCommand, leaveCommand];

export const commandsByName = new Map(
	commands.map((command) => [command.data.name, command]),
);
