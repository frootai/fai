// FrootAI VS Code Extension v6.2.1
// Legacy extension.js handles tree views + 25 commands.
// This TS entry point adds React webview panel commands on top.

import * as vscode from "vscode";
import { searchAll } from "./commands/search";
import { createReactPanel } from "./webviews/reactHost";
import { SOLUTION_PLAYS } from "./data/plays";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const legacy = require("./extension.js");

let _activated = false;

export function activate(context: vscode.ExtensionContext): void {
  if (_activated) return;
  _activated = true;

  // Legacy handles tree views + existing commands
  legacy.activate(context);

  // New React panel commands — safe registration (skip if already exists)
  const safeRegister = (id: string, fn: (...args: any[]) => any) => {
    try { context.subscriptions.push(vscode.commands.registerCommand(id, fn)); }
    catch { /* already registered by legacy — OK */ }
  };

  safeRegister("frootai.searchAll", () => searchAll());

  safeRegister("frootai.openPlayDetail", (playOrId?: any) => {
    let play = playOrId;
    if (typeof playOrId === "string") {
      play = SOLUTION_PLAYS.find(p => p.id === playOrId) ?? SOLUTION_PLAYS[0];
    }
    if (!play) play = SOLUTION_PLAYS[0];
    createReactPanel(context.extensionUri, "frootai.playDetail", `Play ${play.id} — ${play.name}`, { panel: "playDetail", play });
  });

  safeRegister("frootai.openEvaluationDashboard", () => {
    createReactPanel(context.extensionUri, "frootai.evaluation", "Evaluation Dashboard", { panel: "evaluation" });
  });

  safeRegister("frootai.openScaffoldWizard", () => {
    createReactPanel(context.extensionUri, "frootai.scaffold", "Scaffold Wizard", { panel: "scaffold", plays: SOLUTION_PLAYS });
  });

  safeRegister("frootai.openMcpExplorer", () => {
    createReactPanel(context.extensionUri, "frootai.mcpExplorer", "MCP Tool Explorer", { panel: "mcpExplorer" });
  });
}

export function deactivate(): void {
  legacy.deactivate();
}
