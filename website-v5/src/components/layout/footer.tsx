import Link from "next/link";
import { Sparkles } from "lucide-react";

const cols = [
  { title: "Explore", links: [
    { label: "Solution Plays", to: "/solution-plays" },
    { label: "Ecosystem", to: "/ecosystem" },
    { label: "Knowledge Hub", to: "/docs" },
    { label: "Packages", to: "/packages" },
    { label: "Setup Guide", to: "/setup-guide" },
    { label: "Agent FAI", to: "/chatbot" },
    { label: "Configurator", to: "/configurator" },
  ]},
  { title: "Community", links: [
    { label: "Partners", to: "/partners" },
    { label: "Marketplace", to: "/marketplace" },
    { label: "Enterprise", to: "/enterprise" },
    { label: "Workshops", to: "https://github.com/gitpavleenbali/frootai/tree/main/workshops", external: true },
  ]},
  { title: "Install", links: [
    { label: "MCP Server (npm)", to: "https://www.npmjs.com/package/frootai-mcp", external: true },
    { label: "VS Code Extension", to: "https://marketplace.visualstudio.com/items?itemName=pavleenbali.frootai", external: true },
    { label: "Docker Image", to: "https://github.com/gitpavleenbali/frootai/pkgs/container/frootai-mcp", external: true },
  ]},
  { title: "Connect", links: [
    { label: "LinkedIn", to: "https://linkedin.com/in/pavleenbali", external: true },
    { label: "GitHub", to: "https://github.com/gitpavleenbali/frootai", external: true },
    { label: "Newsletter", to: "https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7001119707667832832", external: true },
  ]},
];

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-[#06060a]">
      <div className="mx-auto max-w-7xl px-4 lg:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-[15px]">
              <Sparkles className="h-4 w-4 text-[var(--froot-emerald)]" />
              <span>Froot<span className="text-[var(--froot-emerald)]">AI</span></span>
            </Link>
            <p className="mt-3 text-[12px] text-fg-dim leading-relaxed max-w-[200px]">
              From the Roots to the Fruits. The open glue for AI architecture.
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-fg-dim mb-3">{col.title}</h3>
              <ul className="space-y-1.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a href={link.to} target="_blank" rel="noopener noreferrer"
                        className="text-[13px] text-fg-muted hover:text-fg transition-colors">{link.label}</a>
                    ) : (
                      <Link href={link.to} className="text-[13px] text-fg-muted hover:text-fg transition-colors">{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-fg-dim">&copy; {new Date().getFullYear()} FrootAI &middot; MIT License</p>
          <div className="flex gap-4">
            <Link href="/community" className="text-[11px] text-fg-dim hover:text-fg transition-colors">Community</Link>
            <a href="https://github.com/gitpavleenbali/frootai" target="_blank" rel="noopener noreferrer" className="text-[11px] text-fg-dim hover:text-fg transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
