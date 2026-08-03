import type { GuildSettings } from "../types/guild-settings";
import type { StandupDatabase } from "./connection";
import type { GuildSettingsRow } from "./types.ts";

export function setStandupChannel(
	database: StandupDatabase,
	guildId: string,
	channelId: string,
): void {
	const statement = database.prepare(`
        INSERT INTO guild_settings (guild_id, standup_channel_id)
        VALUES (?, ?)
        ON CONFLICT(guild_id)
        DO UPDATE SET standup_channel_id = excluded.standup_channel_id
        `);

	statement.run(guildId, channelId);
}

export function setStandupTime(
	database: StandupDatabase,
	guildId: string,
	time: string,
): boolean {
	const statement = database.prepare(`
        INSERT INTO guild_settings (guild_id, standup_time)
        VALUES (?, ?)
        ON CONFLICT(guild_id)
        DO UPDATE SET standup_time = excluded.standup_time
        `);

	const result = statement.run(guildId, time);

	return result.changes > 0;
}

export function getGuildSettings(
	database: StandupDatabase,
	guildId: string,
): GuildSettings | null {
	const statement = database.prepare(`
        SELECT guild_id, standup_channel_id, standup_time
        FROM guild_settings
        WHERE guild_id = ?
        `);

	const row = statement.get(guildId) as GuildSettingsRow | undefined;

	if (!row) {
		return null;
	}

	return {
		guildId: row.guild_id,
		standupChannelId: row.standup_channel_id,
		standupTime: row.standup_time,
	};
}

export function getStandupChannel(
	database: StandupDatabase,
	guildId: string,
): string | null {
	return getGuildSettings(database, guildId)?.standupChannelId ?? null;
}

export function getStandupTime(
	database: StandupDatabase,
	guildId: string,
): string | null {
	return getGuildSettings(database, guildId)?.standupTime ?? null;
}

export function getConfiguredGuilds(
	database: StandupDatabase,
): GuildSettings[] {
	const statement = database.prepare(`
		SELECT guild_id, standup_channel_id, standup_time
		FROM guild_settings
		WHERE standup_time IS NOT NULL
	`);

	const rows = statement.all() as GuildSettingsRow[];

	return rows.map((row) => ({
		guildId: row.guild_id,
		standupChannelId: row.standup_channel_id,
		standupTime: row.standup_time,
	}));
}
