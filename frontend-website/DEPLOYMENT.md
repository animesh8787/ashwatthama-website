# Deployment Guide — Ashwatthama Website

This guide covers building and deploying the Ashwatthama website to Vercel.

---

## Prerequisites

- Node.js 18+ installed
- A Vercel account (free tier is sufficient)
- Firebase project configured (see `FIREBASE_SETUP.md`)
- Domain name configured (optional — `ashwatthama.dev`)

---

## Step 1: Build the Project

```bash
npm install
npm run build
```

This creates a static export in the `dist/` directory (configured in `next.config.js`).

---

## Step 2: Deploy to Vercel

### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally if you haven't already
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

During deployment:
- Vercel will detect Next.js automatically
- Set your environment variables when prompted (or add them in the dashboard later)
- Your site will be live at `https://your-project.vercel.app`

### Option B: GitHub Integration (Recommended for CI/CD)

1. Push your code to a GitHub repository
2. Go to [https://vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Vercel auto-detects Next.js
5. Add your environment variables in the Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`
6. Click **"Deploy"**
7. Every push to `main` will auto-deploy

---

## Step 3: Add Custom Domain

1. In Vercel dashboard, go to **"Domains"**
2. Add your domain: `ashwatthama.dev`
3. Vercel will provide DNS records (A record or CNAME)
4. Go to your domain registrar (Namecheap) and add the records
5. Wait for DNS propagation (usually 5-30 minutes)
6. Vercel will auto-provision an SSL certificate

---

## Step 4: Update Firebase Authorized Domains

After your domain is live:

1. Go to Firebase Console → Authentication → Settings → Authorized domains
2. Add your production domain: `ashwatthama.dev`
3. Add `www.ashwatthama.dev` if you use the `www` variant
4. Keep `localhost` for local development

---

## Step 5: Verify Production Build

Test these flows on the live site:

1. **Landing page** loads correctly with all animations
2. **Notify Me** form submits and data appears in Firestore
3. **Sign Up** creates a new user in Firebase Authentication
4. **Login** redirects authenticated users to `/download/`
5. **Password Reset** sends an email
6. **Download page** is inaccessible without login (redirects to `/login/`)

---

## Step 6: SEO & Performance Verification

Run these checks on your deployed site:

```bash
# Lighthouse (Chrome DevTools → Lighthouse tab)
# Target scores:
# - Performance: 90+
# - Accessibility: 95+
# - Best Practices: 95+
# - SEO: 100

# PageSpeed Insights
https://pagespeed.web.dev/
```

Recommended optimizations:
- Enable Vercel Analytics (Settings → Analytics)
- Consider Vercel Speed Insights for Core Web Vitals tracking
- Use `next/image` with a CDN for future image assets (currently using `unoptimized` for static export)

---

## Step 7: Future-Ready Download Architecture

When the `.exe` installer is ready:

1. Upload the installer to Firebase Storage (or GitHub Releases)
2. In `app/download/page.tsx`, replace the placeholder:

```tsx
// BEFORE (placeholder):
<Button variant="primary" disabled className="opacity-50">
  Download Ashwatthama v1.0.0
</Button>

// AFTER (live download):
<a href="https://storage.googleapis.com/your-bucket/Ashwatthama-Setup-1.0.0.exe" download>
  <Button variant="primary">
    <Download size={14} />
    Download Ashwatthama v1.0.0
  </Button>
</a>
```

3. Add version tracking in Firestore:
   - Create a `releases` collection with download URLs, version numbers, and checksums
   - Display the latest version dynamically on the download page

4. For analytics, track downloads by logging events to Firestore:
   - `downloads` collection with user ID, timestamp, and version

---

## Rollback Strategy

If a deployment breaks:

1. Vercel dashboard → Deployments
2. Find the last working deployment
3. Click the three dots → **"Promote to Production"**
4. Your site is restored in seconds

---

## Environment Variables Summary

| Variable | Source | Required |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Console → Project Settings → Web App | Yes |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Same as above | Yes |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Same as above | Yes |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Same as above | Yes |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Same as above | Yes |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Same as above | Yes |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Same as above | Optional |

---

## Support

- Firebase docs: [https://firebase.google.com/docs](https://firebase.google.com/docs)
- Vercel docs: [https://vercel.com/docs](https://vercel.com/docs)
- Next.js static export: [https://nextjs.org/docs/pages/building-your-application/deploying/static-exports](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports)
