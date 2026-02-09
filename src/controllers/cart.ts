
export async function createCart(request: Request, env: Env): Promise<Response> {
	return Response.json({ message: "TODO: createCart" });
}

export async function addItem(request: Request, env: Env): Promise<Response> {
	return Response.json({ message: "TODO: addItem" });
}

export async function updateItem(request: Request, env: Env): Promise<Response> {
	return Response.json({ message: "TODO: updateItem" });
}

export async function getCart(request: Request, env: Env, id: string): Promise<Response> {
	return Response.json({ message: `TODO: getCart for ${id}` });
}
