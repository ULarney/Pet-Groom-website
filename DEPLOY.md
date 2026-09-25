# Pet & Groom — Deployment Guide

This project is now fully configured for a cloud architecture using **Vercel** (Frontend), **Railway/Render** (Backend), and **Supabase** (Database + Auth).

---

## Architecture Overview

* **Frontend:** React + Vite (Hosted on Vercel)
* **Backend:** Node.js + Express (Hosted on Railway or Render)
* **Database & Auth:** Supabase PostgreSQL + Supabase Auth

---

## Step 1 — Database Setup (Supabase)

1. Go to your **[Supabase Dashboard](https://supabase.com/dashboard)**.
2. Select your project: `poejtslzbtogchavlvys`.
3. Go to the **SQL Editor** tab.
4. Paste the entire content of `supabase_schema.sql` into the SQL Editor and click **Run**.
5. Your database tables (`products`, `pets`, `bookings`, `orders`, `profiles`) and Row Level Security policies are now created.

---

## Step 2 — Deploy Backend (Express.js on Railway)

1. Push your repository to GitHub.
2. Log in to [Railway.app](https://railway.app) and click **New Project** $\rightarrow$ **Deploy from GitHub repo**.
3. Select your repository and specify the **Root Directory** as `/` or `server`.
4. Set the following **Environment Variables** in Railway:
   ```env
   SUPABASE_URL=https://poejtslzbtogchavlvys.supabase.co
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   PORT=5001
   ```
5. Click **Deploy**. Railway will provide a public URL for your backend (e.g., `https://pet-groom-backend.up.railway.app`).

---

## Step 3 — Deploy Frontend (React on Vercel)

1. Log in to [Vercel.com](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repository.
3. Set the Framework Preset to **Vite**.
4. Set the following **Environment Variables** in Vercel:
   ```env
   VITE_SUPABASE_URL=https://poejtslzbtogchavlvys.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
5. Click **Deploy**. Vercel will give you your live URL (e.g. `https://pet-groom.vercel.app`).

---

## Local Development

To run the project locally with Supabase connected:

```bash
# Install dependencies (already installed)
npm install

# Start Express server & Vite frontend together
npm run dev
```

* **Frontend:** Runs at `http://localhost:5173`
* **Backend:** Runs at `http://localhost:5001`
