"use client";
import { motion } from "framer-motion";

/** Stylish SVG flowcharts to replace the book's TikZ figures. Theme-aware via currentColor. */

const Node = ({
  x,
  y,
  w = 130,
  h = 50,
  shape = "rect",
  fill = "var(--background)",
  children,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  shape?: "rect" | "diamond" | "oval";
  fill?: string;
  children: React.ReactNode;
}) => {
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
          fill={fill}
          stroke="currentColor"
          strokeWidth={1.5}
        />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12"
          fontWeight="600"
          fill="currentColor"
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
        <polygon points={pts} fill={fill} stroke="currentColor" strokeWidth={1.5} />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="11.5"
          fontWeight="600"
          fill="currentColor"
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
        rx={8}
        ry={8}
        fill={fill}
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fontWeight="500"
        fill="currentColor"
      >
        {children}
      </text>
    </g>
  );
};

const Arrow = ({ d, label }: { d: string; label?: string }) => (
  <g>
    <path
      d={d}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      markerEnd="url(#arrow)"
    />
    {label && (
      <text
        fontSize="10.5"
        fontWeight="600"
        fill="currentColor"
        textAnchor="middle"
        dy="-4"
      >
        <textPath href={`#hidden-${label}`}>{label}</textPath>
      </text>
    )}
  </g>
);

export function TakeawayFlowchart() {
  return (
    <figure className="not-prose my-8">
      <motion.svg
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewBox="0 0 560 460"
        width="100%"
        className="text-foreground max-w-xl mx-auto"
      >
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>
        <Node x={280} y={36} w={70} h={36} shape="oval" fill="var(--muted)">
          Start
        </Node>
        <Node x={280} y={130} shape="diamond" w={180} h={70}>
          Is it a weekday?
        </Node>
        <Node x={280} y={250} shape="diamond" w={180} h={70}>
          Do you have energy?
        </Node>
        <Node x={480} y={130} w={140} h={56} fill="var(--muted)">
          Cook fancy!
        </Node>
        <Node x={480} y={250} w={140} h={56} fill="var(--muted)">
          Order Pizza
        </Node>
        <Node x={280} y={360} w={170} h={56} fill="var(--muted)">
          Cook healthy meal
        </Node>
        <Node x={280} y={430} w={70} h={36} shape="oval" fill="var(--muted)">
          End
        </Node>

        <Arrow d="M 280 54 L 280 95" />
        <Arrow d="M 370 130 L 410 130" />
        <Arrow d="M 280 165 L 280 215" />
        <Arrow d="M 370 250 L 410 250" />
        <Arrow d="M 280 285 L 280 332" />
        <Arrow d="M 280 388 L 280 412" />
        <Arrow d="M 480 158 Q 480 220 480 270 Q 480 410 320 430 L 318 430" />
        <Arrow d="M 480 278 Q 480 360 380 410 L 320 425" />

        {/* labels */}
        <text x={385} y={122} fontSize="10" fontWeight="600" fill="currentColor">No</text>
        <text x={295} y={195} fontSize="10" fontWeight="600" fill="currentColor">Yes</text>
        <text x={385} y={242} fontSize="10" fontWeight="600" fill="currentColor">No</text>
        <text x={295} y={315} fontSize="10" fontWeight="600" fill="currentColor">Yes</text>
      </motion.svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        The "Should I Get Takeaway?" Algorithm.
      </figcaption>
    </figure>
  );
}

export function DebuggingFlowchart() {
  return (
    <figure className="not-prose my-8">
      <motion.svg
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewBox="0 0 620 540"
        width="100%"
        className="text-foreground max-w-2xl mx-auto"
      >
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>
        <Node x={300} y={40} w={70} h={36} shape="oval" fill="var(--muted)">Start</Node>
        <Node x={300} y={140} shape="diamond" w={220} h={80}>Works on the server?</Node>
        <Node x={300} y={260} w={220} h={56} fill="var(--muted)">"Probably caching issue"</Node>
        <Node x={300} y={370} shape="diamond" w={220} h={80}>Did clearing cache work?</Node>
        <Node x={300} y={480} w={220} h={56} fill="var(--muted)">Google error message</Node>
        <Node x={520} y={140} w={150} h={56} fill="var(--muted)">Close ticket. Go home.</Node>
        <Node x={520} y={480} w={90} h={36} shape="oval" fill="var(--muted)">End</Node>

        <Arrow d="M 300 58 L 300 100" />
        <Arrow d="M 410 140 L 445 140" />
        <Arrow d="M 300 180 L 300 232" />
        <Arrow d="M 300 288 L 300 330" />
        <Arrow d="M 410 370 Q 460 370 460 200 L 460 158" />
        <Arrow d="M 300 410 L 300 452" />

        {/* loop back arrow */}
        <Arrow d="M 190 480 Q 60 480 60 140 L 190 140" />

        <text x={420} y={132} fontSize="10" fontWeight="600" fill="currentColor">Yes</text>
        <text x={315} y={220} fontSize="10" fontWeight="600" fill="currentColor">No</text>
        <text x={430} y={362} fontSize="10" fontWeight="600" fill="currentColor">Yes</text>
        <text x={315} y={440} fontSize="10" fontWeight="600" fill="currentColor">No</text>
        <text x={70} y={310} fontSize="10" fontWeight="600" fill="currentColor">retry</text>

        <Arrow d="M 410 140 L 445 140" />
        <Arrow d="M 595 140 Q 595 240 555 460" />
      </motion.svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        The "Works on My Machine" Debugging Loop.
      </figcaption>
    </figure>
  );
}
