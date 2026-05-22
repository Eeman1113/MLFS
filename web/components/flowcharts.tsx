/** Pure-SVG flowcharts that mirror the book's TikZ figures
 *  (orthogonal arrows + the book's pastel color palette). */

type Fill = "yellow" | "green" | "blue" | "red" | "plain";

const FILL: Record<Fill, string> = {
  yellow: "fill-yellow-100",
  green: "fill-green-100",
  blue: "fill-blue-100",
  red: "fill-red-100",
  plain: "fill-background",
};

const TEXT_FILL: Record<Fill, string> = {
  yellow: "fill-neutral-900",
  green: "fill-neutral-900",
  blue: "fill-neutral-900",
  red: "fill-neutral-900",
  plain: "fill-foreground",
};

const Node = ({
  x,
  y,
  w = 130,
  h = 50,
  shape = "rect",
  fill = "plain",
  children,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  shape?: "rect" | "diamond" | "oval";
  fill?: Fill;
  children: React.ReactNode;
}) => {
  const fontSize = shape === "diamond" ? 11 : 12;

  if (shape === "oval") {
    return (
      <g>
        <rect
          x={x - w / 2}
          y={y - h / 2}
          width={w}
          height={h}
          rx={h / 2}
          ry={h / 2}
          className={`${FILL[fill]} stroke-foreground`}
          strokeWidth={1.4}
        />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize}
          fontWeight={600}
          className={TEXT_FILL[fill]}
        >
          {children}
        </text>
      </g>
    );
  }
  if (shape === "diamond") {
    const pts = `${x},${y - h / 2} ${x + w / 2},${y} ${x},${y + h / 2} ${x - w / 2},${y}`;
    return (
      <g>
        <polygon points={pts} className={`${FILL[fill]} stroke-foreground`} strokeWidth={1.4} />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize}
          fontWeight={600}
          className={TEXT_FILL[fill]}
        >
          {children}
        </text>
      </g>
    );
  }
  return (
    <g>
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={6}
        ry={6}
        className={`${FILL[fill]} stroke-foreground`}
        strokeWidth={1.4}
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={fontSize}
        fontWeight={500}
        className={TEXT_FILL[fill]}
      >
        {children}
      </text>
    </g>
  );
};

const Arrow = ({ d, head = true }: { d: string; head?: boolean }) => (
  <path
    d={d}
    fill="none"
    className="stroke-foreground"
    strokeWidth={1.2}
    strokeLinejoin="miter"
    strokeLinecap="square"
    markerEnd={head ? "url(#arrow)" : undefined}
  />
);

const ArrowDefs = () => (
  <defs>
    <marker
      id="arrow"
      viewBox="0 0 10 10"
      refX="9"
      refY="5"
      markerWidth="6"
      markerHeight="6"
      orient="auto-start-reverse"
    >
      <path d="M 0 0 L 10 5 L 0 10 z" className="fill-foreground" />
    </marker>
  </defs>
);

/* ------------------------------------------------------------------ */

export function TakeawayFlowchart() {
  // viewBox is wider than before so the right rails don't get clipped.
  return (
    <figure className="not-prose my-8">
      <svg viewBox="0 0 640 480" width="100%" className="max-w-xl mx-auto">
        <ArrowDefs />

        {/* nodes */}
        <Node x={280} y={36} w={80} h={36} shape="oval" fill="yellow">Start</Node>
        <Node x={280} y={140} shape="diamond" w={180} h={80} fill="green">Is it a weekday?</Node>
        <Node x={280} y={270} shape="diamond" w={180} h={80} fill="green">Do you have energy?</Node>
        <Node x={280} y={380} w={170} h={56} fill="blue">Cook a healthy meal</Node>
        <Node x={280} y={450} w={80} h={36} shape="oval" fill="red">End</Node>
        <Node x={480} y={140} w={140} h={56} fill="blue">Cook fancy!</Node>
        <Node x={480} y={270} w={140} h={56} fill="blue">Order Pizza</Node>

        {/* main vertical flow */}
        <Arrow d="M 280 54 L 280 100" />
        <Arrow d="M 280 180 L 280 230" />
        <Arrow d="M 280 310 L 280 352" />
        <Arrow d="M 280 408 L 280 432" />

        {/* "No" branches out to the right */}
        <Arrow d="M 370 140 L 410 140" />
        <Arrow d="M 370 270 L 410 270" />

        {/* right rails: Cook fancy and Order Pizza both feed End from the right.
            Two distinct L-shaped paths at different x (605 vs 580) and slightly
            different terminal y so the arrowheads don't overlap. */}
        <Arrow d="M 550 140 L 605 140 L 605 445 L 320 445" />
        <Arrow d="M 550 270 L 580 270 L 580 455 L 320 455" />

        {/* labels */}
        <text x={388} y={134} fontSize="11" fontWeight="600" className="fill-foreground">No</text>
        <text x={295} y={215} fontSize="11" fontWeight="600" className="fill-foreground">Yes</text>
        <text x={388} y={264} fontSize="11" fontWeight="600" className="fill-foreground">No</text>
        <text x={295} y={345} fontSize="11" fontWeight="600" className="fill-foreground">Yes</text>
      </svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        The "Should I Get Takeaway?" Algorithm.
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */

export function DebuggingFlowchart() {
  return (
    <figure className="not-prose my-8">
      <svg viewBox="0 0 700 540" width="100%" className="max-w-2xl mx-auto">
        <ArrowDefs />

        <Node x={300} y={36} w={80} h={36} shape="oval" fill="yellow">Start</Node>
        <Node x={300} y={140} shape="diamond" w={220} h={80} fill="green">Works on the server?</Node>
        <Node x={300} y={260} w={220} h={56} fill="blue">"Probably caching issue"</Node>
        <Node x={300} y={370} shape="diamond" w={220} h={80} fill="green">Did clearing cache work?</Node>
        <Node x={300} y={480} w={220} h={56} fill="blue">Google error message</Node>
        <Node x={540} y={140} w={150} h={56} fill="blue">Close ticket. Go home.</Node>
        <Node x={540} y={480} w={90} h={36} shape="oval" fill="red">End</Node>

        {/* main vertical flow */}
        <Arrow d="M 300 54 L 300 100" />
        <Arrow d="M 300 180 L 300 232" />
        <Arrow d="M 300 288 L 300 330" />
        <Arrow d="M 300 410 L 300 452" />

        {/* No goes to right (close ticket → End) */}
        <Arrow d="M 410 140 L 465 140" />
        <Arrow d="M 540 168 L 540 462" />

        {/* Cache cleared? Yes → Close ticket */}
        <Arrow d="M 410 370 L 645 370 L 645 140 L 615 140" />

        {/* Google → loops back up to top of weekday diamond */}
        <Arrow d="M 190 480 L 60 480 L 60 140 L 190 140" />

        {/* labels */}
        <text x={435} y={134} fontSize="11" fontWeight="600" className="fill-foreground">Yes</text>
        <text x={315} y={215} fontSize="11" fontWeight="600" className="fill-foreground">No</text>
        <text x={500} y={362} fontSize="11" fontWeight="600" className="fill-foreground">Yes</text>
        <text x={315} y={445} fontSize="11" fontWeight="600" className="fill-foreground">No</text>
        <text x={70} y={310} fontSize="11" fontWeight="600" className="fill-foreground">retry</text>
      </svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        The "Works on My Machine" Debugging Loop.
      </figcaption>
    </figure>
  );
}
