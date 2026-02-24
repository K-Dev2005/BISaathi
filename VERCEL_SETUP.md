# Vercel Deployment Setup Guide

## 🚨 Critical Issues Fixed
Your authentication is failing because environment variables aren't configured on Vercel. Here's how to fix it:

---

## ✅ Server Setup (bisaathi-server)

### Step 1: Go to Vercel Dashboard
1. Navigate to your server project on Vercel
2. Go to **Settings** → **Environment Variables**
3. Add the following variables:

| Variable | Value | Where to find |
|----------|-------|---------------|
| `SUPABASE_URL` | `https://avznwltpfolomodgtjec.supabase.co` | Supabase Settings → API |
| `SUPABASE_SERVICE_KEY` | [YOUR_SERVICE_ROLE_KEY] | **IMPORTANT: Use SERVICE_ROLE_KEY, not PUBLISHABLE** |
| `JWT_SECRET` | `supersecretbiskey` | Keep same as local or change to something more secure |
| `JWT_EXPIRES_IN` | `7d` | Keep same |
| `ADMIN_EMAIL` | `admin@bis.gov.in` | Keep same |
| `ADMIN_PASSWORD` | `admin123` | Change this in production! |
| `CLIENT_URL` | Your client deployment URL | e.g., `https://bis-saathi.vercel.app` |

### ⚠️ CRITICAL: Get Your SERVICE_ROLE_KEY
Your current `.env` uses a PUBLISHABLE key which has limited permissions. You need:

1. Go to [Supabase Dashboard](https://supabase.com)
2. Select your project
3. **Settings** → **API** 
4. Copy **"service_role" (Secret)** - NOT the "anon" public key
5. Paste it in Vercel as `SUPABASE_SERVICE_KEY`

**Why?** Publishable keys have Row-Level Security restrictions. Service keys bypass them for backend operations.

---

## ✅ Client Setup (bisaathi-client)

### Step 1: Go to Vercel Dashboard
1. Navigate to your client project on Vercel
2. Go to **Settings** → **Environment Variables**
3. Add this variable:

| Variable | Value |
|----------|-------|
| `VITE_API_BASE_URL` | `https://your-server-url.vercel.app` |

Example: If your server is deployed at `https://bis-saathi-server.vercel.app`, use:
```
VITE_API_BASE_URL=https://bis-saathi-server.vercel.app
```

---

## 🔐 Security Warning
⚠️ **NEVER commit `.env` files to Git!** Your Supabase keys are exposed.

Add to `.gitignore`:
```
.env
.env.local
.env.*.local
```

---

## 🧪 Test the Fix

After setting environment variables:

1. **Redeploy both projects** on Vercel (push to GitHub or manually redeploy)
2. Go to your live client URL
3. Try **Register** → Check browser DevTools (F12)
4. Check **Network** tab → Click the failed request → Check error message
5. Send me the error message if it still fails

---

## 📋 Checklist

- [ ] SERVICE_ROLE_KEY obtained from Supabase
- [ ] All 7 env vars set on Server project in Vercel
- [ ] VITE_API_BASE_URL set on Client project in Vercel
- [ ] Both projects redeployed
- [ ] Tested registration/login on live site
- [ ] Verified no CORS errors in browser console

---

## 💡 If Still Failing
If auth still fails after this, check:
1. **Browser Console (F12)** → Network tab → See exact error
2. **Supabase Console** → Check if `users` table has data (registration should create entries)
3. **Vercel Logs** → Go to Deployments → Click latest → Logs

Send me the exact error message and we'll debug further!
