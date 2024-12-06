import { worker } from "../../h4/queue";
import { H4BaseRoute, type H4RouteHandler } from "../../h4/route";

export default class IndexRoute extends H4BaseRoute {
	get: H4RouteHandler = () => {
		worker.postMessage({
			jobPath: "app/jobs/test", // Name of the job class
			params: { id: 123 }, // Parameters to pass to the job's `run` method
		});
		return Response.json({ hello: true });
	};
}
