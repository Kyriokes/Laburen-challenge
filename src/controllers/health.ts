
export async function healthCheck(request: Request, env: Env): Promise<Response> {
	return new Response("MCP running OK");
}
