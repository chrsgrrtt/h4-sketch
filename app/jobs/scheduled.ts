import { H4SchedulableJob } from "../../h4/jobs/schedulable";

export default class ScheduledJob extends H4SchedulableJob {
	filepath = import.meta.url;

	run = () => console.log(`Job run at ${new Date().toDateString()}`);
}
