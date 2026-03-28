import type { Metadata } from "next";
import { UserGuideClient } from "./user-guide-client";

export const metadata: Metadata = {
  title: "User Guide",
  description: "Step-by-step walkthrough for each FrootAI solution play.",
};

export default function UserGuidePage() {
  return <UserGuideClient />;
}
