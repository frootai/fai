import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import Link from "next/link";
import { DocContent } from "./doc-content";

const docsDir = path.join(process.cwd(), "..", "docs");

function getDocSlugs(): string[] {
  try {
    return fs.readdirSync(docsDir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""));
  } catch {
    return [];
  }
}

function getDocContent(slug: string): string | null {
  const filePath = path.join(docsDir, `${slug}.md`);
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

export function generateStaticParams() {
  return getDocSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  return params.then(({ slug }) => {
    const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return { title, description: `FrootAI Knowledge Module: ${title}` };
  });
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const content = getDocContent(slug);

  if (!content) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Document Not Found</h1>
        <p className="text-muted-foreground mb-6">The document &quot;{slug}&quot; could not be found.</p>
        <Link href="/docs" className="text-froot-amber hover:underline">← Back to Knowledge Modules</Link>
      </div>
    );
  }

  // Strip frontmatter
  const cleaned = content.replace(/^---[\s\S]*?---\n/, "");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-6">
        <Link href="/docs" className="text-[13px] text-froot-amber hover:underline">← Knowledge Modules</Link>
      </div>
      <DocContent content={cleaned} />
    </div>
  );
}
