export function h4worker() {
	return async () => {
		// Example worker logic
		console.log("Worker started...");
		setInterval(() => {
			console.log("Worker task running...");
		}, 5000);
	};
}
