import { h4 } from "./h4";
import h4Router from "./h4/router";
import { h4worker } from "./h4/worker";

const routesDir = "./app/routes";
const port = Number(process.env.PORT || "3000");

h4([
	h4Router({
		routesDir,
		port,
		middleware: () => console.log("hello from global middleware"),
	}),
	h4worker(),
]);
