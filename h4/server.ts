import type { MatchedRoute, Server } from "bun";

export type RouteHandler = (args: {
	req: Request;
	server: Server;
	match: MatchedRoute;
}) => Response | Promise<Response>;

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

export type Middleware = (args: {
	req: Request;
	server: Server;
	match?: MatchedRoute;
	// biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
}) => Response | void | Promise<Response | void>;

export default async function h4Serve({
	routesDir,
	port = Number(process.env.PORT || 3000),
	middleware,
}: {
	routesDir: string;
	port?: number;
	middleware?: Middleware;
}) {
	const router = new Bun.FileSystemRouter({
		style: "nextjs",
		dir: routesDir,
	});

	return Bun.serve({
		port,
		fetch: async (req, server) => {
			const match = router.match(req);

			if (middleware) {
				const result = await middleware({ req, server });

				if (result instanceof Response) {
					logRequest(req, result.status);
					return result;
				}
			}

			if (match) {
				const { filePath } = match;

				try {
					const module = await import(filePath);

					const method = req.method.toLowerCase();
					const handler: RouteHandler = module[method];

					if (handler) {
						const routeMiddleware: Middleware | undefined = module.middleware;
						if (routeMiddleware) {
							const result = await routeMiddleware({ req, server, match });
							if (result instanceof Response) {
								logRequest(req, result.status);
								return result;
							}
						}

						const response = await handler({ req, server, match });
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
