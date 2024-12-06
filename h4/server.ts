export default async function h4Serve({
	routesDir,
	port = Number(process.env.PORT || 3000),
}: { routesDir: string; port?: number }) {
	const absoluteRoutesDir = routesDir.startsWith("/")
		? routesDir
		: `${process.cwd()}/${routesDir}`;

	const router = new Bun.FileSystemRouter({
		style: "nextjs",
		dir: absoluteRoutesDir,
	});

	return Bun.serve({
		port,
		fetch: async (req, server) => {
			const match = router.match(req);

			if (match) {
				const { filePath } = match;

				try {
					const module = await import(filePath);

					const method = req.method.toLowerCase();

					if (module[method]) return module[method]({ req, server, match });

					return new Response("Method Not Allowed", { status: 405 });
				} catch (err) {
					console.error(`Error loading route: ${filePath}`, err);
					return new Response("Internal Server Error", { status: 500 });
				}
			}

			return new Response("Not Found", { status: 404 });
		},
	});
}
