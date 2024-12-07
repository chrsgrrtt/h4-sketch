export default function log({
	type,
	message,
	color = "\x1b[0m",
}: {
	type: "INFO" | "REQUEST" | "ERROR";
	message: string;
	color: string;
}) {
	const timestamp = new Date().toISOString();

	const logFunction =
		type === "ERROR"
			? console.error
			: type === "REQUEST"
				? console.info
				: console.log;

	logFunction(`${color}[${timestamp}] [${type}] ${message}\x1b[0m`);
}
