import { queueJob } from "./queue";

export type JobProps =
	| string
	| number
	| boolean
	| null
	| { [key: string]: JobProps }
	| JobProps[];

export abstract class H4BaseJob<T extends JobProps = JobProps> {
	filepath!: string;
	props?: T;

	queue() {
		return queueJob({
			filepath: this.filepath,
			props: this.props,
		});
	}
}
