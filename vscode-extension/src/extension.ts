// FrootAI VS Code Extension v6.0.0 — TypeScript entry point
// Legacy JS handles existing 25 commands.
// New TypeScript modules add: searchAll, webview panels.

import * as vscode from "vscode";
import { searchAll } from "./commands/search";
import { PlayDetailPanel } from "./webviews/PlayDetailPanel";
import { EvaluationPanel } from "./webviews/EvaluationPanel";
import { ScaffoldWizardPanel } from "./webviews/ScaffoldWizardPanel";
import { McpToolExplorerPanel } from "./webviews/McpToolExplorerPanel";
import { SOLUTION_PLAYS } from "./data/plays";

// Legacy extension handles existing commands + tree views
// eslint-disable-next-line @typescript-eslint/no-var-requires
const legacy = require("./extension.js");

export function activate(context: vscode.ExtensionContext): void {
  // Activate legacy (existing 25 commands, tree views, MCP provider)
  legacy.activate(context);

  // ─── New Commands (Phase 2+3) ───

  context.subscriptions.push(
    vscode.commands.registerCommand("frootai.searchAll", () => searchAll()),

    vscode.commands.registerCommand("frootai.openPlayDetail", (playOrId?: any) => {
      let play = playOrId;
      if (typeof playOrId === "string") {
        play = SOLUTION_PLAYS.find(p => p.id === playOrId) ?? SOLUTION_PLAYS[0];
      }
      if (!play) {
        play = SOLUTION_PLAYS[0];
      }
      PlayDetailPanel.createOrShow(play);
    }),

    vscode.commands.registerCommand("frootai.openEvaluationDashboard", () => {
      EvaluationPanel.createOrShow();
    }),

    vscode.commands.registerCommand("frootai.openScaffoldWizard", () => {
      ScaffoldWizardPanel.createOrShow();
    }),

    vscode.commands.registerCommand("frootai.openMcpExplorer", () => {
      McpToolExplorerPanel.createOrShow();
    }),
  );
}

export function deactivate(): void {
  legacy.deactivate();
}
