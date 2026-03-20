# Organo – Farm-to-Bottle Juice Platform

## 1) Project Overview

Organo is a production-focused, farm-to-bottle commerce platform that combines fresh juice fulfillment with AI-driven personalization. It delivers:

- **AI Advisor** that recommends goal-based juice plans (energy, detox, recovery) via GemaniAPI.
- **Farm-to-bottle provenance** with real-time product, stock, and benefit data.
- **Subscription crates** (6-slot configurable) with pause/resume/cancel controls.
- **Hyperlocal vs national delivery** based on ZIP serviceability and ETA logic.

## 2) Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind, React Router, Axios-based service layer.
- **Backend:** Node.js, Express, TypeScript, Prisma, JWT auth, bcrypt, CORS, dotenv.
- **Database:** PostgreSQL managed via Prisma schema/migrations.
- **AI & External APIs:** GemaniAPI for recommendations, Google Places API for nearby services (gyms/hospitals).

## 3) Architecture Overview

- **Client** (SPA) calls a **REST API** (`/api/*`) through a centralized Axios service layer.
- **API Layer** (Express) handles auth, products, cart, orders, subscriptions, AI, delivery, and demand reporting.
- **Services/Controllers** encapsulate business logic; **Prisma ORM** abstracts PostgreSQL.
- **External Integrations:** GemaniAPI (AI advisor), Google Places (nearby services), ZIP serviceability rules.
- **Auth**: JWT bearer tokens; role-based (user/admin) middleware.

## 4) Features Breakdown

- **AI Advisor:** Consumes GemaniAPI with deterministic prompts; stores recommendations (`AIRecommendation` table) and returns structured schedules (morning/afternoon/evening).
- **Subscription System:** 6-slot crate builder; create/list/update (pause/resume)/cancel; auto next-delivery calculation.
- **Delivery Engine:** ZIP-based serviceability with local vs national delivery types and ETA responses; ZipCodeService table for fast lookups.
- **Demand Prediction:** Aggregates past orders, product popularity, and subscriptions to output demand level, waste risk, and suggested sourcing quantities.
- **Commerce Core:** JWT auth (signup/login/me), product catalog with filters (category/tags/benefits), DB-backed cart, order checkout with stock validation and status enum (pending/shipped/delivered).

## 5) Setup Instructions

```bash
# 1) Clone
git clone <repo-url> organo && cd organo

# 2) Install deps (frontend + backend in one workspace)
npm install

# 3) Environment variables
cp api/.env.example api/.env || true
cp .env.example .env || true   # create if not present
```

Required env keys (backend `api/.env`):

```ini
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/organo
PORT=4000
JWT_SECRET=replace-me
GEMANI_API_KEY=your_gemani_key
GOOGLE_PLACES_API_KEY=your_google_key
CLIENT_URL=http://localhost:5173
```

Frontend (`.env`):

```ini
VITE_API_URL=http://localhost:4000
```

```bash
# 4) Prisma
cd api
npm run prisma:generate
npm run prisma:migrate   # creates dev DB schema
cd ..

# 5) Run
npm run dev:api   # backend on 4000
npm run dev       # frontend on 5173

# 6) Production build
npm run build:api && npm run build
```

## 6) Folder Structure (high level)

```text
/api
  /src
    /controllers    # route handlers
    /routes         # express routers
    /services       # business logic (auth/cart/orders/ai/etc)
    /middlewares    # auth, error handling
    /utils          # helpers
    server.ts       # app bootstrap
  prisma/schema.prisma
/src
  /features         # auth, products, cart, orders, subscriptions, ai, wishlist
  /components       # shared UI (cards, layout, home, cart)
  /pages            # routed views
  /services         # axios clients (auth/product/cart/order/ai)
  /hooks            # e.g., useProducts
  /types /utils /constants
```

## 7) API Documentation (essentials)

- **Auth**
  - `POST /api/auth/signup` – name, email, password → JWT + user
  - `POST /api/auth/login` – email, password → JWT + user
  - `GET /api/auth/me` – current user (JWT required)
- **Products**
  - `GET /api/products` – filters: `category`, `tags`, `benefits`
  - `GET /api/products/:id`
- **Cart** (JWT)
  - `GET /api/cart`
  - `POST /api/cart/add` { productId, quantity }
  - `POST /api/cart/update` { productId, quantity }
  - `POST /api/cart/remove` { productId }
- **Orders** (JWT)
  - `POST /api/orders/create` – creates order from cart, calculates total, ETA, clears cart
  - `GET /api/orders`
  - `GET /api/orders/:id`
- **Subscriptions** (JWT)
  - `POST /api/subscriptions`
  - `GET /api/subscriptions`
  - `PATCH /api/subscriptions/:id` – pause/resume/update items
  - `DELETE /api/subscriptions/:id`
- **Delivery**
  - `GET /api/delivery/check?zip=XXXXX` → `{ isServiceable, type: local|national, eta }`
- **AI Advisor**
  - `POST /api/ai/advisor` – { goal, timeOfDay, preferences } → structured recommendation + DB save
- **Demand Report**
  - `GET /api/ai/demand-report` – demand level, waste risk, sourcing suggestions
- **Nearby Services**
  - `GET /api/nearby?lat=..&lng=..&type=gym|hospital` – Google Places cached results

## 8) Future Improvements

- Add request-level rate limiting and audit logging.
- Introduce background jobs (BullMQ) for order confirmations and subscription reminders.
- Move media to object storage (S3/GCS) with signed URLs.
- Add E2E tests (Playwright) and contract tests for APIs.
- Implement incremental static regeneration/SSR for SEO-critical pages.
- Fine-tune chunking (manualChunks) and image CDN for faster first paint.

## 9) Screenshots

Replace placeholders with real captures:

- `![Home](docs/screenshots/home.png)`
- `![Product Details](docs/screenshots/product-details.png)`
- `![AI Advisor](docs/screenshots/ai-advisor.png)`
- `![Dashboard](docs/screenshots/dashboard.png)`
