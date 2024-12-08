import { H4BaseJob } from "../../h4/jobs/job";

export default class TestJob extends H4BaseJob<{ word: string }> {
	filepath = import.meta.url;

	run = () => console.log(`Hey Bobby... what's french for ${this.props.word}`);
}
