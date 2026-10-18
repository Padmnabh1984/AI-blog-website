# Signal — AI & Technology Journal

A responsive editorial website for thoughtful perspectives on AI and technology. Stories bundled with the site are **AI-generated illustrative samples, not live news**. Configure an optional GNews API key to display current reporting on the Latest page; every live result links back to its publisher.

## Requirements

- Node.js 20.19 or newer
- npm

## Run locally

```sh
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The Vite development server proxies `/api` requests to the small Express API server on port 3001.

## Optional live news

1. Copy `.env.example` to `.env`.
2. Add a GNews API key from [gnews.io](https://gnews.io/) to `GNEWS_API_KEY`.
3. Restart the development servers.

The API key is read only by the server and is never included in the browser bundle. Without a key, Latest clearly identifies the bundled stories as illustrative samples. A feed or provider error is reported in the UI rather than presented as live news.

For a production deployment, build with `npm run build`, set `NODE_ENV=production`, configure `GNEWS_API_KEY` and `PORT` if desired, and run `npm start`. The Express server serves the built site and its API. Deploy behind HTTPS and keep the API key in the hosting provider's server-side environment settings.

## Features

- Responsive home, latest, trending, topic, article, search, bookmarks, about, and contact pages.
- Search overlay, topic filters, pagination, sharing, and bookmark controls.
- Theme preference and saved reading list persist in browser local storage.
- Optional GNews integration through an Express API route.
- Accessible navigation, focus labels, reduced-motion support, page transitions, and loading feedback.
- Newsletter and contact forms provide client-side confirmation. They do not send or store data; connect a mailing-list provider or mail backend before production use.

## Commands

```sh
npm run dev       # API server and Vite development server
npm run lint      # ESLint checks
npm run build     # Type-check and create production bundle
npm start         # Serve production bundle and API (after build)
npm run preview   # Preview the Vite production bundle
```
