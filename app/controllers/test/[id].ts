import { H4BaseController } from "../../../h4/server/controller";
import { testRepository } from "../../models/test";

export default class SingleTestController extends H4BaseController {
	get = async () => {
		const testRecord = await testRepository.findBy({
			id: this.match.params.id,
		});

		return Response.json({ testRecord });
	};
}
