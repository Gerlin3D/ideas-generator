import { AppShell } from "@/components/app-shell";
import { RouteCard } from "@/components/route-card";

type IdeaDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function IdeaDetailPage({ params }: IdeaDetailPageProps) {
  const { id } = await params;

  return (
    <AppShell
      title={`Idea ${id}`}
      description="Detail pages will later render the active version, full analysis, and per-idea usage history without overwriting prior outputs."
    >
      <RouteCard
        eyebrow="/ideas/[id]"
        title="Detail View Placeholder"
        description="The schema is ready for currentVersion links plus a complete version history for refinement and MVP concept generation."
      />
    </AppShell>
  );
}
