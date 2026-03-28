import type { Metadata } from "next";
import { SolutionPlaysClient } from "./solution-plays-client";

export const metadata: Metadata = {
  title: "Solution Plays",
  description: "20 pre-built AI solution plays — from enterprise RAG to multi-agent services.",
};

export default function SolutionPlaysPage() {
  return <SolutionPlaysClient />;
}
