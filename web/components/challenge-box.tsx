export function ChallengeBox({
  title = "End-of-Chapter Challenge",
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="not-prose my-10 rounded-lg border bg-muted/30 p-6">
      <div className="text-[10px] uppercase tracking-[0.22em] font-semibold text-muted-foreground">
        {title}
      </div>
      <div className="prose-book max-w-none mt-3 [&>p:first-child]:mt-0">{children}</div>
    </aside>
  );
}
