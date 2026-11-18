# PRD — Coy Discover

**Product:** Coy Discover  
**Version:** 1.0  
**Platform:** Responsive Web Application  
**Framework:** Next.js (App Router)  
**Language:** TypeScript  
**Status:** Ready for Development

---

# 1. Product Overview

## 1.1 Objective

Build a standalone Discover application that extends Coy's existing privacy-first crush-matching experience with a swipe-based profile discovery system.

Users should be able to discover new people, view their profiles, express interest through swipe gestures, and establish connections when both users mutually like each other.

The application must maintain Coy's existing visual identity, design language, and privacy principles.

The application will be developed independently because access to Coy's original codebase is unavailable.

## 1.2 Product Vision

**"Discover someone new. Keep your interest private."**

Coy Discover introduces a modern, intuitive discovery experience while preserving the privacy-first philosophy of the original Coy application.

## 1.3 Product Goals

1. Build a beautiful, intuitive, mobile-first discovery experience.
2. Enable users to discover profiles through swipe interactions.
3. Implement reliable mutual matching functionality.
4. Ensure previously swiped profiles never reappear.
5. Persist all user interactions across page reloads.
6. Maintain strict privacy around one-sided likes.
7. Reproduce Coy's existing visual identity throughout the application.

## 1.4 Out of Scope

The following features are excluded from V1:

- Real user authentication.
- Phone OTP and email verification.
- Chat or messaging functionality.
- Payment and subscription integration.
- Real-time notifications.
- Integration with Coy's production backend.
- Multiple authenticated users.
- Admin dashboard.

The application will operate using a single predefined demo user.

---

# 2. Technology Stack

Use the following technologies throughout the project.

| Layer | Technology |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | Shadcn UI |
| Animation | Motion (formerly Framer Motion) |
| Icons | Lucide React |
| Database | Turso / libSQL |
| Database Client | @libsql/client |
| Validation | Zod |
| Notifications | Sonner |
| Testing | Vitest + Playwright |
| Deployment | Vercel |

**Important technical constraints:**

- Do NOT use Prisma.
- Do NOT use Drizzle.
- Do NOT introduce an ORM.
- Use direct parameterized SQL queries through `@libsql/client`.
- Use Next.js Route Handlers for backend APIs.
- Keep database operations and business logic server-side.
- Use React Server Components wherever appropriate.
- Use Client Components only where interactivity is necessary.

---

# 3. Design System and Visual Identity

The supplied Coy application screenshots are the primary visual reference.

The Discover application must look and feel like a natural extension of the original Coy application.

Do not create an unrelated dating application design.

## 3.1 Brand Identity

Maintain the following characteristics:

- Minimalist and playful visual language.
- White backgrounds.
- Bold dark typography.
- Bright pink primary accents.
- Lavender and pastel secondary surfaces.
- Rounded buttons and containers.
- Dark outlines.
- Hard offset shadows on selected components.
- Spacious layouts.
- Minimal iconography.

Avoid excessive gradients, glassmorphism, neon colors, and generic dating-app aesthetics.

## 3.2 Color Palette

Use these initial design tokens:

| Token | Hex | Usage |
|---|---|---|
| Background | #FFFFFF | Main background |
| Primary | #FF3880 | Primary actions and accents |
| Foreground | #1D1B23 | Text and borders |
| Lavender | #E7DFFF | Secondary backgrounds |
| Peach | #FFE0D0 | Supporting accents |
| Soft Pink | #FFE1EC | Interest indicators |
| Surface | #F5F3F9 | Cards and containers |
| Yellow | #FFE15B | Secondary accents |
| Muted | #777381 | Supporting text |

Treat these values as initial approximations based on the supplied screenshots. Keep them centralized in CSS variables so they can be adjusted easily.

## 3.3 Typography

Use Geist Sans or Inter.

Typography guidelines:

- Large, bold, expressive headings.
- Compact heading line heights.
- Readable body text.
- Semibold buttons.
- Clear hierarchy between headings, descriptions, and metadata.

## 3.4 Component Styling

- Primary buttons should be pill-shaped.
- Important cards should use dark outlines.
- Selected components should use offset dark shadows.
- Surface containers should use soft lavender-gray backgrounds.
- Maintain consistent border radii.
- Use subtle hover and active states.
- Keep layouts spacious and uncluttered.

---

# 4. Application Architecture

## 4.1 Navigation

Implement a persistent navigation system containing three tabs:

| Tab | Functionality |
|---|---|
| Home | Placeholder screen |
| Discover | Main discovery experience |
| Matches | Mutual matches |

Discover should be the default active tab.

The Home screen must remain intentionally blank except for a simple placeholder message.

## 4.2 Responsive Behaviour

### Mobile

- Mobile-first layout.
- Full-width application experience.
- Fixed bottom navigation.
- Profile cards occupy most of the available vertical space.
- Touch-based drag gestures.
- Accessible action buttons.
- No horizontal overflow.

### Desktop

- Centered discovery experience.
- Maximum content width approximately 480–560px.
- Profile card centered within the available space.
- Visible Like and Pass buttons.
- Keyboard shortcuts.
- Responsive navigation.

---

# 5. Core Module: Discover

This is the primary feature of the application.

## 5.1 Profile Data

Seed at least 30–40 mock profiles.

Each profile must contain:

| Field | Type | Description |
|---|---|---|
| id | string | Unique identifier |
| name | string | Display name |
| age | number | Age, minimum 18 |
| photo | string | Profile photograph |
| bio | string | Short introduction |
| city | string | Current location |
| college | string | Optional institution |
| interests | string[] | User interests |

Additional incoming-like information should exist only in server-side seed data or an internal matching data source. It must never be exposed through public profile APIs.

Use realistic profile information and high-quality, appropriately licensed photographs.

## 5.2 Profile Card

Create a visually attractive profile card.

The card must display:

1. Large profile photograph.
2. Name and age.
3. City or college.
4. Short biography.
5. Interest tags.
6. Profile details expansion interaction.
7. Like and Pass actions.

### Visual requirements

- Photography should be the dominant element.
- Use rounded corners consistent with Coy.
- Maintain clear text contrast.
- Use subtle overlays where necessary.
- Interest tags should use soft pastel backgrounds.
- Avoid overcrowding the card.

## 5.3 Swipe Experience

Implement an interactive swipe-card stack.

| Interaction | Action |
|---|---|
| Swipe right | Like profile |
| Swipe left | Pass profile |
| Heart button | Like profile |
| Cross button | Pass profile |
| Drag card | Rotate according to drag direction |
| Swipe completion | Persist interaction |
| Next profile | Animate card transition |

### Animation requirements

Use Motion for:

- Drag gestures.
- Spring animations.
- Card rotation.
- Swipe exit transitions.
- Card-stack positioning.
- Like and Pass indicators.
- Button interactions.

The swipe experience should feel smooth, responsive, and natural.

Display a pink LIKE indicator when dragging right and a subtle PASS indicator when dragging left.

Avoid unnecessarily exaggerated animations.

### Keyboard interactions

Support:

- Arrow Right: Like.
- Arrow Left: Pass.
- Escape: Close profile details or modal when applicable.

Keyboard interactions must not interfere with text inputs or other focused controls.

## 5.4 Swipe Persistence

A profile that has already received a Like or Pass action must never appear again in the Discover feed.

This restriction must be enforced by the backend.

Do not rely exclusively on React state or local component filtering.

The backend must exclude previously swiped profiles from subsequent feed requests.

---

# 6. Core Module: Matching

## 6.1 Matching Logic

A match occurs only when both users have expressed interest in each other.

Example:

- Profile A likes the demo user.
- Demo user likes Profile A.
- The backend identifies mutual interest.
- A match record is created.
- The frontend displays the match celebration.

If only one person likes the other, no match is created.

Passing must never create a match.

## 6.2 Match Celebration

When a mutual match occurs, display a dedicated match screen or modal.

It must include:

- Both profile photographs.
- A prominent "It's a match!" heading.
- A playful heart animation.
- A button to view matches.
- An option to continue discovering.

The celebration must follow Coy's pink, lavender, white, and dark visual identity.

Chat functionality is not required.

## 6.3 Matches Screen

The Matches tab must display all mutual matches.

Each match card must contain:

- Profile photograph.
- Name.
- Age.
- City.
- Match timestamp.

Use a responsive grid or list depending on screen size.

Provide a polished empty state when there are no matches.

**Critical privacy requirement:** The Matches API must only return mutual matches. Incoming one-sided likes must never be exposed.

---

# 7. Database Architecture

Use Turso/libSQL with direct SQL queries.

Do not introduce Prisma, Drizzle, or any other ORM.

## 7.1 Database Tables

### Profiles

Stores the seeded discovery profiles.

Fields:

- id
- name
- age
- photo
- bio
- city
- college
- interests

### Swipes

Stores user interactions.

Fields:

- id
- from_user_id
- to_profile_id
- action (LIKE/PASS)
- created_at

Add a unique constraint on:

`(from_user_id, to_profile_id)`

This prevents duplicate swipe records.

### Matches

Stores mutual matches.

Fields:

- id
- user_id
- profile_id
- created_at

Add a unique constraint on:

`(user_id, profile_id)`

## 7.2 Demo User

Use one fixed demo user:

```ts
export const DEMO_USER = {
  id: "demo-user-001",
  name: "Prince",
};
```

This is a demonstration identity only and must not be treated as real authentication.

## 7.3 Incoming Likes

Preseed approximately 8–10 profiles that have already liked the demo user.

These incoming likes should be stored in a server-side mock data source.

They should not be exposed in:

- Feed responses.
- Profile responses.
- Frontend state.
- Public API responses.

Only the matching service should be able to inspect this information.

## 7.4 Database Operations

Create a small database abstraction using direct parameterized SQL.

Use transactions for operations involving swipe persistence and match creation.

The implementation must be compatible with Vercel serverless deployment.

Do not depend on local filesystem persistence for production data.

---

# 8. Backend API Specification

Implement the following three API endpoints.

## 8.1 GET /api/feed

Purpose: Return profiles that the demo user has not previously swiped on.

Response:

```json
{
  "profiles": [
    {
      "id": "profile-001",
      "name": "Aarohi",
      "age": 22,
      "photo": "/profiles/aarohi.jpg",
      "bio": "Coffee, music and mountains.",
      "city": "Ahmedabad",
      "college": "Adani University",
      "interests": ["Music", "Travel", "Reading"]
    }
  ],
  "hasMore": true
}
```

Requirements:

- Exclude previously liked profiles.
- Exclude previously passed profiles.
- Never expose incoming-like status.
- Return an empty collection when no profiles remain.
- Validate pagination parameters if pagination is implemented.

## 8.2 POST /api/swipe

Purpose: Record a Like or Pass action and determine whether it creates a mutual match.

Request:

```json
{
  "profileId": "profile-001",
  "action": "LIKE"
}
```

Possible actions:

- LIKE
- PASS

Successful response without a match:

```json
{
  "success": true,
  "matched": false,
  "match": null
}
```

Successful response with a match:

```json
{
  "success": true,
  "matched": true,
  "match": {
    "id": "match-001",
    "profileId": "profile-001"
  }
}
```

Requirements:

- Validate profile ID.
- Validate action.
- Prevent duplicate swipes.
- Persist the swipe.
- Determine mutual interest on the server.
- Create a match only when mutual interest exists.
- Prevent duplicate match creation.
- Return a clear error for invalid or repeated requests.
- Never expose pending incoming likes.

## 8.3 GET /api/matches

Purpose: Return all mutual matches belonging to the demo user.

Response:

```json
{
  "matches": [
    {
      "id": "match-001",
      "name": "Aarohi",
      "age": 22,
      "photo": "/profiles/aarohi.jpg",
      "city": "Ahmedabad",
      "matchedAt": "2026-11-19T10:00:00Z"
    }
  ]
}
```

Requirements:

- Return only mutual matches.
- Do not include pending likes.
- Return an empty collection if no matches exist.

---

# 9. Frontend State Management

Use React state and hooks for local interactions.

If shared state becomes necessary, use Zustand.

Requirements:

- Maintain the current profile.
- Maintain the visible swipe stack.
- Prevent multiple simultaneous swipe submissions.
- Update the UI after successful API responses.
- Handle loading and error states.
- Refresh feed data when appropriate.
- Never optimistically display a match before the backend confirms it.

The backend remains the source of truth for swipe and matching state.

---

# 10. Seed Data

Create 30–40 mock profiles.

Requirements:

- Every profile must be at least 18 years old.
- Use realistic names, biographies and interests.
- Include different cities and colleges.
- Use high-quality local or appropriately licensed images.
- Preseed 8–10 incoming likes.
- Ensure at least 3 mutual matches can be demonstrated through normal swipe interactions.
- Keep incoming-like information private.

Create an idempotent seed script that can be executed repeatedly without generating duplicate records.

---

# 11. Suggested Project Structure

```text
coy-discover/
│
├── public/
│   ├── profiles/
│   └── illustrations/
│
├── src/
│   ├── app/
│   │   ├── (main)/
│   │   │   ├── home/
│   │   │   │   └── page.tsx
│   │   │   ├── discover/
│   │   │   │   └── page.tsx
│   │   │   └── matches/
│   │   │       └── page.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── feed/
│   │   │   │   └── route.ts
│   │   │   ├── swipe/
│   │   │   │   └── route.ts
│   │   │   └── matches/
│   │   │       └── route.ts
│   │   │
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── navigation/
│   │   ├── discover/
│   │   │   ├── profile-card.tsx
│   │   │   ├── swipe-stack.tsx
│   │   │   ├── swipe-actions.tsx
│   │   │   ├── profile-details.tsx
│   │   │   └── discover-empty-state.tsx
│   │   │
│   │   ├── matches/
│   │   │   ├── match-card.tsx
│   │   │   ├── match-grid.tsx
│   │   │   └── match-celebration.tsx
│   │   │
│   │   └── ui/
│   │
│   ├── hooks/
│   ├── lib/
│   │   ├── db/
│   │   │   ├── client.ts
│   │   │   ├── schema.sql
│   │   │   ├── seed.ts
│   │   │   └── queries.ts
│   │   ├── matching/
│   │   │   └── matching-service.ts
│   │   └── validations/
│   │       └── swipe.ts
│   │
│   ├── types/
│   └── data/
│
├── tests/
├── README.md
└── package.json
```

The structure may be adjusted when necessary, but maintain clear separation between UI components, API handlers, database operations, validation, and business logic.

---

# 12. Implementation Phases

Development must follow the phases below.

**IMPORTANT: After completing each phase, STOP and request approval before proceeding to the next phase. Do not automatically continue.**

## Phase 1 — Project Foundation and Design System

Tasks:

- Initialize Next.js App Router with TypeScript.
- Configure Tailwind CSS.
- Install and configure Shadcn UI.
- Install Motion and Lucide React.
- Establish Coy design tokens.
- Configure typography.
- Build the responsive application shell.
- Implement navigation.
- Create Home, Discover and Matches routes.
- Build the Home placeholder.

Deliverable: Complete application foundation and consistent design system.

Stop for review.

## Phase 2 — Discovery Frontend

Tasks:

- Create profile card component.
- Implement profile photography.
- Implement name, age, location, biography and interests.
- Build interactive swipe stack.
- Implement drag gestures using Motion.
- Implement Like and Pass buttons.
- Add swipe indicators.
- Implement card transition animations.
- Add profile detail expansion.
- Implement desktop keyboard shortcuts.
- Build loading and empty states.
- Test responsive layouts.

Use temporary mock data for this phase.

Deliverable: Fully interactive Discover frontend.

Stop for review.

## Phase 3 — Backend and Database

Tasks:

- Configure Turso/libSQL.
- Create database tables.
- Implement database client.
- Implement parameterized queries.
- Build idempotent seed script.
- Seed 30–40 profiles.
- Seed incoming likes.
- Implement GET /api/feed.
- Implement POST /api/swipe.
- Implement GET /api/matches.
- Implement transactional matching logic.
- Add Zod validation.
- Test all API endpoints.

Deliverable: Fully functional backend.

Stop for review.

## Phase 4 — Frontend and Backend Integration

Tasks:

- Connect Discover to GET /api/feed.
- Connect swipe actions to POST /api/swipe.
- Persist swipe state.
- Implement mutual match detection.
- Create match celebration UI.
- Connect Matches screen to GET /api/matches.
- Implement loading and error handling.
- Handle repeated requests.
- Ensure frontend and backend states remain consistent.

Deliverable: Fully integrated application.

Stop for review.

## Phase 5 — Testing, Optimization and Deployment

Tasks:

- Test all swipe scenarios.
- Test mutual matching.
- Test privacy requirements.
- Test persistence across refreshes.
- Test empty feed.
- Test duplicate swipe prevention.
- Test duplicate match prevention.
- Test mobile gestures.
- Test desktop interactions.
- Test API validation.
- Optimize images and animations.
- Verify responsive layouts.
- Prepare README.
- Document environment variables.
- Deploy on Vercel.
- Verify the production deployment.

Deliverable: Publicly accessible, fully functional application and GitHub repository.

Stop for final review.

---

# 13. Testing and Acceptance Criteria

The application will be considered complete only when all the following requirements are satisfied.

## Functional Testing

- [ ] At least 30 mock profiles are seeded.
- [ ] Profiles display all required information.
- [ ] Right swipe records a Like.
- [ ] Left swipe records a Pass.
- [ ] Like and Pass buttons work.
- [ ] Swipe animations work correctly.
- [ ] Previously swiped profiles never reappear.
- [ ] Swipe data persists after refresh.
- [ ] Mutual interest creates exactly one match.
- [ ] One-sided interest does not create a match.
- [ ] Pass actions never create matches.
- [ ] Match celebration appears after a successful match.
- [ ] Matches screen displays mutual matches.
- [ ] Pending incoming likes remain private.
- [ ] Empty feed state works correctly.
- [ ] All three API endpoints work.

## UI Testing

- [ ] Coy visual identity is maintained.
- [ ] Responsive mobile layout works.
- [ ] Desktop layout works.
- [ ] Bottom navigation works.
- [ ] Profile cards render correctly.
- [ ] Buttons have appropriate interaction states.
- [ ] Animations are smooth.
- [ ] Loading states are present.
- [ ] Empty states are polished.
- [ ] No horizontal overflow exists.

## Backend Testing

- [ ] API request validation works.
- [ ] Invalid profile IDs are rejected.
- [ ] Invalid actions are rejected.
- [ ] Duplicate swipes are prevented.
- [ ] Duplicate matches are prevented.
- [ ] Matching logic executes server-side.
- [ ] Database transactions work correctly.
- [ ] No incoming-like information leaks through APIs.
- [ ] Data survives application reloads and redeployments.

---

# 14. Engineering Guidelines

The development agent must follow these principles:

1. Write clean, maintainable TypeScript.
2. Avoid unnecessary abstractions.
3. Prefer reusable components.
4. Maintain strict separation between frontend and backend.
5. Never duplicate business logic across components.
6. Keep database operations server-side.
7. Use parameterized SQL queries.
8. Validate all external inputs.
9. Use accessible HTML and keyboard interactions.
10. Avoid unnecessary dependencies.
11. Do not introduce features outside the defined scope without approval.
12. Do not use placeholder functionality for required features.
13. Do not claim a feature is complete without testing it.
14. Preserve existing working functionality when modifying components.
15. Keep the implementation simple, reliable and production-conscious.

---

# 15. Final Deliverables

The completed project must include:

1. Public GitHub repository.
2. Complete Next.js application source code.
3. Responsive Discover experience.
4. Working swipe interactions.
5. Persistent backend and database.
6. Mutual matching functionality.
7. Matches screen.
8. At least 30 seeded mock profiles.
9. API implementations.
10. Testing suite.
11. README with installation instructions.
12. Environment variable documentation.
13. Public Vercel deployment URL.

---

# 16. Definition of Success

Coy Discover should feel like a natural extension of the existing Coy application.

The experience must be visually polished, intuitive, responsive, and technically reliable.

The primary focus is not simply implementing a swipe interface. It is delivering a complete discovery and mutual-matching experience while preserving Coy's privacy-first philosophy.

**Final principle: Great design, reliable engineering, and privacy by default.**