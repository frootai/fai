import { SectionHeader } from "@/components/ui/section-header";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <SectionHeader
        badge="Phase 0 Complete"
        badgeColor="#10b981"
        title="FrootAI v6"
        subtitle="Foundation scaffold validated. Ready for Phase 1."
      />
    </div>
  );
}
