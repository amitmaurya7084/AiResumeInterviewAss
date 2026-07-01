# Deploy Guide (Free Hosting)

Backend → Render | Frontend → Vercel | Database → MongoDB Atlas (already set up)

## 1. Push code to GitHub
- `.env` files are now git-ignored (server/.gitignore, client/.gitignore) — they will NOT be pushed.
  Use `server/.env.example` and `client/.env.example` as reference for what to fill in on Render/Vercel.
- Push the whole `AiPoweredResumeInterview` folder (client + server) to a GitHub repo.

## 2. MongoDB Atlas
- Atlas dashboard → Network Access → Add IP Address → "Allow access from anywhere" (0.0.0.0/0)
  (Render's servers use dynamic IPs, so this is required.)

## 3. Backend on Render
- render.com → New → Web Service → connect your GitHub repo
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`
- Add Environment Variables (copy values from your local `server/.env`):
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `IMAGEKIT_PRIVATE_KEY`
  - `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL`
  - `OPENROUTER_API_KEY`
  - `NODE_ENV` = `production`
  - `CLIENT_URL` = your Vercel URL (set this AFTER step 4, then redeploy)
- Deploy. Note the Render URL, e.g. `https://your-app.onrender.com`
- Render free tier sleeps after ~15 min idle — first request after sleep takes 30-50s to respond.

## 4. Frontend on Vercel
- vercel.com → New Project → import the same GitHub repo
- Root Directory: `client`
- Framework Preset: Vite
- Add Environment Variable:
  - `VITE_BASE_URL` = your Render URL from step 3
  - `VITE_FIREBASE_APIKEY` = your Firebase Web API key
- Deploy. Note the Vercel URL, e.g. `https://your-app.vercel.app`

## 5. Connect them
- Go back to Render → your backend service → Environment → set `CLIENT_URL` to your Vercel URL → manual redeploy.

## 6. Firebase (Google Sign-In for Interview Assistant)
- Firebase Console → Authentication → Settings → Authorized domains → Add your Vercel domain
  (e.g. `your-app.vercel.app`), otherwise Google Sign-In will fail with `auth/unauthorized-domain`.

## 7. Test
- Open your Vercel URL, try: Resume Builder login/signup, AI Enhance, Save resume, Interview Google login, Start Interview.
