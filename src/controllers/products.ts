
export async function listProducts(request: Request, env: Env): Promise<Response> {
	let search = "";
	try {
		const body = (await request.json()) as any;
		if (body && body.search) {
			search = body.search;
		}
	} catch (e) {
		// Body vacío o inválido, continuamos sin búsqueda
	}

	let query = "SELECT * FROM products";
	const params: any[] = [];

	if (search) {
		query += " WHERE name LIKE ? OR description LIKE ?";
		params.push(`%${search}%`);
		params.push(`%${search}%`);
	}

	// Límite por defecto para no saturar al agente
	query += " LIMIT 20";

	try {
		const { results } = await env.shop_db.prepare(query).bind(...params).all();
		return Response.json({
			success: true,
			products: results,
		});
	} catch (e: any) {
		return Response.json({ success: false, error: e.message }, { status: 500 });
	}
}

export async function getProductDetails(request: Request, env: Env): Promise<Response> {
	let productId: string | undefined;

	try {
		const body = (await request.json()) as any;
		productId = body.productId;
	} catch (e) {
		return Response.json({ success: false, error: "Invalid JSON body" }, { status: 400 });
	}

	if (!productId) {
		return Response.json({ success: false, error: "Missing productId" }, { status: 400 });
	}

	try {
		const product = await env.shop_db.prepare("SELECT * FROM products WHERE id = ?").bind(productId).first();

		if (!product) {
			return Response.json({ success: false, error: "Product not found" }, { status: 404 });
		}

		return Response.json({
			success: true,
			product,
		});
	} catch (e: any) {
		return Response.json({ success: false, error: e.message }, { status: 500 });
	}
}
