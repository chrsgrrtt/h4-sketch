import type { Middleware } from "../../h4/server";

export const middleware: Middleware = () => {
	console.log("hello from middleware");
};

export function get() {
	return new Response("<h1>Hey Bobby</h1>", {
		headers: { "Content-Type": "text/html" },
	});
}
