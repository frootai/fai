import React from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import styles from "./index.module.css";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
interface Tier {
  label: string;
  price: string;
  color: string;
  features: string[];
  cta: { text: string; href: string };
  highlight?: boolean;
}

const tiers: Tier[] = [
  {
    label: "Community",
    price: "Free",
    color: "#10b981",
    features: [
      "20 Solution Plays (open-source)",
      "MCP Server (npm) — 16 tools",
      "VS Code Extension",
      "GitHub Agentic OS templates",
      "Community Discord support",
      "Public workshop materials",
    ],
    cta: { text: "Get Started Free →", href: "/setup-guide" },
  },
  {
    label: "Enterprise",
    price: "Coming Soon",
    color: "#7c3aed",
    highlight: true,
    features: [
      "Everything in Community",
      "Dedicated CSA support engineer",
      "Custom Solution Play development",
      "99.9 % SLA on MCP Server hosting",
      "Priority bug fixes & feature requests",
      "Private Slack / Teams channel",
      "On-site / virtual training workshops",
      "Certification exam vouchers (5 included)",
      "SSO + Managed Identity onboarding",
      "Quarterly business review & roadmap input",
    ],
    cta: { text: "Contact Sales →", href: "https://www.linkedin.com/in/pavleenbali/" },
  },
];

const certSections = [
  { icon: "📖", title: "Study", detail: "Self-paced modules covering all 20 solution plays, MCP architecture, and the FROOT knowledge taxonomy." },
  { icon: "🧪", title: "Lab", detail: "Hands-on lab deploying a RAG pipeline, configuring .github Agentic OS, and running evaluations." },
  { icon: "📝", title: "Exam", detail: "60-minute proctored exam — 50 questions, 80 % pass rate. Covers architecture, best practices, and troubleshooting." },
  { icon: "🏅", title: "Badge", detail: "Credly digital badge + LinkedIn certification. Valid for 2 years, renewal via continuing education." },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function EnterprisePage(): JSX.Element {
  return (
    <Layout title="Open Source Community & FAI Learn Hub — FrootAI" description="FrootAI is open source, free forever. Come build the community. FAI Learn Hub for certification.">
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>🌱 Open Source Community</h1>
          <p style={{ fontSize: "0.95rem", color: "var(--ifm-color-emphasis-500)", maxWidth: "640px", margin: "0 auto" }}>
            Come build the community. Empower each other. Be the open glue for infrastructure, platform, and application teams.
          </p>
          <p style={{ fontSize: "0.85rem", color: "#00C853", fontWeight: 600, marginTop: "8px" }}>
            Open Source · Free Forever · MIT License · Built by the community, for the community.
          </p>
        </div>

        {/* ── Plans ── */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "20px", textAlign: "center" }}>🌱 Open Source — Free for Everyone</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
            {tiers.map((t) => (
              <div
                key={t.label}
                className={styles.glowCard}
                style={{
                  "--glow-color": t.color,
                  padding: "32px 28px",
                  borderRadius: "16px",
                  border: `2px solid color-mix(in srgb, ${t.color} ${t.highlight ? "40%" : "20%"}, transparent)`,
                  background: `color-mix(in srgb, ${t.color} ${t.highlight ? "5%" : "2%"}, transparent)`,
                  display: "flex",
                  flexDirection: "column",
                } as React.CSSProperties}
              >
                {t.highlight && (
                  <span style={{
                    alignSelf: "flex-start",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: "8px",
                    background: `color-mix(in srgb, ${t.color} 15%, transparent)`,
                    color: t.color,
                    border: `1px solid color-mix(in srgb, ${t.color} 30%, transparent)`,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "12px",
                  }}>
                    Recommended
                  </span>
                )}
                <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "4px" }}>{t.label}</h3>
                <div style={{ fontSize: "1.6rem", fontWeight: 800, color: t.color, marginBottom: "16px" }}>{t.price}</div>
                <ul style={{ fontSize: "0.82rem", lineHeight: 1.9, paddingLeft: "18px", flex: 1 }}>
                  {t.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <Link
                    href={t.cta.href}
                    className={styles.glowPill}
                    style={{ "--pill-color": t.color, display: "inline-block" } as React.CSSProperties}
                  >
                    {t.cta.text}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Enterprise Support Details ── */}
        <section style={{ marginBottom: "56px", padding: "28px", borderRadius: "16px", border: "1px solid var(--ifm-color-emphasis-200)", background: "rgba(124,58,237,0.02)" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "16px" }}>🛡️ Enterprise Support Tier</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
            {[
              { icon: "👤", title: "Dedicated CSA", detail: "Named support engineer who knows your architecture and can resolve issues same-day." },
              { icon: "🎯", title: "Custom Plays", detail: "We build bespoke solution plays tailored to your tech stack and business requirements." },
              { icon: "📊", title: "SLA & Reporting", detail: "99.9 % uptime SLA on hosted MCP. Monthly incident & usage reports delivered." },
              { icon: "🎓", title: "Training", detail: "Live workshops for your team — from onboarding to advanced agent orchestration." },
            ].map((item) => (
              <div key={item.title} style={{ padding: "16px" }}>
                <div style={{ fontSize: "1.4rem", marginBottom: "6px" }}>{item.icon}</div>
                <h4 style={{ fontSize: "0.92rem", fontWeight: 700, marginBottom: "4px" }}>{item.title}</h4>
                <p style={{ fontSize: "0.78rem", lineHeight: 1.6, color: "var(--ifm-color-emphasis-600)" }}>{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Certification Program ── */}
        <section style={{ marginBottom: "56px" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "8px", textAlign: "center" }}>🏅 FrootAI Certified Architect</h2>
          <p style={{ fontSize: "0.88rem", color: "var(--ifm-color-emphasis-500)", textAlign: "center", maxWidth: "560px", margin: "0 auto 24px" }}>
            Validate your skills with the industry's first AI-agent architecture certification. Study → Lab → Exam → Badge.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
            {certSections.map((s) => (
              <div
                key={s.title}
                style={{
                  padding: "24px",
                  borderRadius: "14px",
                  border: "1px solid var(--ifm-color-emphasis-200)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "8px" }}>{s.icon}</div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "6px" }}>{s.title}</h4>
                <p style={{ fontSize: "0.78rem", lineHeight: 1.6, color: "var(--ifm-color-emphasis-600)" }}>{s.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTAs ── */}
        <section style={{ textAlign: "center", padding: "40px 24px", borderRadius: "16px", border: "2px solid rgba(124,58,237,0.2)", background: "rgba(124,58,237,0.03)" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "20px" }}>Ready to Level Up?</h2>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to="/setup-guide"
              className={styles.glowPill}
              style={{ "--pill-color": "#7c3aed", display: "inline-block" } as React.CSSProperties}
            >
              Get Started Free →
            </Link>
            <Link
              to="/solution-plays"
              className={styles.glowPill}
              style={{ "--pill-color": "#06b6d4", display: "inline-block" } as React.CSSProperties}
            >
              View Solution Plays →
            </Link>
            <Link
              href="https://github.com/AkashBabu-cloud/frootai"
              className={styles.glowPill}
              style={{ "--pill-color": "#10b981", display: "inline-block" } as React.CSSProperties}
            >
              ⭐ Star on GitHub →
            </Link>
          </div>
        </section>

      </div>
    </Layout>
  );
}
