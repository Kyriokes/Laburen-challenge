import * as products from "./controllers/products";
import * as cart from "./controllers/cart";

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		try {
			// 1. Health Check
			if (url.pathname === "/" || url.pathname === "/health") {
				return new Response("MCP running OK");
			}

			// 2. Products
			if (url.pathname === "/products/list" && request.method === "POST") {
				return products.listProducts(request, env);
			}
			// Example: /products/123
			if (url.pathname.startsWith("/products/") && request.method === "GET") {
				const id = url.pathname.split("/")[2];
				if (id && id !== "list") {
					return products.getProductDetails(request, env, id);
				}
			}

			// 3. Cart
			if (url.pathname === "/cart" && request.method === "POST") {
				return cart.createCart(request, env);
			}
			if (url.pathname === "/cart/add" && request.method === "POST") {
				return cart.addItem(request, env);
			}
			if (url.pathname === "/cart/update" && request.method === "POST") {
				return cart.updateItem(request, env);
			}
			// Example: /cart/5
			if (url.pathname.startsWith("/cart/") && request.method === "GET") {
				const id = url.pathname.split("/")[2];
				if (id && id !== "add" && id !== "update") {
					return cart.getCart(request, env, id);
				}
			}

			return new Response("Not Found", { status: 404 });
		} catch (e: any) {
			return Response.json({ success: false, error: e.message }, { status: 500 });
		}
	},
};
