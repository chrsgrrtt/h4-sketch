import type { Database, SQLQueryBindings } from "bun:sqlite";
import config from "../../config";

export abstract class H4BaseModel {}

type FieldType<T, K extends keyof T> = T[K];

class QueryBuilder<T> {
	protected conditions: string[] = [];
	protected values: SQLQueryBindings[] = [];
	private limitValue?: number;
	private offsetValue?: number;

	constructor(
		protected table: string,
		protected db: Database,
		protected model: new () => T,
	) {}

	where<K extends keyof T>(
		field: ((builder: QueryBuilder<T>) => QueryBuilder<T>) | K,
		value: K extends keyof T ? FieldType<T, K> : never,
	) {
		if (typeof field === "function") {
			const subBuilder = new QueryBuilder<T>(this.table, this.db, this.model);
			field(subBuilder);
			this.conditions.push(`(${subBuilder.conditions.join(" AND ")})`);
			this.values.push(...subBuilder.values);
		} else {
			this.conditions.push(`${String(field)} = ?`);
			this.values.push(value as SQLQueryBindings);
		}
		return this;
	}

	whereNot<K extends keyof T>(field: K, value: FieldType<T, K>) {
		this.conditions.push(`${String(field)} != ?`);
		this.values.push(value as SQLQueryBindings);
		return this;
	}

	whereIn<K extends keyof T>(field: K, values: FieldType<T, K>[]) {
		this.conditions.push(
			`${String(field)} IN (${values.map(() => "?").join(", ")})`,
		);
		this.values.push(...(values as SQLQueryBindings[]));
		return this;
	}

	whereLike<K extends keyof T>(field: K, pattern: string) {
		this.conditions.push(`${String(field)} LIKE ?`);
		this.values.push(pattern);
		return this;
	}

	limit(value: number) {
		this.limitValue = value;
		return this;
	}

	offset(value: number) {
		this.offsetValue = value;
		return this;
	}

	toSql() {
		const whereClause =
			this.conditions.length > 0
				? `WHERE ${this.conditions.join(" AND ")}`
				: "";
		const limitClause = this.limitValue ? ` LIMIT ${this.limitValue}` : "";
		const offsetClause = this.offsetValue ? ` OFFSET ${this.offsetValue}` : "";
		return `SELECT * FROM ${this.table} ${whereClause}${limitClause}${offsetClause}`;
	}

	first() {
		const sql = this.toSql();
		return this.db
			.query(sql)
			.as(this.model)
			.get(...this.values);
	}

	all() {
		const sql = this.toSql();
		return this.db
			.query(sql)
			.as(this.model)
			.all(...this.values);
	}
}

export class H4Repository<T extends H4BaseModel> {
	constructor(
		public readonly table: string,
		public readonly model: new () => T,
		public readonly db: Database = config.primaryDb,
	) {}

	findBy(params: Partial<T>) {
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

	query() {
		return new QueryBuilder<T>(this.table, this.db, this.model);
	}
}
