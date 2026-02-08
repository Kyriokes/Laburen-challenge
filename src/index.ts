/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		// Health check simple
		if (url.pathname === "/" && request.method === "GET") {
			return new Response("MCP running OK");
		}

		// MCP: list products
		if (url.pathname === "/list_products" && request.method === "POST") {
			try {
				const { results } = await env.shop_db.prepare("SELECT * FROM products").all();
				return Response.json({
					success: true,
					products: results,
				});
			} catch (e: any) {
				return Response.json({ success: false, error: e.message }, { status: 500 });
			}
		}

		return new Response("Not Found", { status: 404 });
	},
};

