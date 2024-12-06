import type { MatchedRoute } from "bun";

export function get({ match }: { match: MatchedRoute }) {
	return new Response(`<h1>What's french for ${match.params.word}?</h1>`, {
		headers: { "Content-Type": "text/html" },
	});
}
