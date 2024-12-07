import { H4BaseRoute } from "../../h4/route";
import TestJob from "../jobs/test";

export default class IndexRoute extends H4BaseRoute {
	get = async () => {
		const test = new TestJob({ props: { id: "test" } });
		const id = await test.queue();

		return Response.json({ id });
	};
}
