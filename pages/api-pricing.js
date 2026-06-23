// pages/api-pricing.js — Pricing Page
import Head from "next/head";
import Link from "next/link";

const PLANS = [
  {
    name: "Free", price: "KES 0", period: "forever", requests: "1,000 requests / month",
    color: "#6b7280", highlight: false, cta: "Get Free Key",
    ctaHref: "mailto:hello@sokoradar.co.ke?subject=Free API Key Request",
    features: ["1,000 API calls per month", "All 4 commodities", "Latest score per commodity", "JSON response", "Community email support"],
    limitations: ["No historical data access", "No SLA guarantee"],
  },
  {
    name: "Pro", price: "KES 2,000", period: "per month", requests: "100,000 requests / month",
    color: "#3b82f6", highlight: true, cta: "Get Pro Key",
    ctaHref: "mailto:hello@sokoradar.co.ke?subject=Pro API Key Request",
    features: ["100,000 API calls per month", "All 4 commodities", "Latest + 30-day historical scores", "JSON response", "Priority email support", "Monthly usage report"],
    limitations: [],
  },
  {
    name: "Enterprise", price: "KES 20,000", period: "per month", requests: "Unlimited requests",
    color: "#8b5cf6", highlight: false, cta: "Contact Us",
    ctaHref: "mailto:hello@sokoradar.co.ke?subject=Enterprise API Inquiry",
    features: ["Unlimited API calls", "All 4 commodities", "Full historical data", "Bulk export (CSV/JSON)", "Dedicated account manager", "Custom SLA & uptime guarantee", "White-label option"],
    limitations: [],
  },
];

function PricingCard({ plan }) {
  const { name, price, period, requests, color, highlight, cta, ctaHref, features, limitations } = plan;
  return (
    <div style={{ ...styles.card, border: `2px solid ${highlight ? color : "#e5e7eb"}`, position: "relative" }}>
      {highlight && <div style={{ ...styles.popularBadge, background: color }}>Most Popular</div>}
      <div style={{ ...styles.planName, color }}>{name}</div>
      <div style={styles.price}>{price}<span style={styles.period}> / {period}</span></div>
      <div style={styles.quota}>{requests}</div>
      <div style={styles.divider} />
      <ul style={styles.featureList}>
        {features.map((f) => <li key={f} style={styles.featureItem}><span style={{ color: "#16a34a", marginRight: 8 }}>✓</span>{f}</li>)}
        {limitations.map((l) => <li key={l} style={{ ...styles.featureItem, color: "#9ca3af" }}><span style={{ color: "#d1d5db", marginRight: 8 }}>✕</span>{l}</li>)}
      </ul>
      <a href={ctaHref} style={{ ...styles.ctaButton, background: highlight ? color : "transparent", color: highlight ? "#fff" : color, border: `2px solid ${color}` }}>{cta}</a>
    </div>
  );
}

export default function ApiPricing() {
  return (
    <>
      <Head><title>API Pricing — Soko Radar</title><meta name="viewport" content="width=device-width, initial-scale=1" /></Head>
      <div style={styles.page}>
        <header style={styles.nav}>
          <div style={styles.navInner}>
            <Link href="/" style={styles.logo}><span style={{ color: "#f59e0b" }}>●</span> Soko Radar</Link>
            <nav style={{ display: "flex", gap: 20 }}>
              <Link href="/api-docs" style={styles.navLink}>API Docs</Link>
              <Link href="/api-pricing" style={styles.navLinkActive}>Pricing</Link>
            </nav>
          </div>
        </header>
        <main style={styles.main}>
          <div style={styles.hero}>
            <h1 style={styles.h1}>Simple, Transparent Pricing</h1>
            <p style={styles.lead}>Get programmatic access to Kenya commodity panic scores. Start free. Scale when you need to.</p>
          </div>
          <div style={styles.cardGrid}>{PLANS.map((plan) => <PricingCard key={plan.name} plan={plan} />)}</div>
          <p style={styles.disclaimer}>Statistical analysis only. Not purchase advice. Data: Google Trends KE. Updates 4× daily.</p>
        </main>
        <footer style={styles.footer}>© {new Date().getFullYear()} Soko Radar · Nairobi, Kenya</footer>
      </div>
    </>
  );
}

const styles = {
  page: { fontFamily: "Arial, sans-serif", background: "#f9fafb", minHeight: "100vh" },
  nav: { background: "#0f172a", padding: "0 20px", height: 52, display: "flex", alignItems: "center" },
  navInner: { maxWidth: 1100, margin: "0 auto", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { color: "#fff", fontWeight: 800, fontSize: 17, textDecoration: "none" },
  navLink: { color: "#94a3b8", fontSize: 14, textDecoration: "none" },
  navLinkActive: { color: "#f59e0b", fontSize: 14, fontWeight: 700, textDecoration: "none" },
  main: { maxWidth: 1100, margin: "0 auto", padding: "40px 16px 60px" },
  hero: { textAlign: "center", marginBottom: 44 },
  h1: { fontSize: 30, fontWeight: 800, color: "#0f172a", margin: "0 0 10px" },
  lead: { color: "#475569", fontSize: 16, lineHeight: 1.7, maxWidth: 560, margin: "0 auto" },
  cardGrid: { display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", marginBottom: 40 },
  card: { background: "#fff", borderRadius: 14, padding: "28px 24px 24px", flex: "1 1 280px", maxWidth: 340, boxShadow: "0 2px 8px rgba(0,0,0,0.07)", display: "flex", flexDirection: "column" },
  popularBadge: { position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 14px", borderRadius: 20, whiteSpace: "nowrap" },
  planName: { fontWeight: 800, fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 },
  price: { fontSize: 28, fontWeight: 800, color: "#0f172a", lineHeight: 1.1 },
  period: { fontSize: 14, fontWeight: 400, color: "#6b7280" },
  quota: { color: "#6b7280", fontSize: 13, marginTop: 6 },
  divider: { height: 1, background: "#f1f5f9", margin: "16px 0" },
  featureList: { listStyle: "none", padding: 0, margin: "0 0 20px", flex: 1 },
  featureItem: { fontSize: 13, color: "#374151", padding: "5px 0", display: "flex", alignItems: "flex-start", lineHeight: 1.5 },
  ctaButton: { display: "block", textAlign: "center", padding: "11px 0", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none", marginTop: "auto" },
  disclaimer: { textAlign: "center", color: "#9ca3af", fontSize: 11 },
  footer: { textAlign: "center", color: "#9ca3af", fontSize: 12, padding: "20px 0 30px" },
};
