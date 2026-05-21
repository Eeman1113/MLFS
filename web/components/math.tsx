import katex from "katex";

/** Use this for math content so backslashes stay literal:
 *  <Math>{tex`\text{...} = \begin{pmatrix} 2 \\ 3 \end{pmatrix}`}</Math>
 *  Bypasses JS escape interpretation (\t / \b / etc).
 */
export const tex = String.raw;

function safeRender(src: string, display: boolean) {
  try {
    const html = katex.renderToString(src, {
      displayMode: display,
      throwOnError: false,
      output: "html",
      strict: "ignore",
    });
    return html;
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
