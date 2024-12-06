import type { MatchedRoute, Server } from "bun";

export type H4RouteArgs = {
	req: Request;
	server: Server;
	match: MatchedRoute;
};

export type H4MiddlewareArgs = {
	req: Request;
	server: Server;
};

export type H4RouteHandler = (
	args: H4RouteArgs,
) => Promise<Response> | Response;
export type H4MiddlewareHandler = (args: H4MiddlewareArgs) => void;

export abstract class H4BaseRoute {
	middleware?: H4MiddlewareHandler;
	get?: H4RouteHandler;
	post?: H4RouteHandler;
	put?: H4RouteHandler;
	patch?: H4RouteHandler;
	delete?: H4RouteHandler;
}

function logRequest(req: Request, status: number) {
	const colours = {
		RESET: "\x1b[0m",
		GREEN: "\x1b[32m",
		YELLOW: "\x1b[33m",
		RED: "\x1b[31m",
	};

	const statusColour =
		status >= 500
			? colours.RED
			: status >= 400
				? colours.YELLOW
				: colours.GREEN;

	console.log(
		`[${new Date().toISOString()}] ${req.method} ${req.url} ${statusColour}${status}${colours.RESET}`,
	);
}

export default async function h4Router({
	routesDir,
	port = Number(process.env.PORT || 3000),
	middleware,
}: {
	routesDir: string;
	port?: number;
	middleware?: H4MiddlewareHandler;
}) {
	const router = new Bun.FileSystemRouter({
		style: "nextjs",
		dir: routesDir,
	});

	return Bun.serve({
		port,
		fetch: async (req, server) => {
			if (middleware) await middleware({ req, server });

			const match = router.match(req);

			if (match) {
				const { filePath } = match;

				try {
					const RouteClass = (await import(filePath)).default;
					const routeInstance: H4BaseRoute = new RouteClass();

					await routeInstance.middleware?.({
						req,
						server,
					});

					const method = req.method.toLowerCase() as
						| "get"
						| "post"
						| "put"
						| "patch"
						| "delete";

					if (typeof routeInstance[method] === "function") {
						const response = await routeInstance[method]({
							req,
							server,
							match,
						});
						logRequest(req, response.status);
						return response;
					}

					logRequest(req, 405);
					return new Response("Method Not Allowed", { status: 405 });
				} catch (err) {
					console.error(`Error loading route: ${filePath}`, err);
					logRequest(req, 500);
					return new Response("Internal Server Error", { status: 500 });
				}
			}

			logRequest(req, 404);
			return new Response("Not Found", { status: 404 });
		},
	});
}
