import type { MatchedRoute, Server } from "bun";

export type H4RouteHandler = () => Promise<Response> | Response;

export type H4MiddlewareHandler = () => void;

export abstract class H4BaseRoute {
	match: MatchedRoute;
	req: Request;
	server: Server;

	constructor({
		match,
		req,
		server,
	}: { match: MatchedRoute; req: Request; server: Server }) {
		this.match = match;
		this.req = req;
		this.server = server;
	}

	get?: H4RouteHandler;
	post?: H4RouteHandler;
	put?: H4RouteHandler;
	patch?: H4RouteHandler;
	delete?: H4RouteHandler;
}
