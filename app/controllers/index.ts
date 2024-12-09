import { H4BaseController } from "../../h4/server/controller";
import TestJob from "../jobs/test";

export default class IndexController extends H4BaseController {
	get = async () => {
		const test = new TestJob({ props: { word: "va va voom" } });
		const id = await test.queue();

		return Response.json({ id });
	};
}
