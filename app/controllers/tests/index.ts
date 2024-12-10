import { randomUUIDv7 } from "bun";
import { H4BaseController } from "../../../h4/server/controller";
import { testRepository } from "../../models/test";

export default class TestsController extends H4BaseController {
	get = async () => {
		const testRecords = await testRepository.query().limit(10).all();

		return Response.json({ testRecords });
	};

	post = async () => {
		const record = await testRepository.create({
			id: randomUUIDv7(),
			name: "test",
			description: "hello",
		});

		return Response.json({ record });
	};
}
