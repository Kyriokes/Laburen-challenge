import { healthCheck } from "./controllers/health";
import { productsRouter } from "./routes/products";
import { cartRouter } from "./routes/cart";

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		try {
			// Health Check
			if (url.pathname === "/" || url.pathname === "/health") {
				return healthCheck(request, env);
			}

			// Sub-routers
			if (url.pathname.startsWith("/products")) {
				return productsRouter(request, env);
			}

			if (url.pathname.startsWith("/cart")) {
				return cartRouter(request, env);
			}

			return new Response("Not Found", { status: 404 });
		} catch (e: any) {
			return Response.json({ success: false, error: e.message }, { status: 500 });
		}
	},
};
