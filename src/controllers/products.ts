
export async function listProducts(request: Request, env: Env): Promise<Response> {
	return Response.json({ message: "TODO: listProducts" });
}

export async function getProductDetails(request: Request, env: Env, id: string): Promise<Response> {
	return Response.json({ message: `TODO: getProductDetails for ${id}` });
}
