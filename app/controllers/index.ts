import { H4BaseController } from "../../h4/server/controller";
import TestJob from "../jobs/test";
import { testRepository } from "../models/test";

export default class IndexController extends H4BaseController {
	get = async () => {
		const testJob = new TestJob({ props: { word: "va va voom" } });

		const id = await testJob.queue();

		await testRepository.create({
			id,
			name: "test",
			description: "hello",
		});

		const testRecord = await testRepository.findBy({ id });

		return Response.json({ testRecord });
	};
}
