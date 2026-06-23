// pages/api-docs.js — API Documentation Page
import Head from "next/head";
import Link from "next/link";

function CodeBlock({ children }) {
  return <pre style={styles.codeBlock}><code>{children}</code></pre>;
}

export default function ApiDocs() {
  return (
    <>
      <Head><title>API Docs — Soko Radar</title><meta name="viewport" content="width=device-width, initial-scale=1" /></Head>
      <div style={styles.page}>
        <header style={styles.nav}>
          <div style={styles.navInner}>
            <Link href="/" style={styles.logo}><span style={{ color: "#f59e0b" }}>●</span> Soko Radar</Link>
            <nav style={{ display: "flex", gap: 20 }}>
              <Link href="/api-docs" style={styles.navLinkActive}>API Docs</Link>
              <Link href="/api-pricing" style={styles.navLink}>Pricing</Link>
            </nav>
          </div>
        </header>
        <main style={styles.main}>
          <h1 style={styles.h1}>Soko Radar API</h1>
          <p style={styles.lead}>Access real-time Google Trends panic scores for Kenyan commodities. One endpoint, clean JSON, rate-limited by plan.</p>

          <section style={styles.section}>
            <h2 style={styles.h2}>Base URL</h2>
            <CodeBlock>https://your-domain.vercel.app/api/trends</CodeBlock>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>Authentication</h2>
            <p style={styles.p}>Every request must include your API key in the request header.</p>
            <CodeBlock>x-api-key: YOUR_API_KEY_HERE</CodeBlock>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>Endpoint: GET /api/trends</h2>
            <p style={styles.p}>Query param: <code>?commodity=</code> — one of: maize, tomatoes, fuel, onions</p>
            <CodeBlock>{`// JavaScript
const res = await fetch("https://your-domain.vercel.app/api/trends?commodity=maize", {
  headers: { "x-api-key": "YOUR_KEY" }
});
const data = await res.json();`}</CodeBlock>
            <CodeBlock>{`# cURL
curl "https://your-domain.vercel.app/api/trends?commodity=maize" \
  -H "x-api-key: YOUR_KEY"`}</CodeBlock>
          </section>

          <section style={styles.section}>
            <h2 style={styles.h2}>Example Response</h2>
            <CodeBlock>{`{
  "commodity": "maize",
  "latest_score": 87,
  "change_24h": 2.35,
  "date": "2026-06-23",
  "source": "Soko Radar",
  "quota": { "plan": "free", "requests_used": 1, "requests_limit": 1000 }
}`}</CodeBlock>
          </section>
        </main>
        <footer style={styles.footer}>© {new Date().getFullYear()} Soko Radar · <Link href="/api-pricing" style={{ color: "#3b82f6", textDecoration: "none" }}>Get API Access</Link></footer>
      </div>
    </>
  );
}

const styles = {
  page: { fontFamily: "Arial, sans-serif", background: "#f9fafb", minHeight: "100vh" },
  nav: { background: "#0f172a", padding: "0 20px", height: 52, display: "flex", alignItems: "center" },
  navInner: { maxWidth: 860, margin: "0 auto", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { color: "#fff", fontWeight: 800, fontSize: 17, textDecoration: "none" },
  navLink: { color: "#94a3b8", fontSize: 14, textDecoration: "none" },
  navLinkActive: { color: "#f59e0b", fontSize: 14, fontWeight: 700, textDecoration: "none" },
  main: { maxWidth: 860, margin: "0 auto", padding: "32px 16px 60px" },
  h1: { fontSize: 28, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" },
  lead: { color: "#475569", fontSize: 16, lineHeight: 1.6, margin: "0 0 28px" },
  section: { marginBottom: 28, background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" },
  h2: { fontSize: 17, fontWeight: 800, color: "#0f172a", margin: "0 0 14px", paddingBottom: 10, borderBottom: "1px solid #f1f5f9" },
  p: { color: "#374151", fontSize: 14, lineHeight: 1.7, margin: "0 0 12px" },
  codeBlock: { background: "#0f172a", color: "#e2e8f0", padding: "16px 18px", borderRadius: 8, fontSize: 13, lineHeight: 1.7, overflowX: "auto", margin: "0 0 12px", fontFamily: "monospace" },
  footer: { textAlign: "center", color: "#9ca3af", fontSize: 12, padding: "20px 0 30px" },
};
