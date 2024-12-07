import db from "../db/queue";
import type { JobProps } from "./job";
import log from "./logger";

const workerUrl = new URL("./worker.ts", import.meta.url);

export const worker = new Worker(workerUrl);

let isWorkerBusy = false;

worker.onmessage = (event) => {
	event.data.status === "success"
		? log({
				type: "INFO",
				message: `Job ${event.data.id} updated with status: completed`,
				color: "\x1b[32m",
			})
		: event.data.status === "error"
			? log({
					type: "ERROR",
					message: `Job ${event.data.id} updated with status: failed, error: ${JSON.stringify(event.data.error)}`,
					color: "\x1b[91m",
				})
			: log({
					type: "INFO",
					message: `Worker execution: ${JSON.stringify(event.data)}`,
					color: "\x1b[36m",
				});

	isWorkerBusy = false;

	processNextJob();
};

export default function h4Queue() {
	return async () => {
		db.run(`
			CREATE TABLE IF NOT EXISTS queue_v00001 (
				id TEXT PRIMARY KEY,
				filepath TEXT NOT NULL,
				props TEXT,
				status TEXT DEFAULT 'pending',
				error TEXT,
				queued_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)
		`);

		log({
			type: "INFO",
			message: `Worker running at ${workerUrl}`,
			color: "\x1b[36m",
		});

		processNextJob();
	};
}

export function queueJob({
	filepath,
	props = {},
}: { filepath: string; props?: JobProps }) {
	const stmt = db.prepare(
		"INSERT INTO queue_v00001 (id, filepath, props) VALUES (?, ?, ?)",
	);

	const id = Bun.randomUUIDv7();
	props
		? stmt.run(id, filepath, JSON.stringify(props))
		: stmt.run(id, filepath);

	log({
		type: "INFO",
		message: `Job queued: ${id}`,
		color: "\x1b[32m",
	});

	processNextJob();

	return id;
}

export function getQueuedJobs() {
	return db
		.query('SELECT * FROM queue_v00001 WHERE status = "pending"')
		.as(
			class QueuedJob {
				id!: string;
				filepath!: string;
				props?: string | null;
				status!: string;
				error?: string | null;
				queued_at!: string;
			},
		)
		.all()
		.map((job) => ({
			...job,
			props: job.props ? JSON.parse(job.props) : null,
		}));
}

export function updateJob({
	id,
	status,
	error,
}: { id: string; status: string; error?: string }) {
	const stmt = error
		? db.prepare("UPDATE queue_v00001 SET status = ?, error = ? WHERE id = ?")
		: db.prepare("UPDATE queue_v00001 SET status = ? WHERE id = ?");

	error ? stmt.run(status, error, id) : stmt.run(status, id);

	log({
		type: "INFO",
		message: `Job ${id} updated with status: ${status}`,
		color: "\x1b[33m",
	});
}

function processNextJob() {
	if (isWorkerBusy) return;

	const jobs = getQueuedJobs();

	if (jobs.length === 0) {
		log({
			type: "INFO",
			message: "No pending jobs to process.",
			color: "\x1b[34m",
		});
		return;
	}

	const job = jobs[0];

	isWorkerBusy = true;

	updateJob({ id: job.id, status: "in_progress" });

	log({
		type: "INFO",
		message: `Processing job: ${job.id}`,
		color: "\x1b[36m",
	});
	worker.postMessage({ id: job.id, filepath: job.filepath, props: job.props });
}
