import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "FrootAI — From the Roots to the Fruits", template: "%s | FrootAI" },
  description: "The open glue for AI architecture. 22 MCP tools, 20 solution plays, 18 knowledge modules.",
  keywords: ["FrootAI", "AI", "MCP", "solution plays", "agents", "RAG", "Azure", "LLM"],
  openGraph: {
    title: "FrootAI — From the Roots to the Fruits",
    description: "22 MCP tools, 20 solution plays, 18 knowledge modules. The open glue for AI architecture.",
    type: "website", locale: "en_US", siteName: "FrootAI", url: "https://frootai.dev",
    images: [{ url: "https://frootai.dev/img/frootai-og.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "FrootAI", description: "22 MCP tools, 20 solution plays.", images: ["https://frootai.dev/img/frootai-og.png"] },
  icons: { icon: "/img/favicon.ico" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
