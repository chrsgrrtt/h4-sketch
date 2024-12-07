import { Database } from "bun:sqlite";

const queueDb = new Database(":memory:");

export default queueDb;
