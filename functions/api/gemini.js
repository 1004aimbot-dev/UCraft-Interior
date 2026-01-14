export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const body = await request.text();

  const upstream =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `gemini-3-flash-preview:generateContent?key=${env.GEMINI_API_KEY}`;

  const res = await fetch(upstream, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  return new Response(res.body, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}
