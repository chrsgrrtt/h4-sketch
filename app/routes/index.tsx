export function get() {
	return new Response("<h1>Hey Bobby</h1>", {
		headers: { "Content-Type": "text/html" },
	});
}
