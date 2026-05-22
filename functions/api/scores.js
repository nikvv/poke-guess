export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 })
  }

  if (request.method === 'GET') {
    const difficulty = url.searchParams.get('difficulty') || 'easy'
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return Response.json({ error: 'invalid difficulty' }, { status: 400 })
    }

    try {
      const { results } = await env.poke_guess.prepare(
        'SELECT player_name, score, created_at FROM scores WHERE difficulty = ? ORDER BY score DESC, created_at ASC LIMIT 3'
      ).bind(difficulty).all()

      const scores = results.map((r) => ({
        name: r.player_name,
        score: r.score,
        date: new Date(r.created_at).getTime(),
      }))

      return Response.json({ scores })
    } catch (e) {
      return Response.json({ error: 'database error' }, { status: 500 })
    }
  }

  if (request.method === 'POST') {
    if (!request.headers.get('content-type')?.includes('application/json')) {
      return Response.json({ error: 'expected application/json' }, { status: 400 })
    }

    let body
    try { body = await request.json() } catch {
      return Response.json({ error: 'invalid json' }, { status: 400 })
    }

    const { name, score, difficulty } = body

    if (typeof name !== 'string' || typeof score !== 'number' || !['easy', 'medium', 'hard'].includes(difficulty)) {
      return Response.json({ error: 'invalid payload' }, { status: 400 })
    }
    if (score <= 0 || score > 100000 || !Number.isFinite(score)) {
      return Response.json({ error: 'invalid score' }, { status: 400 })
    }

    const trimmed = name.trim().slice(0, 12) || 'PLAYER'

    try {
      await env.poke_guess.prepare(
        'INSERT INTO scores (player_name, score, difficulty) VALUES (?, ?, ?)'
      ).bind(trimmed, Math.round(score), difficulty).run()
    } catch (e) {
      return Response.json({ error: 'database error' }, { status: 500 })
    }

    return Response.json({ success: true })
  }

  return Response.json({ error: 'method not allowed' }, { status: 405 })
}
