# EduPath AI: Complete Setup & Deployment Guide

---

## 📌 Summary of Changes Made (AUTOMATIC)
- **Frontend URL Config**: Updated `src/services/aiService.ts` to use `import.meta.env.VITE_API_BASE_URL` (with fallback to `VITE_API_URL` or relative `/api/ai/chat`).
- **FastAPI CORS**: Updated `backend/main.py` to support dynamic origins (`CORS_ORIGINS` environment variable) allowing requests from Vercel (`*.vercel.app`).
- **`/health` & Root Endpoints**: Added `@app.get("/")` and verified `@app.get("/health")` returning status, service name, and Gemini API key status.
- **Gemini Model Resilience**: Updated `backend/services/gemini_service.py` to use `gemini-2.5-flash` with automatic fallback to `gemini-2.0-flash` and `gemini-1.5-flash`.
- **Render Deployment Config**: Created root `Procfile`, `requirements.txt`, and `render.yaml` for 1-click Python backend deployment on Render or Railway.
- **Chat History & Supabase**: Verified `chat_sessions` and `chat_messages` schema, RLS policies, and frontend DB sync in `src/services/dbService.ts`.

---

## 🛠️ Step-by-Step Instructions

### Step 1: Configure Supabase Database
* **Type**: `MANUAL`
* **Action**:
  1. Log in to [Supabase Dashboard](https://app.supabase.com) and open your project.
  2. If you haven't created your project yet, click **New Project**, choose a name (e.g., `EduPath-AI`), set a strong database password, and wait 1 minute.

---

### Step 2: Run SQL Schema & Seed Migration
* **Type**: `MANUAL`
* **Action**:
  1. In Supabase Dashboard, click **SQL Editor** in the left sidebar $\rightarrow$ **New query**.
  2. Open `supabase/schema.sql` from your project folder, copy all contents, paste into the SQL Editor, and click **Run**.
  3. Click **New query**, open `supabase/seed.sql`, copy all contents, paste, and click **Run**.
  4. Confirm that all tables (including `profiles`, `chat_sessions`, and `chat_messages`) are created with Row Level Security (RLS) policies.

---

### Step 3: Get Supabase URL and Anon API Key
* **Type**: `MANUAL`
* **Action**:
  1. In Supabase Dashboard, click **Project Settings** (gear icon) $\rightarrow$ **API**.
  2. Copy the **Project URL** (e.g. `https://xyzcompany.supabase.co`).
  3. Copy the **`anon` `public` Key** (e.g. `eyJhbGciOi...`).

---

### Step 4: Configure Local `.env` Variables
* **Type**: `AUTOMATIC / MANUAL`
* **Action**:
  Open `.env` in your project root folder and set your credentials:
  ```env
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=your-actual-supabase-anon-key
  VITE_API_BASE_URL=http://localhost:8000
  GEMINI_API_KEY=your-actual-gemini-api-key
  ```

---

### Step 5: Get & Configure Google Gemini API Key
* **Type**: `MANUAL`
* **Action**:
  1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
  2. Click **Create API Key** and copy the key generated.
  3. Put this key **ONLY** on your backend environment (`GEMINI_API_KEY`). **Never** expose `GEMINI_API_KEY` in frontend code or Vercel public variables.

---

### Step 6: Deploy Python Backend to Render (Free)
* **Type**: `MANUAL`
* **Action**:
  1. Push your repository code to GitHub.
  2. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** $\rightarrow$ **Web Service**.
  3. Connect your GitHub repository (`EduPath-AI`).
  4. Set the build and start options:
     - **Name**: `edupath-ai-backend`
     - **Environment**: `Python 3`
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
  5. Under **Environment Variables**, add:
     - `GEMINI_API_KEY` = `your-actual-gemini-api-key`
     - `GEMINI_MODEL` = `gemini-2.5-flash`
     - `CORS_ORIGINS` = `*`
  6. Click **Create Web Service** and wait 2 minutes. Copy your Render live backend URL (e.g. `https://edupath-ai-backend.onrender.com`).

---

### Step 7: Put Backend URL in Vercel Project Settings
* **Type**: `MANUAL`
* **Action**:
  1. Open your [Vercel Dashboard](https://vercel.com/) and select `edu-path-ai`.
  2. Go to **Settings** $\rightarrow$ **Environment Variables**.
  3. Add a new variable:
     - **Key**: `VITE_API_BASE_URL`
     - **Value**: `https://edupath-ai-backend.onrender.com` (your Render URL from Step 6)
     - **Target**: Production, Preview, Development
  4. Also add your Supabase variables if not already added:
     - `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = `your-actual-supabase-anon-key`

---

### Step 8: Redeploy Vercel Frontend
* **Type**: `MANUAL`
* **Action**:
  1. In Vercel, go to **Deployments**.
  2. Click the three dots `...` next to the latest deployment and select **Redeploy**.
  3. Or simply run `git push` on your `main` branch.

---

### Step 9: Test `/health` Endpoint
* **Type**: `AUTOMATIC / MANUAL`
* **Action**:
  1. In your browser or terminal, visit:
     `https://edupath-ai-backend.onrender.com/health` (or `http://localhost:8000/health`)
  2. It must return:
     ```json
     {
       "status": "online",
       "service": "EduPath AI Backend",
       "hasGeminiKey": true,
       "modelConfigured": "gemini-2.5-flash"
     }
     ```

---

### Step 10: Test AI Tutor in Production
* **Type**: `AUTOMATIC / MANUAL`
* **Action**:
  1. Open your deployed Vercel site (`https://edupathai-nine.vercel.app`).
  2. Click on **AI Tutor** in the bottom navigation tab.
  3. Type a real query: `"Give code in c++ for leetcode problem 274"`.
  4. Verify that the AI Tutor returns the full C++ solution and explanation without showing Offline Fallback Mode.
