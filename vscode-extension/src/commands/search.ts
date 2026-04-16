import * as vscode from "vscode";
import { SOLUTION_PLAYS } from "../data/plays";
import { MCP_TOOLS } from "../data/tools";
import { getGlossary } from "../utils/knowledge";

interface SearchResult extends vscode.QuickPickItem {
  _type?: string;
  _data?: any;
}

export async function searchAll(): Promise<void> {
  const qp = vscode.window.createQuickPick<SearchResult>();
  qp.title = "FrootAI Search — plays, tools, glossary";
  qp.placeholder = "Type to search (e.g., RAG, security, embeddings, voice...)";
  qp.matchOnDescription = true;
  qp.matchOnDetail = true;

  const buildItems = (query: string): SearchResult[] => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    const words = q.split(/\s+/).filter(w => w.length >= 2);
    const items: SearchResult[] = [];

    // Search plays (name, desc, infra, tagline, pattern, category)
    for (const p of SOLUTION_PLAYS) {
      const haystack = [p.id, p.name, p.desc, p.infra, p.tagline, p.pattern, p.cat, p.cx].filter(Boolean).join(" ").toLowerCase();
      if (words.every(w => haystack.includes(w))) {
        items.push({
          label: `$(rocket) ${p.id} — ${p.name}`,
          description: `${p.cx || ""} · ${p.cat || p.layer}`,
          detail: p.tagline || p.desc || p.dir,
          _type: "play",
          _data: p,
        });
      }
    }

    // Search MCP tools
    for (const t of MCP_TOOLS) {
      const haystack = [t.name, t.desc, t.type].filter(Boolean).join(" ").toLowerCase();
      if (words.every(w => haystack.includes(w))) {
        items.push({
          label: `$(tools) ${t.name}`,
          description: `MCP Tool · ${t.type}`,
          detail: t.desc,
          _type: "tool",
          _data: t,
        });
      }
    }

    // Search glossary
    const glossary = getGlossary();
    for (const [, entry] of Object.entries(glossary)) {
      const haystack = [entry.term, entry.definition].filter(Boolean).join(" ").toLowerCase();
      if (words.every(w => haystack.includes(w))) {
        items.push({
          label: `$(book) ${entry.term}`,
          description: "Glossary",
          detail: (entry.definition ?? "").substring(0, 120),
          _type: "glossary",
          _data: entry,
        });
      }
    }

    return items;
  };

  qp.onDidChangeValue(value => {
    qp.items = buildItems(value);
  });

  qp.onDidAccept(() => {
    const selected = qp.selectedItems[0];
    if (!selected) return;
    qp.hide();

    if (selected._type === "play") {
      vscode.commands.executeCommand("frootai.openPlayDetail", selected._data);
    } else if (selected._type === "tool") {
      vscode.window.showInformationMessage(`MCP Tool: ${selected._data.name} — ${selected._data.desc}`);
    } else if (selected._type === "glossary") {
      vscode.window.showInformationMessage(`${selected._data.term}: ${selected._data.definition}`);
    }
  });

  qp.onDidHide(() => qp.dispose());
  qp.show();
}
