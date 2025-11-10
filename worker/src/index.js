export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		const corsHeaders = {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		};

		if (request.method === "OPTIONS") {
			return new Response(null, { headers: corsHeaders });
		}



		if (url.pathname === "/api/ping" && request.method === "GET") {
			return new Response("Pong!", { status: 200 });
		}

		if (url.pathname === "/api/create-blog" && request.method === "POST") {
			await initDatabase(env.open_blogs)

			const { title, author, content } = await request.json();

			const result = await env.open_blogs.prepare("INSERT INTO blogs (title, author, content, date) VALUES (?, ?, ?, ?)")
				.bind(title, author, content, new Date().toISOString())
				.run()

			return jsonResponse({ status: "ok", id: result.meta.last_row_id });
		}

		if (url.pathname === "/api/all-blogs" && request.method === "GET") {
			await initDatabase(env.open_blogs)

			const rows = await env.open_blogs.prepare("SELECT id, title, author, content, date FROM blogs ORDER BY date DESC")
				.all()

			return jsonResponse(rows.results)
		}

		if (url.pathname === "/api/blog" && request.method === "GET") {
			await initDatabase(env.open_blogs)

			const blogId = new URL(request.url).searchParams.get("id");
			const row = await env.open_blogs.prepare("SELECT id, title, author, content, date FROM blogs WHERE id = ?")
				.bind(blogId)
				.first()


			if (!row) {
				return new Response("Blog id doesn't exist", { status: "404" })
			}

			return jsonResponse(row)
		}

		return new Response('Not Found', { status: 404 });
	},
};

function jsonResponse(data, status = 200) {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
		},
	});
}

async function initDatabase(db) {
	await db.prepare(`
    CREATE TABLE IF NOT EXISTS blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      content TEXT NOT NULL,
      date TEXT NOT NULL
    )
  `).run();
}