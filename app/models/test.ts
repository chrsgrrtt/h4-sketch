import { H4BaseModel, H4Repository } from "../../h4/models/model";

export class TestModel extends H4BaseModel {
	id!: string;
	name!: string;
	description!: string;
}

export const testRepository = new H4Repository("test_table", TestModel);
