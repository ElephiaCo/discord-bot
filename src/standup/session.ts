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

const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export class StandupSessionManager {
	private readonly sessions = new Map<string, StandupSession>();
	private readonly expirationTimers = new Map<
		string,
		ReturnType<typeof setTimeout>
	>();

	startSession(guildId: string, userId: string): void {
		const existingTimer = this.expirationTimers.get(userId);

		if (existingTimer) {
			clearTimeout(existingTimer);
		}

		this.sessions.set(userId, {
			guildId,
			userId,
			step: "yesterday",
		});

		const timer = setTimeout(() => {
			this.sessions.delete(userId);
			this.expirationTimers.delete(userId);
		}, SESSION_TTL_MS);

		timer.unref();
		this.expirationTimers.set(userId, timer);
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

		const timer = this.expirationTimers.get(userId);

		if (timer) {
			clearTimeout(timer);
			this.expirationTimers.delete(userId);
		}

		return {
			completed: true,
			standup,
		};
	}
}
