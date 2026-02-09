
import * as cartController from "../controllers/cart";

export async function cartRouter(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url);

	// POST /cart (Crear)
	if (url.pathname === "/cart" && request.method === "POST") {
		return cartController.createCart(request, env);
	}

	// POST /cart/add
	if (url.pathname === "/cart/add" && request.method === "POST") {
		return cartController.addItem(request, env);
	}

	// POST /cart/update
	if (url.pathname === "/cart/update" && request.method === "POST") {
		return cartController.updateItem(request, env);
	}

	// POST /cart/get (Ver)
	if (url.pathname === "/cart/get" && request.method === "POST") {
		return cartController.getCart(request, env);
	}

	return new Response("Cart endpoint not found", { status: 404 });
}
