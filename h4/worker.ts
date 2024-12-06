declare const self: Worker;

self.onmessage = async (event: MessageEvent) => {
	try {
		const { jobPath, params } = event.data;

		if (!jobPath) throw new Error("Job file path not provided");

		const { default: JobClass } = await import(jobPath);

		if (typeof JobClass?.prototype?.run !== "function") {
			throw new Error(`Job at ${jobPath} does not implement a run method`);
		}

		const jobInstance = new JobClass();
		const result = await jobInstance.run(params);

		postMessage({ status: "success", result });
	} catch (error) {
		postMessage({ status: "error", error: error.message });
	}
};
