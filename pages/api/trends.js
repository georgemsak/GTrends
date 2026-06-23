// pages/api/trends.js — API endpoint with key auth + rate limiting
import { createClient } from "@supabase/supabase-js";

const VALID_COMMODITIES = ["maize", "tomatoes", "fuel", "onions"];

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed. Use GET." });

  const apiKey = req.headers["x-api-key"];
  if (!apiKey) return res.status(401).json({ error: "Missing API key. Add header: x-api-key: YOUR_KEY. Get one at /api-pricing" });

  const { commodity } = req.query;
  if (!commodity) return res.status(400).json({ error: "Missing ?commodity= param. Options: maize, tomatoes, fuel, onions" });
  if (!VALID_COMMODITIES.includes(commodity.toLowerCase())) return res.status(400).json({ error: `Unknown commodity "${commodity}". Valid options: ${VALID_COMMODITIES.join(", ")}` });

  const supabase = getSupabase();

  const { data: keyRow, error: keyError } = await supabase.from("api_keys").select("key, email, plan, requests_used, requests_limit, active").eq("key", apiKey).single();
  if (keyError || !keyRow) return res.status(401).json({ error: "Invalid API key. Get one at /api-pricing" });
  if (!keyRow.active) return res.status(401).json({ error: "Your API key has been deactivated. Contact support or visit /api-pricing" });
  if (keyRow.requests_used >= keyRow.requests_limit) return res.status(429).json({ error: `Rate limit reached. Upgrade at /api-pricing` });

  await supabase.from("api_keys").update({ requests_used: keyRow.requests_used + 1 }).eq("key", apiKey);

  const { data: trend, error: trendError } = await supabase.from("trends").select("commodity, trend_score, pct_change, date").eq("commodity", commodity.toLowerCase()).order("date", { ascending: false }).limit(1).single();
  if (trendError || !trend) return res.status(404).json({ error: `No data found for commodity: ${commodity}` });

  return res.status(200).json({
    commodity: trend.commodity,
    latest_score: trend.trend_score,
    change_24h: trend.pct_change,
    date: trend.date,
    source: "Soko Radar",
    quota: { plan: keyRow.plan, requests_used: keyRow.requests_used + 1, requests_limit: keyRow.requests_limit },
  });
}
