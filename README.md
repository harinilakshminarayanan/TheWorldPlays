# 🌍 The World Plays

> A new underground artist from somewhere unexpected — every single day.

## What it does

Every day, the site reveals one hand-curated artist from around the world — from Uzbekistan to Mauritania to Tuva — that most people have never heard of. The same artist shows for everyone on the same day. An AI-generated story accompanies each discovery. No login required.

---

## Deploy in 5 steps (free, ~10 minutes)

### Step 1 — Get your Anthropic API key
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign in or create an account
3. Click **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`) — save it somewhere safe

### Step 2 — Put the code on GitHub
1. Go to [github.com](https://github.com) → sign in or create a free account
2. Click the **+** button → **New repository**
3. Name it `the-world-plays`, keep it **Public**, click **Create repository**
4. On your computer, open a terminal in this project folder and run:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/the-world-plays.git
   git push -u origin main
   ```
   *(Replace YOUR_USERNAME with your GitHub username)*

### Step 3 — Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → **Sign up with GitHub** (free)
2. Click **Add New Project**
3. Find and select your `the-world-plays` repository → click **Import**
4. Leave all settings as default — Vercel will auto-detect it's a Vite project
5. **Before clicking Deploy**, click **Environment Variables** and add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your key from Step 1 (the `sk-ant-...` one)
6. Click **Deploy** 🚀

### Step 4 — Share your link
After ~1 minute, Vercel gives you a URL like:
```
https://the-world-plays.vercel.app
```
Share this with anyone — no login needed, works on phone and desktop.

### Step 5 — Custom domain (optional)
In Vercel → your project → **Settings** → **Domains**, you can add a custom domain like `theworldplays.com` if you buy one (~$12/year).

---

## Project structure

```
the-world-plays/
├── index.html          ← Entry HTML page
├── vite.config.js      ← Build config
├── package.json        ← Dependencies
├── vercel.json         ← Deployment config
├── src/
│   ├── main.jsx        ← React entry point
│   └── App.jsx         ← Main app (artist list + UI)
└── api/
    └── story.js        ← Serverless function (keeps API key secret)
```

## Auto-expanding artist list

The app starts with 43 hand-curated seed artists and **automatically grows itself** using AI:

- On every page load, it checks if the total artist count is below **150**
- If so, it calls Claude in the background to generate **25 new underground artists**, avoiding any already in the list
- New artists are saved to the visitor's **browser localStorage**, so the list accumulates over visits
- The footer shows a live count and a "✦ discovering more…" indicator while expansion is happening
- Once the list reaches 150+, expansion stops (preventing runaway API costs)

Because storage is per-browser, different visitors build up lists independently. The seed 43 are always guaranteed for everyone.

## How the daily artist works

The algorithm uses today's date as a number (e.g. `20260424`) and takes the remainder when divided by the total number of artists. This means:
- Everyone sees the same artist on the same day
- It changes automatically at midnight
- No database or server needed

## Adding more artists

Open `src/App.jsx` and add entries to the `ARTISTS` array at the top:
```js
{ 
  name: "Artist Name", 
  country: "Country", 
  flag: "🇽🇽", 
  genre: "Genre description",
  youtubeId: "VIDEO_ID_FROM_URL",  // from youtube.com/watch?v=VIDEO_ID
  youtubeSearch: "search terms for YouTube"
}
```

## Running locally (for development)

```bash
npm install
npm run dev
```
Then open [http://localhost:5173](http://localhost:5173)

You'll need a `.env` file for local development:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

---

Built with React + Vite + Vercel + Anthropic API
