# 🚀 Deployment Guide (Vercel)

Follow these steps to deploy **AI Learning Platform** to the web using Vercel.

## 1. Prerequisites
- A **GitHub** account (where this repository is hosted).
- A **Vercel** account (Sign up at [vercel.com](https://vercel.com)).
- Your **Supabase** project ready.

## 2. Deploy to Vercel

1. **Log in** to your Vercel Dashboard.
2. Click **Add New...** -> **Project**.
3. In the list of GitHub repositories, find `ai-learning-platform` and click **Import**.
   - *If you don't see it, click "Adjust GitHub App Permissions" to grant Vercel access to your repo.*
4. **Configure Project:**
   - **Framework Preset:** Next.js (Should be automatic).
   - **Root Directory:** `./` (Default).
5. **Environment Variables (CRITICAL):**
   Expand the "Environment Variables" section. You need to copy compliance values from your local `.env.local` file:

   | Key | Value Description |
   | :--- | :--- |
   | `NEXT_PUBLIC_SUPABASE_URL` | Check your `.env.local` or Supabase Settings > API |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Check your `.env.local` or Supabase Settings > API |
   | `GEMINI_API_KEY` | Your Google Gemini API Key |

   *Do not include `DATABASE_URL` unless you are using Prisma (this project uses Supabase JS client).*

6. Click **Deploy**.
   - Vercel will build your project. This takes about 1-2 minutes.
   - If successful, you will see a "Congratulations!" screen with your live URL (e.g., `https://ai-learning-platform-xyz.vercel.app`).

## 3. Post-Deployment Setup (Supabase Auth)

**IMPORTANT:** After deployment, Google Auth or Magic Link login might fail if you don't whitelist your new Vercel domain in Supabase.

1. Copy your new Vercel Domain (e.g., `https://ai-learning-platform-xyz.vercel.app`).
2. Go to your **Supabase Dashboard** > **Authentication** > **URL Configuration**.
3. In **Site URL**, you can keep `http://localhost:3000` or change it to your production URL.
4. In **Redirect URLs** (Redirect Allow List), click **Add URL** and paste your Vercel domain.
   - Example: `https://ai-learning-platform-xyz.vercel.app/**`
   - *Tip: Add `/**` at the end to allow all subpaths.*
5. Click **Save**.

## 4. Troubleshooting

- **Build Failures?** Check the logs in Vercel. Ensure you didn't include `eslint` errors (we fixed them locally).
- **Environment Variables Missing?** If the app loads but shows "Database Error", you likely forgot to add the Environment Variables in Step 5. Go to Vercel Project Settings > Environment Variables to add them, then **Redeploy**.

---

**That's it! Your AI Learning Platform is now live.** 🌍
