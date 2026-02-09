
export async function createCart(request: Request, env: Env): Promise<Response> {
	try {
		const result = await env.shop_db.prepare("INSERT INTO carts DEFAULT VALUES RETURNING id").first();
		return Response.json({
			success: true,
			cartId: result?.id,
		});
	} catch (e: any) {
		return Response.json({ success: false, error: e.message }, { status: 500 });
	}
}

export async function addItem(request: Request, env: Env): Promise<Response> {
	try {
		const body = (await request.json()) as any;
		const { cartId, productId, qty } = body;

		if (!cartId || !productId || !qty) {
			return Response.json({ success: false, error: "Missing required fields" }, { status: 400 });
		}

		// 1. Verificar Producto y Stock
		const product = await env.shop_db.prepare("SELECT * FROM products WHERE id = ?").bind(productId).first();
		if (!product) {
			return Response.json({ success: false, error: "Product not found" }, { status: 404 });
		}
		// @ts-ignore
		if (product.stock < qty) {
			return Response.json({ success: false, error: "Insufficient stock" }, { status: 400 });
		}

		// 2. Verificar si ya existe en el carrito
		const existingItem = await env.shop_db
			.prepare("SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?")
			.bind(cartId, productId)
			.first();

		if (existingItem) {
			// Update
			await env.shop_db
				.prepare("UPDATE cart_items SET qty = qty + ? WHERE id = ?")
				// @ts-ignore
				.bind(qty, existingItem.id)
				.run();
		} else {
			// Insert
			// @ts-ignore
			const unitPrice = product.price;
			await env.shop_db
				.prepare("INSERT INTO cart_items (cart_id, product_id, qty, unit_price) VALUES (?, ?, ?, ?)")
				.bind(cartId, productId, qty, unitPrice)
				.run();
		}

		return Response.json({ success: true, message: "Item added to cart" });
	} catch (e: any) {
		return Response.json({ success: false, error: e.message }, { status: 500 });
	}
}

export async function updateItem(request: Request, env: Env): Promise<Response> {
	try {
		const body = (await request.json()) as any;
		const { cartId, productId, qty } = body;

		if (!cartId || !productId || qty === undefined) {
			return Response.json({ success: false, error: "Missing required fields" }, { status: 400 });
		}

		if (qty <= 0) {
			// Delete item
			await env.shop_db
				.prepare("DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?")
				.bind(cartId, productId)
				.run();
			return Response.json({ success: true, message: "Item removed from cart" });
		} else {
			// Update exact quantity
			await env.shop_db
				.prepare("UPDATE cart_items SET qty = ? WHERE cart_id = ? AND product_id = ?")
				.bind(qty, cartId, productId)
				.run();
			return Response.json({ success: true, message: "Item updated" });
		}
	} catch (e: any) {
		return Response.json({ success: false, error: e.message }, { status: 500 });
	}
}

export async function getCart(request: Request, env: Env, id: string): Promise<Response> {
	try {
		// Verificar carrito
		const cart = await env.shop_db.prepare("SELECT * FROM carts WHERE id = ?").bind(id).first();
		if (!cart) {
			return Response.json({ success: false, error: "Cart not found" }, { status: 404 });
		}

		// Obtener items con detalles
		const { results } = await env.shop_db
			.prepare(
				`
        SELECT ci.id, ci.product_id, ci.qty, ci.unit_price, p.name, p.description, (ci.qty * ci.unit_price) as total_price
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.cart_id = ?
      `
			)
			.bind(id)
			.all();

		return Response.json({
			success: true,
			cart,
			items: results,
		});
	} catch (e: any) {
		return Response.json({ success: false, error: e.message }, { status: 500 });
	}
}
