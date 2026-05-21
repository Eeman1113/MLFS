import { Flame } from "lucide-react";

export function ChallengeBox({
  title = "End-of-Chapter Challenge",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="not-prose my-10 relative overflow-hidden rounded-2xl border-2 border-foreground bg-card">
      <div className="absolute -top-12 -right-12 size-48 rounded-full bg-foreground/[0.04] blur-2xl" />
      <div className="relative p-7">
        <div className="flex items-center gap-2 mb-1">
          <Flame className="size-4" />
          <div className="text-xs uppercase tracking-[0.22em] font-bold">{title}</div>
        </div>
        <div className="prose-book max-w-none [&>p:first-child]:mt-2">{children}</div>
      </div>
    </aside>
  );
}
