import type { RouteHandler } from "../../h4/server";

export const get: RouteHandler = ({ match }) => {
	return new Response(`<h1>What's french for ${match.params.word}?</h1>`, {
		headers: { "Content-Type": "text/html" },
	});
};
