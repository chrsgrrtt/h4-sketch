import { H4BaseController } from "../../../h4/server/controller";
import { TestModel, testRepository } from "../../models/test";

export default class SingleTestController extends H4BaseController {
	get = async () => {
		const query = await testRepository.query("select * from test_table");

		const testRecords = await query.as(TestModel).all();

		return Response.json({ testRecords });
	};
}
