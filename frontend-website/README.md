# Ashwatthama Website v2.0

> An immortal warrior awakened through modern technology.

This is the public-facing website for **Ashwatthama** — a private, local-first AI companion that lives on your computer. Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion. Designed to feel ancient, powerful, and premium.

---

## Project Overview

| Property | Value |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion |
| Icons | Lucide React |
| Auth | Firebase Authentication |
| Database | Firebase Firestore |
| Hosting | Vercel (static export) |

---

## Folder Structure

```
ashwatthama-website/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Route group: authentication pages
│   │   ├── login/
│   │   │   └── page.tsx          # Sign in page
│   │   ├── signup/
│   │   │   └── page.tsx          # Create account page
│   │   ├── reset-password/
│   │   │   └── page.tsx          # Password reset page
│   │   └── layout.tsx            # Shared auth layout
│   ├── download/
│   │   └── page.tsx              # Protected download page
│   ├── globals.css               # Global styles, design tokens, fonts
│   ├── layout.tsx                # Root layout with metadata
│   └── page.tsx                  # Landing page (assembles all sections)
├── components/
│   ├── ui/                       # Reusable UI primitives
│   │   ├── button.tsx            # Button with variants (primary, secondary, ghost)
│   │   ├── input.tsx             # Styled form input
│   │   └── section-header.tsx    # Eyebrow + title + subtitle block
│   ├── sections/                 # Landing page sections
│   │   ├── hero.tsx              # Hero: orb, ember canvas, countdown, CTAs
│   │   ├── pillars.tsx           # 4 identity pillars (Presence, Intelligence, Memory, Privacy)
│   │   ├── intro.tsx             # Product intro with terminal visual
│   │   ├── why-ashwatthama.tsx   # Philosophy section (NEW in v2)
│   │   ├── features.tsx          # 9 capability cards (benefits-only)
│   │   ├── experience.tsx        # Interactive voice demo showcase
│   │   ├── privacy.tsx           # Privacy deep-dive + stats grid
│   │   ├── faq.tsx               # Animated accordion FAQ
│   │   └── early-access.tsx      # Email capture + auth CTA
│   ├── navbar.tsx                # Fixed navbar with auth state
│   ├── footer.tsx                # Minimalist footer
│   └── ember-canvas.tsx          # Ember particle animation (Canvas 2D)
├── hooks/
│   ├── use-auth.ts               # Firebase auth state + actions
│   └── use-scroll-reveal.ts      # IntersectionObserver scroll animations
├── lib/
│   ├── firebase.ts               # Firebase client initialization
│   └── utils.ts                  # cn() utility (clsx + tailwind-merge)
├── public/                       # Static assets
├── next.config.js                # Next.js config (static export)
├── tailwind.config.ts            # Tailwind with custom theme tokens
├── tsconfig.json                 # TypeScript config
├── .env.example                  # Environment variable template
├── FIREBASE_SETUP.md             # Complete Firebase walkthrough
├── DEPLOYMENT.md                # Vercel deployment guide
└── package.json
```

---

## Design Philosophy

### Brand Identity Preservation

The v2 website evolves the existing aesthetic without replacing it:

- **Dark obsidian background** (`#0e0a07`) with subtle grain texture
- **Bone/parchment typography** (`#ece3d3`) for warmth and antiquity
- **Ember orange accents** (`#e0723a`) for energy and fire
- **Fraunces** (serif display) + **IBM Plex Mono** (technical) + **Plus Jakarta Sans** (body)
- **Sacred geometry** rings, ember particles, ambient glow gradients
- **Slow, premium animations** — nothing flashy, everything elegant

### What Changed from v1

| v1 | v2 |
|---|---|
| Single HTML file | Next.js App Router with TypeScript |
| No auth | Full Firebase Auth (login, signup, password reset) |
| Broken "Notify Me" | Working Firestore integration with validation |
| Exposed tech stack (Whisper, Ollama, etc.) | Benefits-only copy (no implementation details) |
| Roadmap section | Replaced with "Why Ashwatthama" philosophy |
| No download flow | Auth-gated download page with placeholder architecture |
| Basic responsive | Fully responsive with mobile-first design |
| Scroll reveal via vanilla JS | Framer Motion + IntersectionObserver |
| No SEO | Comprehensive metadata, Open Graph, Twitter cards |

### What Was Intentionally Removed

The following were removed to avoid exposing internal implementation:

- **Roadmap** — revealed future development plans and technologies
- **Technical tags** on feature cards (e.g., "Voice + Text", "Vision AI", "Semantic Search")
- **Specific technology names** in FAQ and Privacy (Whisper, Ollama, LLaVA, Piper, ChromaDB, etc.)
- **Developer contact section** — replaced with footer attribution
- **Internal architecture references** — no mention of Electron, FastAPI, PyInstaller, etc.

---

## Key Engineering Decisions

### 1. Static Export (Not SSR)

**Decision:** `output: "export"` in `next.config.js`

**Rationale:**
- Firebase Auth and Firestore are client-side libraries
- No server-side data fetching needed
- Static export deploys to any CDN (Vercel, Netlify, S3)
- Faster builds, zero cold starts
- Images are unoptimized (no `next/image` Image Optimization API)

**Trade-off:** No API routes in production. All data operations happen client-side via Firebase SDK.

### 2. Client-Side Firebase (No Admin SDK)

**Decision:** Use Firebase client SDK for both auth and Firestore writes

**Rationale:**
- Simplifies architecture (no backend needed for the website)
- Firestore Security Rules handle access control
- No serverless function cold starts
- Fits the static export model perfectly

**Security:** Firestore Rules enforce:
- Anyone can create an `early_access` document (with email validation)
- No one can read, update, or delete `early_access` documents (prevents data scraping)
- Authenticated users can only access their own `users` document

### 3. Framer Motion Over CSS Animations

**Decision:** Use Framer Motion for all scroll-triggered and interactive animations

**Rationale:**
- Declarative API fits React mental model
- Built-in `AnimatePresence` for mount/unmount animations (FAQ accordion)
- `useInView` hook for scroll-triggered reveals (though we use a custom `IntersectionObserver` hook for zero-dependency scroll detection)
- Hardware-accelerated transforms and opacity
- Respects `prefers-reduced-motion` automatically

### 4. Custom Hooks for Reusability

**Decision:** Extract `useAuth` and `useScrollReveal` into dedicated hooks

**Rationale:**
- `useAuth` centralizes Firebase Auth state across all components
- `useScrollReveal` provides a reusable IntersectionObserver wrapper
- Both follow React best practices (cleanup, memoization, error handling)

### 5. Placeholder Download Architecture

**Decision:** Build the download page with disabled placeholder, ready for future swap

**Rationale:**
- The `.exe` installer does not exist yet
- The auth flow, UI, and database structure are production-ready
- When the installer is ready, only one file needs modification (`app/download/page.tsx`)
- Prevents broken links while maintaining the full user journey

---

## Authentication Flow

```
Landing Page
    ↓
[User clicks "Download" or "Notify Me" → Create Account]
    ↓
/signup/ → Create account with email/password
    ↓
Auto-redirect to /download/ after successful signup
    ↓
/download/ shows placeholder + system requirements
    ↓
[Future: live download button appears when installer is ready]
```

```
Landing Page
    ↓
[User clicks "Sign In" in navbar]
    ↓
/login/ → Enter credentials
    ↓
Auto-redirect to /download/ after successful login
    ↓
/download/ shows placeholder + system requirements
```

```
Landing Page
    ↓
[User enters email in "Notify Me" form]
    ↓
Validation → Save to Firestore (early_access collection)
    ↓
Success message appears
    ↓
[Admin exports emails from Firebase Console when needed]
```

---

## Performance Targets

| Metric | Target | How |
|---|---|---|
| First Contentful Paint | < 1.5s | Static export, minimal JS |
| Largest Contentful Paint | < 2.5s | Font preconnect, optimized CSS |
| Cumulative Layout Shift | < 0.1 | Explicit dimensions, no layout shifts |
| Accessibility | 95+ | Semantic HTML, ARIA labels, focus states |
| SEO | 100 | Meta tags, Open Graph, structured headings |

---

## Environment Setup

```bash
# 1. Clone / copy the project
cd ashwatthama-website

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Fill in your Firebase config (see FIREBASE_SETUP.md)

# 5. Run dev server
npm run dev

# 6. Build for production
npm run build
```

---

## Next Steps (Post-Launch)

1. **When the installer is ready:**
   - Update `app/download/page.tsx` with the real download link
   - Add release notes and checksums

2. **Add Google OAuth:**
   - Enable Google sign-in in Firebase Console
   - Add `signInWithPopup(auth, googleProvider)` to `useAuth` hook

3. **Add email confirmation:**
   - Send custom welcome email via Firebase Extensions (Trigger Email)
   - Or use a third-party service like Resend/Postmark

4. **Add analytics (privacy-friendly):**
   - Vercel Analytics (no cookies, no personal data)
   - Or Plausible Analytics (self-hosted, GDPR-compliant)
   - Avoid Google Analytics (contradicts the privacy brand)

5. **Add a blog / changelog:**
   - `/blog/` route with MDX support
   - Share build journey, philosophy, and technical deep-dives

---

## License

Proprietary. All rights reserved. Ashwatthama is a product of Animesh Dhiman.

---

Built with fire, patience, and the belief that intelligence should serve the individual.
