# Supabase Setup Guide for EduPath AI

This step-by-step guide will walk you through setting up Supabase as the production backend for **EduPath AI**.

---

## 📋 Prerequisites
- A free account on [Supabase](https://supabase.com).
- EduPath AI codebase installed and running locally.

---

## 🚀 Step 1: Create a New Supabase Project

1. Log into your [Supabase Dashboard](https://app.supabase.com).
2. Click **New Project**.
3. Select your organization and provide:
   - **Name**: `EduPath-AI` (or any preferred name)
   - **Database Password**: Choose a strong password and save it securely.
   - **Region**: Choose the region closest to your users.
4. Click **Create new project** and wait 1-2 minutes for project initialization.

---

## 🔑 Step 2: Get API Keys & Configure Environment Variables

1. In your Supabase Project Dashboard, go to **Project Settings** (gear icon at the bottom left) -> **API**.
2. Copy the following values:
   - **Project URL** (e.g. `https://xyzcompany.supabase.co`)
   - **`anon` `public` API Key** (e.g. `eyJhbGciOi...`)

3. Open the `.env` file in the root directory of your `AI_Collegecourseapp` project and set:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
VITE_API_URL=http://localhost:8000
```

> **Note**: EduPath AI includes an automatic fallback mode. If these values are left empty or set to placeholder text, the app seamlessly runs in local demo mode so you can test features instantly.

---

## 🗄️ Step 3: Create Database Tables & RLS Policies (Schema)

1. In your Supabase Dashboard, click on **SQL Editor** from the left navigation bar.
2. Click **New query**.
3. Open the file `supabase/schema.sql` from your local project repository and copy its entire content.
4. Paste the SQL into the Supabase SQL Editor.
5. Click **Run** (or press `Ctrl + Enter`).
6. Confirm that all tables, foreign keys, triggers, and Row Level Security (RLS) policies are created successfully without errors.

---

## 🌱 Step 4: Seed Initial Data (Curriculum, Quizzes & Coding Problems)

1. In the Supabase Dashboard SQL Editor, click **New query**.
2. Open the file `supabase/seed.sql` from your local project repository and copy its entire content.
3. Paste the SQL into the Supabase SQL Editor.
4. Click **Run**.
5. This populates your database with:
   - B.Tech CSE (AI & ML) Courses & Subjects
   - Units, Topics & Learning Resources
   - Interactive Quizzes & Assessment Questions
   - Coding Practice Problems across multiple categories
   - Gamification Achievements & Badges

---

## 🔐 Step 5: Configure Supabase Authentication

1. Go to **Authentication** -> **Providers** in the Supabase Dashboard.
2. Ensure **Email** provider is **Enabled**.
3. Under Email settings:
   - (Optional for Dev): Disable "Confirm email" if you want instant login without clicking confirmation emails in development.

---

## ✅ Step 6: Verify Database Connection

1. Start your local dev server:
   ```bash
   npm run dev
   ```
2. Navigate to `http://localhost:5173/auth` in your browser.
3. Sign up with a test email and password.
4. Verify in Supabase Dashboard under **Table Editor** -> **`profiles`** that a profile row was automatically created for your new user.

Congratulations! Your EduPath AI backend is fully setup with Supabase.
