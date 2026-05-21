"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CHAPTERS, PARTS, partLabel } from "@/lib/chapters";

type Entry = { label: string; href: string };

const sections: Entry[] = [
  { label: "Introduction", href: "/" },
  { label: "Chapters", href: "/chapters" },
  { label: "PDF", href: "https://drive.google.com/file/d/1AKPArWSJqyYRjcUFYKzgzcgQ3A20FA4M/view" },
  { label: "Flipbook", href: "./backup_index.html" },
  { label: "GitHub", href: "https://github.com/Eeman1113/MLFS" },
];

export function DocsNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      <Group label="Sections">
        {sections.map((s) => (
          <Row
            key={s.href}
            href={s.href}
            active={pathname === s.href}
            external={s.href.startsWith("http") || s.href.startsWith("./")}
            onNavigate={onNavigate}
          >
            {s.label}
          </Row>
        ))}
      </Group>
      {PARTS.map((p) => (
        <Group key={p.num} label={partLabel(p)}>
          {CHAPTERS.filter((c) => c.partNum === p.num).map((c) => {
            const href = `/chapters/${c.slug}`;
            return (
              <Row key={c.slug} href={href} active={pathname === href} onNavigate={onNavigate}>
                {c.title}
              </Row>
            );
          })}
        </Group>
      ))}
    </>
  );
}

export function DocsSidebar() {
  return (
    <aside className="hidden md:block w-64 shrink-0 fade-edge-r">
      <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto no-scrollbar fade-mask-y px-4 py-8">
        <DocsNav />
      </div>
    </aside>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="px-2 mb-1.5 text-xs font-semibold text-foreground/70">{label}</div>
      <div className="flex flex-col gap-px">{children}</div>
    </div>
  );
}

function Row({
  href,
  children,
  active,
  external,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  external?: boolean;
  onNavigate?: () => void;
}) {
  const cls = `block rounded-md px-2 py-1.5 text-sm transition-colors ${
    active
      ? "bg-muted text-foreground font-medium"
      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
  }`;
  if (external) {
    return (
      <a
        href={href}
        className={cls}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noreferrer"
        onClick={onNavigate}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} onClick={onNavigate}>
      {children}
    </Link>
  );
}
