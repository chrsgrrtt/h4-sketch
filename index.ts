import { h4 } from "./h4";
import h4Queue from "./h4/jobs/queue";
import h4Router from "./h4/routes/router";

const controllersDir = "./app/controllers";
const port = Number(process.env.PORT || "3000");

h4([
	h4Router({ controllersDir, port }),
	h4Queue({ maxCompletedJobsCount: 100 }),
]);
