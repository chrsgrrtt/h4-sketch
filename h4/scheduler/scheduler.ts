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
	event.data.status === "in_progress"
		? log({
				type: "INFO",
				message: `Scheduled task ${event.data.jobName}: in_progress`,
				color: "yellow",
			})
		: event.data.status === "error"
			? log({
					type: "ERROR",
					message: `Scheduled task failed: error: ${JSON.stringify(event.data.error)}`,
					color: "red",
				})
			: log({
					type: "INFO",
					message: `Scheduled task ${event.data.jobName}: completed`,
					color: "green",
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
