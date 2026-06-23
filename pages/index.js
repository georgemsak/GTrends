// pages/index.js — Soko Radar Main Dashboard
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { createClient } from "@supabase/supabase-js";
import Head from "next/head";

const COMMODITIES = {
  maize:    { label: "MAHINDI",  color: "#f59e0b" },
  tomatoes: { label: "NYANYA",   color: "#ef4444" },
  fuel:     { label: "DIESEL",   color: "#3b82f6" },
  onions:   { label: "VITUNGUU", color: "#8b5cf6" },
};

function TickerCard({ commodity, score, pctChange }) {
  const { label, color } = COMMODITIES[commodity] || {};
  const isUp = pctChange >= 0;
  return (
    <div style={styles.tickerCard}>
      <div style={{ ...styles.tickerBar, background: color }} />
      <div style={styles.tickerContent}>
        <span style={{ ...styles.tickerLabel, color }}>{label}</span>
        <span style={styles.tickerScore}>{score ?? "—"}</span>
        <span style={{ color: isUp ? "#16a34a" : "#dc2626", fontSize: 13, fontWeight: 600 }}>
          {isUp ? "▲" : "▼"} {Math.abs(pctChange ?? 0).toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={styles.tooltip}>
      <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 13 }}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ margin: "2px 0", color: entry.color, fontSize: 12 }}>
          {COMMODITIES[entry.dataKey]?.label ?? entry.dataKey}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export default function Home({ chartData, latestTicker, error }) {
  const hasData = chartData && chartData.length > 0;
  return (
    <>
      <Head>
        <title>Soko Radar — Kenya Commodity Panic Index</title>
        <meta name="description" content="Real-time Google Trends panic scores for Kenyan commodities" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div style={styles.page}>
        <header style={styles.nav}>
          <div style={styles.navInner}>
            <span style={styles.logo}><span style={styles.logoDot}>●</span> Soko Radar</span>
            <span style={styles.navTag}>KENYA · LIVE</span>
          </div>
        </header>

        <div style={styles.tickerWrapper}>
          <div style={styles.tickerStrip}>
            {Object.keys(COMMODITIES).map((key) => {
              const row = latestTicker?.[key];
              return <TickerCard key={key} commodity={key} score={row?.trend_score} pctChange={row?.pct_change} />;
            })}
          </div>
        </div>

        <main style={styles.main}>
          <div style={styles.chartHeader}>
            <h1 style={styles.chartTitle}>Soko Radar — Panic Index KE</h1>
            <p style={styles.chartSubtitle}>Google search intensity 0–100. % = change vs yesterday.</p>
          </div>
          <div style={styles.card}>
            {error && <p style={{ color: "#ef4444", marginBottom: 12 }}>⚠ Data error: {error}</p>}
            {!hasData ? (
              <div style={styles.emptyState}>
                <p style={{ fontSize: 18, fontWeight: 700 }}>No data yet</p>
                <p style={{ color: "#6b7280", marginTop: 6 }}>Trend scores will appear here once your Supabase <code>trends</code> table has rows.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={380}>
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#6b7280" }} tickLine={false} axisLine={false} width={32} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend formatter={(value) => COMMODITIES[value]?.label ?? value} wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
                  {Object.entries(COMMODITIES).map(([key, { color }]) => (
                    <Line key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={3} dot={false} activeDot={{ r: 5 }} connectNulls />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          <p style={styles.disclaimer}>Statistical analysis only. Not purchase advice. Data: Google Trends KE. Updates 4× daily.</p>
          <div style={styles.apiCta}>
            <span style={{ color: "#6b7280", fontSize: 13 }}>Build with this data →</span>
            <a href="/api-docs" style={styles.ctaLink}>API Docs</a>
            <a href="/api-pricing" style={styles.ctaLink}>Pricing</a>
          </div>
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const today = new Date();
  const fourteenDaysAgo = new Date(today);
  fourteenDaysAgo.setDate(today.getDate() - 14);
  const fromDate = fourteenDaysAgo.toISOString().split("T")[0];

  try {
    const { data: rows, error: chartError } = await supabase
      .from("trends").select("date, commodity, trend_score").gte("date", fromDate).order("date", { ascending: true });
    if (chartError) throw new Error(chartError.message);

    const dateMap = {};
    (rows || []).forEach(({ date, commodity, trend_score }) => {
      const label = date.slice(5);
      if (!dateMap[label]) dateMap[label] = { date: label };
      dateMap[label][commodity] = trend_score;
    });

    const tickerResults = await Promise.all(
      Object.keys(COMMODITIES).map((commodity) =>
        supabase.from("trends").select("commodity, trend_score, pct_change").eq("commodity", commodity).order("date", { ascending: false }).limit(1).single()
      )
    );
    const latestTicker = {};
    tickerResults.forEach(({ data }) => { if (data) latestTicker[data.commodity] = data; });

    return { props: { chartData: Object.values(dateMap), latestTicker } };
  } catch (err) {
    console.error("[SokoRadar] Supabase error:", err.message);
    return { props: { chartData: [], latestTicker: {}, error: err.message } };
  }
}

const styles = {
  page: { fontFamily: "Arial, sans-serif", background: "#f9fafb", minHeight: "100vh" },
  nav: { background: "#0f172a", padding: "0 20px", height: 52, display: "flex", alignItems: "center" },
  navInner: { maxWidth: 1100, margin: "0 auto", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px" },
  logoDot: { color: "#f59e0b", marginRight: 4 },
  navTag: { color: "#94a3b8", fontSize: 11, fontWeight: 600, letterSpacing: 1.5 },
  tickerWrapper: { background: "#1e293b", borderBottom: "1px solid #334155", overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "none" },
  tickerStrip: { display: "flex", gap: 0, minWidth: "max-content", padding: "0 12px" },
  tickerCard: { display: "flex", alignItems: "stretch", padding: "10px 20px 10px 0", marginRight: 8, borderRight: "1px solid #334155" },
  tickerBar: { width: 3, borderRadius: 2, marginRight: 10, flexShrink: 0 },
  tickerContent: { display: "flex", flexDirection: "column", gap: 2 },
  tickerLabel: { fontSize: 10, fontWeight: 700, letterSpacing: 1.2 },
  tickerScore: { color: "#f1f5f9", fontSize: 22, fontWeight: 800, lineHeight: 1 },
  main: { maxWidth: 1100, margin: "0 auto", padding: "28px 16px 40px" },
  chartHeader: { marginBottom: 16 },
  chartTitle: { fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0 },
  chartSubtitle: { color: "#6b7280", fontSize: 13, margin: "4px 0 0" },
  card: { background: "#fff", borderRadius: 12, padding: "24px 16px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.07)" },
  emptyState: { textAlign: "center", padding: "60px 20px", color: "#374151" },
  tooltip: { background: "#1e293b", border: "none", borderRadius: 8, padding: "10px 14px", color: "#f1f5f9", fontSize: 13, boxShadow: "0 4px 16px rgba(0,0,0,0.3)" },
  disclaimer: { marginTop: 16, color: "#9ca3af", fontSize: 11, textAlign: "center" },
  apiCta: { display: "flex", gap: 12, justifyContent: "center", alignItems: "center", marginTop: 20 },
  ctaLink: { color: "#3b82f6", fontWeight: 600, fontSize: 13, textDecoration: "none", padding: "4px 10px", border: "1px solid #bfdbfe", borderRadius: 6 },
};
