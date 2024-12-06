export default function log({
	type,
	message,
	colour = "\x1b[0m",
}: {
	type: "INFO" | "REQUEST" | "ERROR";
	message: string;
	colour: string;
}) {
	const timestamp = new Date().toISOString();

	const logFunction =
		type === "ERROR"
			? console.error
			: type === "REQUEST"
				? console.info
				: console.log;

	logFunction(`${colour}[${timestamp}] [${type}] ${message}\x1b[0m`);
}
