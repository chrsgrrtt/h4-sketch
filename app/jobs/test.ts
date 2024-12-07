import { H4BaseJob } from "../../h4/job";

export default class TestJob extends H4BaseJob<{ id: string }> {
	filepath = import.meta.url;

	run = () => console.log("====>", "hello");
}
