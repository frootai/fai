"use client";

import { useEffect, useRef, useState } from "react";

let mermaidInitialized = false;

export function MermaidDiagram({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2, 9)}`);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mermaid = (await import("mermaid" as any)).default;

        if (!mermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            theme: "base",
            themeVariables: {
              // Modern dark palette matching FrootAI
              primaryColor: "#1e293b",
              primaryTextColor: "#f1f5f9",
              primaryBorderColor: "#10b981",
              lineColor: "#6366f1",
              secondaryColor: "#1a1a3e",
              secondaryTextColor: "#e2e8f0",
              secondaryBorderColor: "#7c3aed",
              tertiaryColor: "#0f172a",
              tertiaryTextColor: "#e2e8f0",
              tertiaryBorderColor: "#06b6d4",

              // Typography
              fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
              fontSize: "13px",

              // Node styling
              nodeBorder: "#10b981",
              nodeTextColor: "#f1f5f9",
              mainBkg: "#0f172a",
              clusterBkg: "#0d1117",
              clusterBorder: "#1e293b",
              titleColor: "#10b981",

              // Edges & lines
              edgeLabelBackground: "#0f172a",
              arrowheadColor: "#6366f1",

              // Sequence diagrams  
              actorTextColor: "#f1f5f9",
              actorBkg: "#1e293b",
              actorBorder: "#10b981",
              actorLineColor: "#334155",
              signalColor: "#818cf8",
              signalTextColor: "#f1f5f9",
              labelBoxBkgColor: "#1e293b",
              labelBoxBorderColor: "#6366f1",
              labelTextColor: "#f1f5f9",
              loopTextColor: "#a78bfa",
              activationBorderColor: "#10b981",
              activationBkgColor: "#1e3a5f",
              sequenceNumberColor: "#f1f5f9",

              // Notes
              noteBkgColor: "#1e293b",
              noteTextColor: "#e2e8f0",
              noteBorderColor: "#7c3aed",

              // State diagrams
              labelColor: "#f1f5f9",
              altBackground: "#0d1117",

              // Pie
              pie1: "#10b981",
              pie2: "#6366f1",
              pie3: "#7c3aed",
              pie4: "#06b6d4",
              pie5: "#f59e0b",
              pie6: "#ec4899",

              // Git
              git0: "#10b981",
              git1: "#6366f1",
              git2: "#7c3aed",
              git3: "#06b6d4",
              gitBranchLabel0: "#f1f5f9",

              // Mindmap
              cScale0: "#10b981",
              cScale1: "#6366f1",
              cScale2: "#7c3aed",
              cScale3: "#06b6d4",
              cScale4: "#f59e0b",
              cScale5: "#ec4899",
            },
            flowchart: { 
              curve: "basis", 
              htmlLabels: true,
              padding: 12,
              nodeSpacing: 50,
              rankSpacing: 50,
              defaultRenderer: "dagre-wrapper",
            },
            sequence: { 
              mirrorActors: false,
              bottomMarginAdj: 10,
              messageMargin: 35,
              noteMargin: 10,
              actorMargin: 50,
              width: 150,
              height: 65,
              boxMargin: 10,
              boxTextMargin: 5,
              useMaxWidth: true,
              rightAngles: false,
            },
            mindmap: { padding: 20 },
            themeCSS: `
              /* Modern node styling */
              .node rect, .node polygon, .node circle, .node ellipse { 
                rx: 12px;
                ry: 12px;
                stroke-width: 1.5px;
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
              }
              .node .label { font-weight: 500; }
              .edgeLabel { font-size: 11px; }
              
              /* Cluster/subgraph modernization */
              .cluster rect { 
                rx: 16px !important; 
                ry: 16px !important; 
                stroke-dasharray: 6 3;
                stroke-width: 1.5px;
                filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
              }
              .cluster .nodeLabel { font-weight: 600; font-size: 12px; }
              
              /* Sequence diagram modernization */
              .actor { rx: 8px; ry: 8px; stroke-width: 1.5px; }
              .messageLine0, .messageLine1 { stroke-width: 1.5px; }
              
              /* Arrow styling */
              .arrowheadPath { fill: #6366f1; }
              marker path { fill: #6366f1; }
              
              /* Timeline styling */
              .timeline-section rect { rx: 8px; ry: 8px; }
            `,
          });
          mermaidInitialized = true;
        }

        // Clean the chart text
        const cleaned = chart.trim();
        const { svg: rendered } = await mermaid.render(idRef.current, cleaned);
        if (!cancelled) setSvg(rendered);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to render diagram");
      }
    })();

    return () => { cancelled = true; };
  }, [chart]);

  if (error) {
    return (
      <div className="my-4 rounded-xl border border-rose/20 bg-rose/[0.04] p-4 overflow-x-auto">
        <p className="text-[11px] text-rose font-medium mb-2">Diagram render error</p>
        <pre className="text-[12px] text-fg-muted leading-relaxed whitespace-pre-wrap">{chart}</pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="my-4 rounded-xl border border-border bg-bg/80 p-8 text-center">
        <div className="text-[12px] text-fg-dim animate-pulse">Rendering diagram...</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-6 rounded-2xl border border-indigo/15 bg-gradient-to-br from-[#0a0a18] via-[#0d0d1a] to-[#0f0f22] p-6 overflow-x-auto shadow-lg shadow-black/20 [&_svg]:mx-auto [&_svg]:max-w-full [&_.node_rect]:transition-all [&_.node_rect]:duration-200"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
