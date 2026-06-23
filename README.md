# Soko Radar — Kenya Commodity Panic Index

A TradingView-style dashboard showing real-time Google Trends panic scores for Kenyan commodities.

## What it does
- Shows a live ticker tape for: Maize (MAHINDI), Tomatoes (NYANYA), Fuel (DIESEL), Onions (VITUNGUU)
- Displays a 14-day trend line chart with scores from 0–100
- Exposes a developer API at `/api/trends` with key-based auth and rate limiting

## Tech Stack
- **Next.js 14** (Pages Router)
- **Supabase** (PostgreSQL database)
- **Recharts** (charts)
- **Vercel** (deployment)

## Pages
| Route | Description |
|---|---|
| `/` | Main dashboard — ticker + chart |
| `/api/trends` | REST API endpoint |
| `/api-docs` | Developer documentation |
| `/api-pricing` | Pricing plans (Free / Pro / Enterprise) |

## Quick Start

1. Clone this repo
2. Run `npm install`
3. Copy `.env.local.example` to `.env.local` and fill in your Supabase keys
4. Run the SQL in `supabase-schema.sql` in your Supabase SQL Editor
5. Run `npm run dev` and open [http://localhost:3000](http://localhost:3000)

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
```

## Disclaimer
Statistical analysis only. Not purchase advice. Data: Google Trends KE. Updates 4× daily.
