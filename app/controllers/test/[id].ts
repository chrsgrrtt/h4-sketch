import { H4BaseController } from "../../../h4/server/controller";
import { testRepository } from "../../models/test";

export default class SingleTestController extends H4BaseController {
	get = async () => {
		const testRecord = await testRepository
			.query()
			.where("id", this.match.params.id)
			.first();

		return Response.json({ testRecord });
	};

	patch = async () => {
		const result = await testRepository
			.query()
			.where("id", this.match.params.id)
			.update({
				name: "test update",
			});

		return Response.json({ result });
	};
}
