export function Callout({
  title,
  children,
}: {
  /** Kept for API compat; ignored in the minimal redesign. */
  kind?: "quote" | "spark" | "note" | "definition";
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="not-prose my-6 rounded-lg border bg-muted/30 p-5">
      {title && (
        <div className="text-[10px] uppercase tracking-[0.22em] font-semibold text-muted-foreground mb-2">
          {title}
        </div>
      )}
      <div className="prose-book max-w-none [&>p:first-child]:mt-0">{children}</div>
    </div>
  );
}
