export interface  ParsedTime {
    hour: number;
    minute: number;
}

export function  parseTime(value: string):  ParsedTime | null {
    const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);

    if (!match) {
        return null;
    }

    return {
        hour: Number(match[1]),
        minute: Number(match[2]),
    };
}