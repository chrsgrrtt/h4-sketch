import type { MatchedRoute, Server } from "bun";

export type H4RouteArgs = {
	req: Request;
	server: Server;
	match: MatchedRoute;
};
export type H4RouteHandler = (
	args: H4RouteArgs,
) => Promise<Response> | Response;

export type H4MiddlewareArgs = {
	req: Request;
	server: Server;
};
export type H4MiddlewareHandler = (args: H4MiddlewareArgs) => void;

export abstract class H4BaseRoute {
	matchedRoute!: MatchedRoute;

	get?: H4RouteHandler;
	post?: H4RouteHandler;
	put?: H4RouteHandler;
	patch?: H4RouteHandler;
	delete?: H4RouteHandler;
}
