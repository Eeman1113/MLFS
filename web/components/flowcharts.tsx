/** Pure-SVG flowcharts. Theme-aware via fill-card / stroke-foreground tailwind classes. */

const Node = ({
  x,
  y,
  w = 130,
  h = 50,
  shape = "rect",
  filled = false,
  children,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  shape?: "rect" | "diamond" | "oval";
  filled?: boolean;
  children: React.ReactNode;
}) => {
  // tailwind classes — these resolve via CSS, NOT SVG attribute parsing
  const fillClass = filled ? "fill-foreground" : "fill-background";
  const textClass = filled ? "fill-background" : "fill-foreground";
  const strokeClass = "stroke-foreground";

  const fontSize = shape === "diamond" ? 11 : 12;
  const fontWeight = 600;

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
          className={`${fillClass} ${strokeClass}`}
          strokeWidth={1.4}
        />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize}
          fontWeight={fontWeight}
          className={textClass}
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
        <polygon points={pts} className={`${fillClass} ${strokeClass}`} strokeWidth={1.4} />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize}
          fontWeight={fontWeight}
          className={textClass}
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
        className={`${fillClass} ${strokeClass}`}
        strokeWidth={1.4}
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={fontSize}
        fontWeight={500}
        className={textClass}
      >
        {children}
      </text>
    </g>
  );
};

const Arrow = ({ d }: { d: string }) => (
  <path
    d={d}
    fill="none"
    className="stroke-foreground"
    strokeWidth={1.2}
    markerEnd="url(#arrow)"
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

export function TakeawayFlowchart() {
  return (
    <figure className="not-prose my-8">
      <svg viewBox="0 0 560 460" width="100%" className="max-w-xl mx-auto">
        <ArrowDefs />
        <Node x={280} y={36} w={70} h={36} shape="oval">Start</Node>
        <Node x={280} y={130} shape="diamond" w={180} h={70}>Is it a weekday?</Node>
        <Node x={280} y={250} shape="diamond" w={180} h={70}>Do you have energy?</Node>
        <Node x={480} y={130} w={140} h={56}>Cook fancy!</Node>
        <Node x={480} y={250} w={140} h={56}>Order Pizza</Node>
        <Node x={280} y={360} w={170} h={56}>Cook healthy meal</Node>
        <Node x={280} y={430} w={70} h={36} shape="oval">End</Node>

        <Arrow d="M 280 54 L 280 95" />
        <Arrow d="M 370 130 L 410 130" />
        <Arrow d="M 280 165 L 280 215" />
        <Arrow d="M 370 250 L 410 250" />
        <Arrow d="M 280 285 L 280 332" />
        <Arrow d="M 280 388 L 280 412" />
        <Arrow d="M 480 158 Q 480 240 480 270 Q 480 410 320 430 L 318 430" />
        <Arrow d="M 480 278 Q 480 360 380 410 L 320 425" />

        <text x={385} y={122} fontSize="10" fontWeight="600" className="fill-foreground">No</text>
        <text x={295} y={195} fontSize="10" fontWeight="600" className="fill-foreground">Yes</text>
        <text x={385} y={242} fontSize="10" fontWeight="600" className="fill-foreground">No</text>
        <text x={295} y={315} fontSize="10" fontWeight="600" className="fill-foreground">Yes</text>
      </svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        The "Should I Get Takeaway?" Algorithm.
      </figcaption>
    </figure>
  );
}

export function DebuggingFlowchart() {
  return (
    <figure className="not-prose my-8">
      <svg viewBox="0 0 620 540" width="100%" className="max-w-2xl mx-auto">
        <ArrowDefs />
        <Node x={300} y={40} w={70} h={36} shape="oval">Start</Node>
        <Node x={300} y={140} shape="diamond" w={220} h={80}>Works on the server?</Node>
        <Node x={300} y={260} w={220} h={56}>"Probably caching issue"</Node>
        <Node x={300} y={370} shape="diamond" w={220} h={80}>Did clearing cache work?</Node>
        <Node x={300} y={480} w={220} h={56}>Google error message</Node>
        <Node x={520} y={140} w={150} h={56}>Close ticket. Go home.</Node>
        <Node x={520} y={480} w={90} h={36} shape="oval">End</Node>

        <Arrow d="M 300 58 L 300 100" />
        <Arrow d="M 410 140 L 445 140" />
        <Arrow d="M 300 180 L 300 232" />
        <Arrow d="M 300 288 L 300 330" />
        <Arrow d="M 410 370 Q 460 370 460 200 L 460 158" />
        <Arrow d="M 300 410 L 300 452" />
        <Arrow d="M 190 480 Q 60 480 60 140 L 190 140" />
        <Arrow d="M 595 140 Q 595 260 555 460" />

        <text x={420} y={132} fontSize="10" fontWeight="600" className="fill-foreground">Yes</text>
        <text x={315} y={220} fontSize="10" fontWeight="600" className="fill-foreground">No</text>
        <text x={430} y={362} fontSize="10" fontWeight="600" className="fill-foreground">Yes</text>
        <text x={315} y={440} fontSize="10" fontWeight="600" className="fill-foreground">No</text>
        <text x={70} y={310} fontSize="10" fontWeight="600" className="fill-foreground">retry</text>
      </svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        The "Works on My Machine" Debugging Loop.
      </figcaption>
    </figure>
  );
}
