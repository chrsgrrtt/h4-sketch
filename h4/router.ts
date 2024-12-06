import type { Server } from "bun";
import log from "./logger";
import type { H4BaseRoute, H4RouteHandler } from "./route";

function logRequest(req: Request, status: number) {
	const colour =
		status >= 500 ? "\x1b[31m" : status >= 400 ? "\x1b[33m" : "\x1b[32m";

	log({
		type: "REQUEST",
		message: `${req.method} ${req.url} ${status}`,
		colour,
	});
}

export default function h4Router({
	routesDir,
	port = Number(process.env.PORT || 3000),
	middleware,
}: {
	routesDir: string;
	port?: number;
	middleware?: (args: { req: Request; server: Server }) => void;
}) {
	return async () => {
		const router = new Bun.FileSystemRouter({
			style: "nextjs",
			dir: routesDir,
		});

		Bun.serve({
			port,
			fetch: async (req, server) => {
				if (middleware) await middleware({ req, server });

				const match = router.match(req);

				if (match) {
					const { filePath } = match;

					try {
						const RouteClass = (await import(filePath)).default;
						const routeInstance: H4BaseRoute = new RouteClass();

						routeInstance.match = match;
						routeInstance.req = req;
						routeInstance.server = server;

						const method = req.method.toLowerCase() as
							| "get"
							| "post"
							| "put"
							| "patch"
							| "delete";

						if (typeof routeInstance[method] === "function") {
							const handler = routeInstance[method] as H4RouteHandler;

							const response = await handler();
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

		log({
			type: "INFO",
			message: `Router running: http://localhost:${port}`,
			colour: "\x1b[36m",
		});
	};
}
