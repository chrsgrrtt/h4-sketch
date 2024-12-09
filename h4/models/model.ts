import type { Database } from "bun:sqlite";
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

		return this.db
			.query(`SELECT * FROM ${this.table} WHERE ${conditions}`)
			.as(this.model)
			.get();
	}

	all() {
		return this.db.query(`SELECT * FROM ${this.table}`).as(this.model).all();
	}
}

class TestModel extends H4BaseModel {
	id!: string;
	name!: string;
	description!: string;
}

const testRepository = new H4Repository("test_table", TestModel);

const result = testRepository.find_by({ name: "test", id: "123" });
const invalid = testRepository.find_by({ invalid: "test" });
