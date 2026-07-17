import type { BotCommand } from "./types";
import { joinCommand } from "./join";
import { leaveCommand } from "./leave";

export const commands: BotCommand[] = [
    joinCommand,
    leaveCommand,
];

export const commandsByName = new Map(
    commands.map((command) => [command.data.name, command]),
);