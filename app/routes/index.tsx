import { H4BaseRoute, type H4RouteHandler } from "../../h4/router";

export default class Route extends H4BaseRoute {
	get: H4RouteHandler = ({ req }) => new Response(`Hello, ${req.url}!`);
}
