
import * as productsController from "../controllers/products";

export async function productsRouter(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url);

	// POST /products/list
	if (url.pathname === "/products/list" && request.method === "POST") {
		return productsController.listProducts(request, env);
	}

	// GET /products/:id
	// Example: /products/123
	if (url.pathname.startsWith("/products/") && request.method === "GET") {
		const id = url.pathname.split("/")[2];
		if (id && id !== "list") {
			return productsController.getProductDetails(request, env, id);
		}
	}

	return new Response("Products endpoint not found", { status: 404 });
}
