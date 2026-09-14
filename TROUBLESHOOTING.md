# EduPath AI Troubleshooting Guide

This guide covers solutions to common setup, authentication, database, and AI backend issues.

---

## 🔍 Issue 1: Supabase "Invalid API Key" or Network Errors

### Symptoms:
- Error message: `invalid claim: missing sub claim` or `invalid API key`.
- Supabase queries fail silently or return empty arrays.

### Solution:
1. Verify that your `.env` file contains valid credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
2. Make sure you used the **`anon` `public` key** and NOT the `service_role` secret key.
3. Restart the Vite development server after editing `.env`:
   ```bash
   npm run dev
   ```

---

## 🔒 Issue 2: Row Level Security (RLS) Policy Blocking Access

### Symptoms:
- Insert or Update statements fail with `new row violates row-level security policy`.

### Solution:
1. Open Supabase Dashboard -> **SQL Editor**.
2. Ensure you executed the entire `supabase/schema.sql` file.
3. Verify that the `handle_new_user` trigger is installed so user profiles are created automatically upon signup:
   ```sql
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO public.profiles (id, full_name, email)
     VALUES (
       new.id,
       COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
       new.email
     )
     ON CONFLICT (id) DO NOTHING;
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;
   ```

---

## 🤖 Issue 3: AI Tutor Connection Failure (`http://localhost:8000/api/ai/chat`)

### Symptoms:
- AI Tutor message returns: `EduPath AI is temporarily unavailable. Error: Failed to fetch`.
- FastAPI server is not responding.

### Solution:
1. Ensure the Python FastAPI server is running:
   ```bash
   python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```
2. Verify that your `GEMINI_API_KEY` is set in `.env`:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```
3. Test backend health directly in your browser or curl:
   ```bash
   curl http://localhost:8000/health
   # Expected response: {"status":"healthy","service":"EduPath AI Gemini Backend"}
   ```

---

## ⚠️ Issue 4: Port Already in Use (Port 8000 or 5173)

### Symptoms:
- `[Errno 10048] error while attempting to bind on address ('0.0.0.0', 8000)` or Vite defaults to port 5174.

### Solution:
1. Kill existing processes on port 8000 (Windows PowerShell):
   ```powershell
   Stop-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess -Force
   ```
2. Restart FastAPI server:
   ```bash
   python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

---

## ❌ Issue 5: Seed Script Errors (`supabase/seed.sql`)

### Symptoms:
- Foreign key constraint error when running `seed.sql`.

### Solution:
1. Ensure `supabase/schema.sql` was executed **BEFORE** running `supabase/seed.sql`.
2. `schema.sql` creates tables like `courses`, `subjects`, `units`, and `topics` with appropriate foreign key relationships required by `seed.sql`.

---

## 💡 Fallback Demo Mode

If you encounter any persistent database configuration issues during local testing, EduPath AI features an **Automatic Fallback Mode**:
- If `VITE_SUPABASE_URL` is unconfigured, EduPath AI operates in local offline demo mode seamlessly without crashing.
