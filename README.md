# TemplateAI (Frontend Scaffold)

Premium AI template platform UI scaffold built with Vite + React + Tailwind.

## Setup

1. Install dependencies:

```bash
npm install
```

If you add the image editor features, install these additional frontend packages (already added to package.json):

```bash
npm install react-easy-crop browser-image-compression
```

2. Run dev server:

```bash
npm run dev
```

3. Run electron in dev (requires `npm run dev` running):

```bash
npm run electron:dev
```

## Notes
- This scaffold focuses on frontend UI and mock data only.
- Backend is a placeholder in `/backend` for future expansion.
 - Backend exposes a simple generation API and a templates endpoint.

If you want to enable real image generation via OpenAI:

1. Set `IMAGE_PROVIDER=openai` and `OPENAI_API_KEY` in `backend/.env`.
2. The backend will call OpenAI Images API to generate images from the hidden prompt.

Note: for image-to-image editing you may need a provider that supports image editing; OpenAI's image edit endpoints require different parameters. The current implementation uses OpenAI's simple generation endpoint as an example.

Backend (dev):

1. Copy `.env.example` to `backend/.env` and set `LLM_MODE=mock` for local testing or provide real API keys.

2. From project root install backend deps and run server:

```bash
cd backend
npm install express node-fetch dotenv cors
node server.js
```

3. Endpoints:
- `GET /api/templates` - returns mock templates (sourced from frontend data)
- `POST /api/generate` - accepts `{ templateId, options, image }` and returns generated image metadata (mock or provider response). The actual prompt is hidden and never returned to the client.

Security note: Do NOT commit real API keys. Use environment variables and server-side secrets vaults for production.
