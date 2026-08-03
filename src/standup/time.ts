export interface ParsedTime {
	hour: number;
	minute: number;
}

/**
 * Parses a time string in 24-hour HH:mm format.
 *
 * Accpets values from "00:00" to "23:59".
 * Returns null when the value does not match the expected format.
 */

export function parseTime(value: string): ParsedTime | null {
	const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);

	if (!match) {
		return null;
	}

	return {
		hour: Number(match[1]),
		minute: Number(match[2]),
	};
}
