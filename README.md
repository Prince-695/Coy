# Coy Discover 💖

> **"Discover someone new. Keep your interest private."**

Coy Discover is a privacy-first, swipe-based profile discovery web application built to extend Coy's crush-matching philosophy. Built with Next.js App Router, TypeScript, Tailwind CSS, Motion, and Turso/libSQL (zero ORM).

---

## 🌟 Key Features

- **Coy Visual Identity**: Authentic neo-playful design language with bold typography, dark 2px borders, hard offset shadows (`shadow-coy`), vibrant Coy pink (`#FF3880`), soft lavender (`#E7DFFF`), and playful dot patterns derived directly from Coy's design system.
- **Fluid Swipe Stack**: Powered by `Motion` (`framer-motion`) with gesture physics, drag-proportional rotation, dynamic `LIKE` and `PASS` stamp indicators, and smooth exit animations.
- **Privacy-First Matching**:
  - One-sided likes **never** leak to the client or public APIs.
  - Matches are created **only** when mutual interest exists server-side.
  - Swiped profiles (Liked or Passed) **never** reappear in the feed, enforced at the database level.
- **Match Celebration**: Instant festive modal on mutual matches with avatar connections and confetti bursts (`canvas-confetti`).
- **Profile Detail Sheet**: Expandable bottom sheet with full-resolution photo, college, city, comprehensive bio, and pastel interest chips.
- **Keyboard Shortcuts**: Desktop friendly (`ArrowRight` for Like, `ArrowLeft` for Pass, `Escape` to close modals).
- **Persistent libSQL Database**: Direct parameterized SQL queries via `@libsql/client` (no ORM overhead). Works with local SQLite (`file:local.db`) or remote Turso cloud databases.
- **Pre-seeded Demo Experience**: Preloaded with 36 diverse, high-quality profiles across major Indian cities and universities, with 12 private incoming likes to guarantee real mutual match moments.

---

## 🏗️ Architecture & Component Design

```
Coy/
├── app/
│   ├── (routes)/
│   │   ├── discover/page.tsx      # Main swipe stack & gesture interface
│   │   ├── matches/page.tsx       # Mutual matches grid & timestamps
│   │   ├── home/page.tsx          # Coy branded home placeholder screen
│   │   └── page.tsx               # Root redirect to /discover
│   ├── api/
│   │   ├── feed/route.ts          # GET: Paginated feed excluding swiped profiles
│   │   ├── swipe/route.ts         # POST: Zod-validated swipe & mutual matching
│   │   ├── matches/route.ts       # GET: Mutual matches for demo user
│   │   └── reset/route.ts         # POST: Utility endpoint to reset demo feed
│   ├── layout.tsx                 # Responsive 500px centered container shell
│   └── globals.css                # Coy design tokens, colors & offset shadows
├── components/
│   ├── discover/
│   │   ├── profile-card.tsx       # Photo, badges, bio, and interest tags
│   │   ├── swipe-stack.tsx        # Motion gesture drag engine & indicators
│   │   ├── swipe-actions.tsx      # Like, Pass, Details buttons & key bindings
│   │   ├── profile-details.tsx    # Expandable detail sheet
│   │   └── discover-empty-state.tsx # Polished empty state with feed reset
│   ├── matches/
│   │   ├── match-card.tsx         # Thumbnail, mutual heart badge & timestamps
│   │   ├── match-grid.tsx         # Responsive grid with name/city search
│   │   ├── match-celebration.tsx  # Dual avatar confetti celebration modal
│   │   └── match-empty-state.tsx  # Friendly zero-matches illustration
│   └── navigation/
│       ├── app-header.tsx         # Coy wordmark logo & status badges
│       └── bottom-nav.tsx         # Floating dock with dynamic match counter
├── lib/
│   ├── db/
│   │   ├── client.ts              # Universal @libsql/client connection
│   │   ├── schema.sql             # SQL schema (profiles, swipes, matches, incoming_likes)
│   │   ├── seed.ts                # Idempotent migration and seed script
│   │   ├── seed-data.ts           # 36 realistic mock profiles
│   │   └── queries.ts             # Direct parameterized SQL operations
│   └── validations/
│       └── swipe.ts               # Zod validation schema for swipe payloads
├── tests/
│   └── matching.test.ts           # Vitest integration test suite
└── types/
    └── index.ts                   # Unified TypeScript interfaces
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Motion** | `framer-motion` |
| **Icons** | `lucide-react` |
| **Database** | Turso / libSQL (`@libsql/client`) |
| **Query Layer** | Direct Parameterized SQL (Zero ORM) |
| **Validation** | Zod |
| **Notifications** | Sonner |
| **Effects** | Canvas Confetti |
| **Testing** | Vitest |

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Seed Database
Runs migrations and pre-populates 36 mock profiles and private incoming likes:
```bash
pnpm db:seed
```

### 3. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Automated Tests
```bash
pnpm test
```

### 5. Build for Production
```bash
pnpm build
pnpm start
```

---

## 🔐 Environment Variables

For local development, Coy Discover automatically uses a local SQLite database (`file:local.db`). For remote Turso deployment on Vercel, configure:

```env
# Optional: Turso database connection (defaults to local file:local.db)
TURSO_DATABASE_URL="libsql://your-database-name.turso.io"
TURSO_AUTH_TOKEN="your-turso-auth-token"
```

---

## 📡 API Specification

### `GET /api/feed`
Returns discovery profiles excluding any profile already swiped by the demo user.
```json
{
  "profiles": [
    {
      "id": "profile-001",
      "name": "Aarohi Patel",
      "age": 22,
      "photo": "https://images.unsplash.com/...",
      "bio": "Coffee snob, film photography enthusiast...",
      "city": "Ahmedabad",
      "college": "Adani University",
      "interests": ["Photography", "Indie Music", "Hiking"]
    }
  ],
  "hasMore": true
}
```

### `POST /api/swipe`
Records a swipe action. Evaluates mutual match server-side inside a database transaction.
```json
// Request
{
  "profileId": "profile-001",
  "action": "LIKE" // or "PASS"
}

// Response (Mutual Match)
{
  "success": true,
  "matched": true,
  "match": {
    "id": "match-1795030520998-ga349",
    "profileId": "profile-001",
    "name": "Aarohi Patel",
    "photo": "https://images.unsplash.com/..."
  },
  "alreadySwiped": false
}
```

### `GET /api/matches`
Returns all mutual matches belonging to the demo user.
```json
{
  "matches": [
    {
      "id": "match-1795030520998-ga349",
      "profileId": "profile-001",
      "name": "Aarohi Patel",
      "age": 22,
      "photo": "https://images.unsplash.com/...",
      "city": "Ahmedabad",
      "matchedAt": "2026-11-18 19:35:20"
    }
  ]
}
```

### `POST /api/reset`
Developer utility endpoint that resets swipes and matches for `demo-user-001` and re-seeds fresh data.
```json
{
  "success": true,
  "message": "Feed reset successfully."
}
```

---

## ✅ Acceptance Criteria Matrix

- [x] At least 30 mock profiles seeded (36 profiles with realistic Indian and global details).
- [x] Profiles display photo, name, age, city, college, bio, and pastel interest chips.
- [x] Drag right records a LIKE; drag left records a PASS.
- [x] Like and Pass buttons work with animated micro-interactions.
- [x] Keyboard shortcuts (`ArrowRight` / `ArrowLeft` / `Escape`) work.
- [x] Previously swiped profiles **never** reappear in the feed (enforced via database query).
- [x] Swipe data persists across reloads in `@libsql/client`.
- [x] Mutual interest creates exactly one match; one-sided interest does not create a match.
- [x] Match celebration dialog displays both avatars and confetti animation.
- [x] Matches screen lists mutual matches with search and timestamps.
- [x] Pending incoming likes remain 100% private and are never leaked to client APIs.
- [x] Fully responsive mobile-first shell (centered 500px max on desktop).
- [x] Automated test suite verifying swipe persistence, matching logic, and privacy constraints.
