import { h4 } from "./h4";
import h4Queue from "./h4/queue";
import h4Router from "./h4/router";

const routesDir = "./app/routes";
const port = Number(process.env.PORT || "3000");

h4([h4Router({ routesDir, port }), h4Queue()]);
