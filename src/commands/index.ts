import { joinCommand } from "./join";
import { leaveCommand } from "./leave";
import { setChannelCommand } from "./set-channel";
import type { BotCommand } from "./types";

export const commands: BotCommand[] = [
	joinCommand,
	leaveCommand,
	setChannelCommand,
];

export const commandsByName = new Map(
	commands.map((command) => [command.data.name, command]),
);
