import log from "./logger";

const workerUrl = new URL("./worker.ts", import.meta.url);

export const worker = new Worker(workerUrl);

worker.onmessage = (event) => {
	log({
		type: "INFO",
		message: `Worker execution: ${JSON.stringify(event.data)}`,
		colour: "\x1b[36m",
	});
};

export default function h4Queue() {
	return async () => {
		log({
			type: "INFO",
			message: `Worker running at ${workerUrl}`,
			colour: "\x1b[36m",
		});
	};
}
