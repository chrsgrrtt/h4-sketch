import type { Database } from "bun:sqlite";

export type H4Config = {
	queueDb: Database;
};
