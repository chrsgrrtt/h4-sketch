import { H4BaseController } from "../../../h4/server/controller";
import { testRepository } from "../../models/test";

export default class SingleTestController extends H4BaseController {
	get = async () => {
		const testRecords = await testRepository.query().limit(10).all();

		return Response.json({ testRecords });
	};
}
