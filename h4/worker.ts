import log from "./logger";

declare const self: Worker;

self.onmessage = async (event: MessageEvent) => {
	try {
		const { filepath, props } = event.data;

		if (!filepath) throw new Error("Job file path not provided");

		const JobClass = (await import(filepath)).default;

		const jobInstance = new JobClass();
		jobInstance.props = props;

		if (typeof jobInstance.run === "function") {
			const result = await jobInstance.run(props);

			return postMessage({ status: "success", result });
		}

		throw new Error(
			`${jobInstance.constructor.name} does not have a run method`,
		);
	} catch (error) {
		console.log(error);
		postMessage({ status: "error", error: JSON.stringify(error) });
	}
};
