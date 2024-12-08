import type { H4SchedulableJob } from "../jobs/schedulable";
import log from "../logger";
import type { CronSyntax } from "./cron";

type ScheduledTask = {
	cron: CronSyntax;
	job: new () => H4SchedulableJob;
};

const workerUrl = new URL("worker.ts", import.meta.url);
const worker = new Worker(workerUrl);

worker.onmessage = (event) => {
	event.data.status === "success"
		? log({
				type: "INFO",
				message: `Scheduled task executed successfully: ${event.data.jobName}`,
				color: "green",
			})
		: log({
				type: "ERROR",
				message: `Scheduled task failed: ${event.data.jobName}, error: ${JSON.stringify(event.data.error)}`,
				color: "red",
			});
};

export default function q4Schedule({ tasks }: { tasks: ScheduledTask[] }) {
	return async () => {
		log({
			type: "INFO",
			message: `Scheduler running ${tasks.length} task(s) at ${workerUrl}`,
			color: "cyan",
		});
		const taskConfigs = tasks.map((task) => ({
			cron: task.cron,
			filepath: new task.job().filepath,
		}));

		worker.postMessage({ type: "INIT", schedule: taskConfigs });
	};
}
