import katex from "katex";

function safeRender(src: string, display: boolean) {
  try {
    return katex.renderToString(src, {
      displayMode: display,
      throwOnError: false,
      output: "html",
      strict: "ignore",
    });
  } catch {
    const esc = src
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<code>${esc}</code>`;
  }
}

/** Inline math. Server-rendered at build time. */
export function M({ children, display = false }: { children: string; display?: boolean }) {
  const html = safeRender(children, display);
  if (display) {
    return (
      <span
        className="block my-4 text-center"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  return (
    <span
      className="inline-block align-baseline"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** Display (block) math. Server-rendered at build time. */
export function Math({ children }: { children: string }) {
  return <M display>{children}</M>;
}
