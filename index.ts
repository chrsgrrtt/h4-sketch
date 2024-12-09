import ScheduledJob from "./app/jobs/scheduled";
import { h4 } from "./h4";
import h4Queue from "./h4/queue/queue";
import h4Scheduler from "./h4/scheduler/scheduler";
import h4Server from "./h4/server/router";

const controllersDir = "./app/controllers";
const port = Number(process.env.PORT || "3000");

h4([
	h4Server({ controllersDir, port }),
	h4Queue({ maxCompletedJobsCount: 100 }),
	h4Scheduler({
		jobs: [
			{
				cron: "*/5 * * * *",
				job: ScheduledJob,
			},
		],
	}),
]);
