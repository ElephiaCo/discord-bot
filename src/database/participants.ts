import { StandupDatabase } from "./connection";

export interface Participant {
    guildId: string;
    userId: string;
    joinedAt: string;
}

interface ParticipantRow {
    guild_id: string;
    user_id: string;
    joined_at: string;
}

export function addParticipant (
    database: StandupDatabase,
    guildId: string,
    userId: string,
) : boolean {
    const  statement = database.prepare(`
        INSERT OR IGNORE INTO participants (guild_id, user_id)
        VALUES (?, ?)
        `);
    const result = statement.run(guildId, userId);
    
    return result.changes > 0;
}

export function removeParticipant (
    database: StandupDatabase,
    guildId: string,
    userId: string,
): boolean {
    const statement = database.prepare(`
        DELETE FROM participants
        WHERE guild_id = ? AND user_id = ?
        `);
    const result = statement.run(guildId, userId);

    return result.changes > 0;
}

export function getParticipants (
    database: StandupDatabase,
    guildId: string,
): Participant[] {
    const statement = database.prepare(`
        SELECT guild_id, user_id, joined_at
        FROM participants
        WHERE guild_id = ?
        ORDER BY joined_at ASC
     `);

     const  rows = statement.all(guildId) as ParticipantRow[];

     return rows.map((row) => ({
        guildId: row.guild_id,
        userId: row.user_id,
        joinedAt: row.joined_at,
     }));
}

export function isParticipant (
    database: StandupDatabase,
    guildId: string,
    userId: string,
): boolean {
    const statement = database.prepare(`
        SELECT 1
        FROM participants
        WHERE guild_id = ? AND user_id = ?
        `);
    return statement.get(guildId, userId) !== undefined;
}