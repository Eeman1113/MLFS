import { Quote, Sparkles, BookOpen } from "lucide-react";

type Kind = "quote" | "spark" | "note" | "definition";

export function Callout({
  kind = "note",
  title,
  children,
}: {
  kind?: Kind;
  title?: string;
  children: React.ReactNode;
}) {
  const Icon = kind === "quote" ? Quote : kind === "spark" ? Sparkles : BookOpen;
  return (
    <div className="not-prose my-6 rounded-2xl border bg-muted/40 p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-1.5">
        <Icon className="size-3.5" />
        {title || (kind === "quote" ? "quote" : kind === "spark" ? "intuition" : "note")}
      </div>
      <div className="prose-book max-w-none [&>p:first-child]:mt-0">{children}</div>
    </div>
  );
}
