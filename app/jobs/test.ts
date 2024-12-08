import { H4BaseJob } from "../../h4/job";

export default class TestJob extends H4BaseJob<{ word: string }> {
	filepath = import.meta.url;

	run = () => console.log(`Hey Bobby... what's french for ${this.props.word}`);
}
