import type { Database, SQLQueryBindings } from "bun:sqlite";
import config from "../../config";

export abstract class H4BaseModel {}

export class H4Repository<T extends H4BaseModel> {
	constructor(
		public readonly table: string,
		public readonly model: new () => T,
		public readonly db: Database = config.primaryDb,
	) {}

	find_by(params: Partial<T>) {
		const conditions = Object.keys(params)
			.map((key) => `${key} = ?`)
			.join(" AND ");
		const values: SQLQueryBindings[] = Object.values(params);

		return this.db
			.query(`SELECT * FROM ${this.table} WHERE ${conditions}`)
			.as(this.model)
			.get(...values);
	}

	create(params: T) {
		const columns = Object.keys(params);
		const stmt = this.db.prepare(
			`INSERT INTO ${this.table} (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")}) RETURNING *`,
		);

		const values: SQLQueryBindings[] = Object.values(params);

		return stmt.get(...values) as T;
	}
}
