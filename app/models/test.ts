import { H4BaseModel } from "../../h4/models/model";
import { H4Repository } from "../../h4/models/repository";

export class TestModel extends H4BaseModel {
	id!: string;
	name!: string;
	description!: string;
}

export const testRepository = new H4Repository("test_table", TestModel);
