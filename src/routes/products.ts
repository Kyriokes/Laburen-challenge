
import * as productsController from "../controllers/products";

export async function productsRouter(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url);

	// POST /products/list
	if (url.pathname === "/products/list" && request.method === "POST") {
		return productsController.listProducts(request, env);
	}

	// POST /products/get (Detalle)
	if (url.pathname === "/products/get" && request.method === "POST") {
		return productsController.getProductDetails(request, env);
	}

	return new Response("Products endpoint not found", { status: 404 });
}
