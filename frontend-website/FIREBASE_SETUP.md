# Firebase Setup Guide — Ashwatthama Website

This guide walks you through setting up Firebase from zero for the Ashwatthama website. Follow every step in order.

---

## Step 1: Create a Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Create a project"**
3. Enter project name: `ashwatthama-website` (or your preferred name)
4. **Disable** Google Analytics for now (you can enable later)
5. Click **"Create project"** and wait for it to finish

---

## Step 2: Register a Web App

1. In your Firebase project dashboard, click the **"</>"** icon ("Add app" → Web)
2. Give your app a nickname: `ashwatthama-web`
3. **Check** "Also set up Firebase Hosting" (optional — we use Vercel, but this is harmless)
4. Click **"Register app"**
5. Copy the `firebaseConfig` object shown on screen. You will need these values.

---

## Step 3: Set Up Firebase Authentication

1. In the left sidebar, click **"Build" → "Authentication"**
2. Click **"Get started"**
3. Go to the **"Sign-in method"** tab
4. Enable **"Email/Password"**
   - Toggle the first switch to **Enabled**
   - Leave "Email link (passwordless sign-in)** disabled for now
   - Click **"Save"**
5. (Optional) Enable **"Google"** sign-in if you want Google OAuth later
   - You will need to configure a SHA-1 key for Android (not needed for web)
   - For web, just toggle it on and add your support email

---

## Step 4: Set Up Firestore Database

1. In the left sidebar, click **"Build" → "Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in production mode"** (recommended for security)
4. Select your region. For India, choose `asia-south1` (Mumbai). For US/EU, choose `us-central1` or `europe-west1`.
5. Click **"Enable"**

---

## Step 5: Configure Security Rules

Firestore starts with locked-down rules. You need to update them to allow:
- Anonymous reads/writes for the "early_access" collection (Notify Me feature)
- Authenticated users to read their own data
- Admin access for user management

1. In Firestore Database, click the **"Rules"** tab
2. Replace the default rules with these:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to write to early_access (Notify Me emails)
    match /early_access/{doc} {
      allow create: if request.resource.data.keys().hasAll(['email', 'createdAt', 'source'])
                    && request.resource.data.email is string
                    && request.resource.data.email.matches('^[^\s@]+@[^\s@]+\\.[^\s@]+$');
      allow read, update, delete: if false;
    }

    // Allow authenticated users to read/write their own user data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Deny all other access by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **"Publish"**

---

## Step 6: Create Environment Variables

1. In the project root, copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Fill in the values from your Firebase config (Step 2):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy... (your actual key)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ashwatthama-website.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ashwatthama-website
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ashwatthama-website.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

3. **Never commit `.env.local` to git.** It is already in `.gitignore`.

---

## Step 7: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

---

## Step 8: Test Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and verify:
- The landing page loads correctly
- The "Notify Me" form submits without errors
- Authentication pages (`/login/`, `/signup/`) load
- Creating an account works
- After signup, `/download/` is accessible

---

## Step 9: Verify Firestore Data Collection

After submitting a test email via the "Notify Me" form:

1. Go to Firebase Console → Firestore Database → Data
2. You should see a collection called `early_access`
3. Inside, a document with the submitted email and timestamp

---

## Step 10: (Optional) Export Collected Emails

To export all collected emails for your records:

1. Go to Firebase Console → Firestore Database → Data
2. Click the gear icon on the `early_access` collection
3. Or use the Firebase Admin SDK in a Node.js script:

```javascript
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require('./service-account-key.json');
initializeApp({ credential: cert(serviceAccount) });

const db = getFirestore();

async function exportEmails() {
  const snapshot = await db.collection('early_access').get();
  const emails = snapshot.docs.map(doc => ({
    email: doc.data().email,
    date: doc.data().createdAt?.toDate(),
  }));
  console.table(emails);
}

exportEmails();
```

---

## Troubleshooting

### "Firebase App is already initialized"
- This is handled automatically in `lib/firebase.ts` using `getApps().length` check.
- If you see this, ensure you are not importing `initializeApp` multiple times.

### "Permission denied" on Firestore write
- Check your Security Rules (Step 5)
- Ensure the email being submitted is a valid string
- Verify `request.resource.data` matches the expected shape

### Auth emails not arriving
- Check spam/junk folders
- Firebase Spark (free) plan has daily sending limits (~100 emails/day)
- For production, consider upgrading to Firebase Blaze (pay-as-you-go) or configuring a custom SMTP provider

### CORS errors during local development
- Next.js dev server handles CORS for local API routes
- For Firebase Auth, ensure your domain is in the authorized domains list:
  - Firebase Console → Authentication → Settings → Authorized domains
  - Add `localhost` and your production domain

---

## Next Steps

Once Firebase is working locally, proceed to `DEPLOYMENT.md` to deploy the website to production.
