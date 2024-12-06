import h4Router from "./h4/router";

const routesDir = "./app/routes";
const port = Number(process.env.PORT || "3000");

try {
	await h4Router({
		routesDir,
		port,
		middleware: () => console.log("hello from global middleware"),
	});
	console.log(`Server running at http://127.0.0.1:${port}`);
} catch (err) {
	console.error("Failed to start the server:", err);
}
