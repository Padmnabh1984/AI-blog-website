import 'dotenv/config'
import express from 'express'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const app = express()
const port = Number(process.env.PORT ?? 3001)
const apiKey = process.env.GNEWS_API_KEY

app.get('/api/news', async (_request, response) => {
  if (!apiKey) {
    response.json({ available: false, articles: [] })
    return
  }

  try {
    const params = new URLSearchParams({
      q: 'artificial intelligence OR machine learning OR robotics',
      lang: 'en',
      max: '10',
      sortby: 'publishedAt',
      apikey: apiKey,
    })
    const newsResponse = await fetch(`https://gnews.io/api/v4/search?${params}`)
    if (!newsResponse.ok) {
      response.status(newsResponse.status).json({ error: 'The news provider could not complete the request.' })
      return
    }
    const data = await newsResponse.json() as { articles?: Array<Record<string, unknown>> }
    response.json({ available: true, articles: data.articles ?? [] })
  } catch (error) {
    console.error('News provider request failed:', error)
    response.status(502).json({ error: 'Unable to retrieve current news right now.' })
  }
})

if (process.env.NODE_ENV === 'production') {
  const here = path.dirname(fileURLToPath(import.meta.url))
  const dist = path.resolve(here, '..', 'dist')
  app.use(express.static(dist))
  app.get('*', (_request, response) => response.sendFile(path.join(dist, 'index.html')))
}

app.listen(port, () => {
  console.log(`Signal API server listening on http://localhost:${port}`)
})
