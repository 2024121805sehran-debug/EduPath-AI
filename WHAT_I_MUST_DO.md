# EduPath AI: Complete Setup & Deployment Guide

---

## 📌 Summary of Changes Made (AUTOMATIC)
- **Vercel Python Backend Integration**: Added `api/index.py` and configured `vercel.json` rewrites so Vercel automatically hosts BOTH the React Frontend and FastAPI Backend natively on the exact same domain (`https://edupathai-nine.vercel.app/api/ai/chat`). **No external Render server required!**
- **Frontend URL Config**: Updated `src/services/aiService.ts` to use `import.meta.env.VITE_API_BASE_URL` (with automatic fallback to relative `/api/ai/chat` served directly by Vercel).
- **FastAPI CORS**: Updated `backend/main.py` to support dynamic origins (`CORS_ORIGINS` environment variable) allowing requests from Vercel (`*.vercel.app`).
- **`/health` & Root Endpoints**: Added `@app.get("/")` and verified `@app.get("/health")` returning status, service name, and Gemini API key status.
- **Gemini Model Resilience**: Updated `backend/services/gemini_service.py` to use `gemini-2.5-flash` with automatic fallback to `gemini-2.0-flash` and `gemini-1.5-flash`.
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

### Step 4: Get & Add `GEMINI_API_KEY` to Vercel
* **Type**: `MANUAL`
* **Action**:
  1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and click **Create API Key**.
  2. Go to your [Vercel Dashboard](https://vercel.com/) $\rightarrow$ Select `edu-path-ai` $\rightarrow$ **Settings** $\rightarrow$ **Environment Variables**.
  3. Add the following environment variables:
     - `GEMINI_API_KEY` = `your-actual-gemini-api-key`
     - `GEMINI_MODEL` = `gemini-2.5-flash`
     - `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = `your-actual-supabase-anon-key`
  4. Save the environment variables.

---

### Step 5: Redeploy Vercel
* **Type**: `MANUAL`
* **Action**:
  1. In Vercel Dashboard, go to **Deployments**.
  2. Click the three dots `...` next to the latest deployment and select **Redeploy**.
  3. Vercel will build both your Vite React frontend AND your Python serverless backend (`/api/ai/chat` & `/health`).

---

### Step 6: Test `/health` Endpoint
* **Type**: `AUTOMATIC / MANUAL`
* **Action**:
  1. In your browser, visit:
     `https://edupathai-nine.vercel.app/health`
  2. It will return:
     ```json
     {
       "status": "online",
       "service": "EduPath AI Backend",
       "hasGeminiKey": true,
       "modelConfigured": "gemini-2.5-flash"
     }
     ```

---

### Step 7: Test AI Tutor in Production
* **Type**: `AUTOMATIC / MANUAL`
* **Action**:
  1. Open your deployed Vercel site (`https://edupathai-nine.vercel.app`).
  2. Click on **AI Tutor** in the bottom navigation tab.
  3. Type a real query: `"Give code in c++ for leetcode problem 274"`.
  4. Verify that the AI Tutor returns the full C++ solution and explanation live from Gemini API!
