
import * as cartController from "../controllers/cart";

export async function cartRouter(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url);

	// POST /cart
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

	// GET /cart/:id
	if (url.pathname.startsWith("/cart/") && request.method === "GET") {
		const id = url.pathname.split("/")[2];
		if (id && id !== "add" && id !== "update") {
			return cartController.getCart(request, env, id);
		}
	}

	return new Response("Cart endpoint not found", { status: 404 });
}
