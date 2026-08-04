export type StandupStep = "yesterday" | "today" | "blockers";

export interface StandupSession {
	guildId: string;
	userId: string;
	step: StandupStep;
	yesterday?: string;
	today?: string;
	blockers?: string;
}

export interface CompletedStandup {
	guildId: string;
	userId: string;
	yesterday: string;
	today: string;
	blockers: string;
}

export class StandupSessionManager {
	private readonly sessions = new Map<string, StandupSession>();

	startSession(guildId: string, userId: string): void {
		this.sessions.set(userId, {
			guildId,
			userId,
			step: "yesterday",
		});
	}

	hasSession(userId: string): boolean {
		return this.sessions.has(userId);
	}

	submitAnswer(
		userId: string,
		answer: string,
	):
		| { completed: false; nextQuestion: string }
		| { completed: true; standup: CompletedStandup }
		| null {
		const session = this.sessions.get(userId);

		if (!session) {
			return null;
		}

		if (session.step === "yesterday") {
			session.yesterday = answer;
			session.step = "today";

			return {
				completed: false,
				nextQuestion: "What are you working on today?",
			};
		}

		if (session.step === "today") {
			session.today = answer;
			session.step = "blockers";

			return {
				completed: false,
				nextQuestion: "Do you have any blockers?",
			};
		}

		session.blockers = answer;

		const standup: CompletedStandup = {
			guildId: session.guildId,
			userId: session.userId,
			yesterday: session.yesterday ?? "",
			today: session.today ?? "",
			blockers: session.blockers,
		};

		this.sessions.delete(userId);

		return {
			completed: true,
			standup,
		};
	}
}
