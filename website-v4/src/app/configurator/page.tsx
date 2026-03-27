import type { Metadata } from "next";
import { ConfiguratorClient } from "./configurator-client";

export const metadata: Metadata = {
  title: "Solution Configurator",
  description: "Answer 3 questions to get your ideal FrootAI solution play recommendation.",
};

export default function ConfiguratorPage() {
  return <ConfiguratorClient />;
}
