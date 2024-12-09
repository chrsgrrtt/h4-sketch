import { Database } from "bun:sqlite";
import type { H4Config } from "./h4/config";

const config: H4Config = {
	queueDb: new Database("./storage/queue.db"),
};

export default config;
