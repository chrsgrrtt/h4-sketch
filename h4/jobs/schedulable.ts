import { H4BaseJob } from "./job";

export abstract class H4SchedulableJob extends H4BaseJob {
	constructor() {
		super({ props: null });
	}
}
