# Ashwatthama Website

Public-facing website and backend API for **Ashwatthama** — a private, local-first AI companion.

## Structure

```
Website/
├── frontend-website/   # Next.js 14 (TypeScript, Tailwind, Framer Motion) — deployed on Vercel
└── backend-deploy/     # FastAPI backend — auth, download/installer delivery, email
```

See each folder's own README for setup and environment variable details:
- [`frontend-website/README.md`](frontend-website/README.md)
- [`frontend-website/DEPLOYMENT.md`](frontend-website/DEPLOYMENT.md)
- [`frontend-website/FIREBASE_SETUP.md`](frontend-website/FIREBASE_SETUP.md)

## Local setup

**Frontend**
```bash
cd frontend-website
npm install
cp .env.example .env.local   # fill in Firebase + API config
npm run dev
```

**Backend**
```bash
cd backend-deploy
python -m venv venv
source venv/bin/activate     # or venv\Scripts\activate on Windows
pip install -r requirements.txt
# create a .env with the required variables (see config.py)
uvicorn main_public:app --reload
```

## Notes

- Neither `.env` file is committed — copy the example/config and fill in your own values.
- `venv-public/`, `node_modules/`, and build output (`.next/`, `dist/`) are gitignored.
