/** LLM-specific SVG figures for the bonus chapter.
 *  Same hand-drawn flowchart style as components/flowcharts.tsx —
 *  pastel fills, hairline strokes, generous padding so nothing overlaps.
 *
 *  Every diagram is laid out on a clean grid:
 *  - boxes are positioned by CENTER (x, y) with explicit (w, h)
 *  - arrows are drawn from one box's EDGE to another's EDGE (no slicing through)
 *  - notes / metadata live in empty margin zones, never on top of geometry
 */

type Fill = "yellow" | "green" | "blue" | "red" | "purple" | "orange" | "plain";

const FILL: Record<Fill, string> = {
  yellow: "fill-yellow-100",
  green: "fill-green-100",
  blue: "fill-blue-100",
  red: "fill-red-100",
  purple: "fill-purple-100",
  orange: "fill-orange-100",
  plain: "fill-background",
};

const Box = ({
  x,
  y,
  w = 130,
  h = 42,
  rx = 6,
  fill = "plain",
  font = 12,
  bold = 500,
  children,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  rx?: number;
  fill?: Fill;
  font?: number;
  bold?: number;
  children: React.ReactNode;
}) => (
  <g>
    <rect
      x={x - w / 2}
      y={y - h / 2}
      width={w}
      height={h}
      rx={rx}
      ry={rx}
      className={`${FILL[fill]} stroke-foreground`}
      strokeWidth={1.3}
    />
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={font}
      fontWeight={bold}
      className="fill-foreground"
    >
      {children}
    </text>
  </g>
);

const Arrow = ({ d, head = true, dashed = false }: { d: string; head?: boolean; dashed?: boolean }) => (
  <path
    d={d}
    fill="none"
    className="stroke-foreground"
    strokeWidth={1.2}
    strokeDasharray={dashed ? "4 3" : undefined}
    strokeLinecap="round"
    strokeLinejoin="round"
    markerEnd={head ? "url(#llmarrow)" : undefined}
  />
);

const Defs = () => (
  <defs>
    <marker
      id="llmarrow"
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

const Note = ({
  x,
  y,
  children,
  anchor = "middle" as const,
  size = 11,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  anchor?: "start" | "middle" | "end";
  size?: number;
}) => (
  <text
    x={x}
    y={y}
    fontSize={size}
    className="fill-muted-foreground"
    textAnchor={anchor}
    dominantBaseline="middle"
  >
    {children}
  </text>
);

const Label = ({
  x,
  y,
  children,
  anchor = "middle" as const,
  bold = 700,
  size = 12,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  anchor?: "start" | "middle" | "end";
  bold?: number;
  size?: number;
}) => (
  <text
    x={x}
    y={y}
    fontSize={size}
    fontWeight={bold}
    className="fill-foreground"
    textAnchor={anchor}
    dominantBaseline="middle"
  >
    {children}
  </text>
);

/* ─────────────────────────────────────────── 1. TOKENIZATION ── */

export function TokenizationFlow() {
  // four-box horizontal chain at y=170, then one orange box below for IDs+embedding.
  // notes pinned to safe margins (top + bottom) so nothing collides.
  return (
    <figure className="not-prose my-8">
      <svg viewBox="0 0 820 340" width="100%" className="max-w-3xl mx-auto">
        <Defs />

        {/* top meta lines */}
        <Note x={410} y={32}>raw string → integer IDs (and back)</Note>
        <Note x={410} y={52} size={10}>
          vocab size: GPT-4 ≈ 100k · Llama 3 ≈ 128k · Gemma 256k
        </Note>

        {/* main chain */}
        <Box x={90} y={170} w={150} h={50} fill="yellow">&quot;strawberry&quot;</Box>
        <Box x={290} y={170} w={170} h={50} fill="blue" font={11.5}>pre-tokenizer (regex)</Box>
        <Box x={490} y={170} w={170} h={50} fill="blue" font={11.5}>byte-level BPE merges</Box>
        <Box x={690} y={170} w={150} h={50} fill="green" font={11.5}>[str, aw, berry]</Box>

        <Arrow d="M 165 170 L 205 170" />
        <Arrow d="M 375 170 L 405 170" />
        <Arrow d="M 575 170 L 615 170" />

        {/* downstream: token IDs + embedding */}
        <Box x={690} y={260} w={230} h={42} fill="orange" font={11}>
          [496, 707, 15717] → embedding
        </Box>
        <Arrow d="M 690 195 L 690 239" />

        {/* caption */}
        <Note x={410} y={310} size={11}>
          the model never sees the letter &quot;R&quot; — only three opaque chunks
        </Note>
      </svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        Why &quot;how many R&apos;s in strawberry?&quot; trips up GPT.
      </figcaption>
    </figure>
  );
}

/* ─────────────────────────────────────────── 2. EMBED + POSITION ── */

export function EmbeddingPlusPosition() {
  return (
    <figure className="not-prose my-8">
      <svg viewBox="0 0 720 280" width="100%" className="max-w-2xl mx-auto">
        <Defs />

        <Box x={130} y={90} w={200} h={46} fill="green" font={11.5}>token embedding E[id]</Box>
        <Box x={130} y={200} w={200} h={46} fill="purple" font={11.5}>positional encoding</Box>

        {/* + node */}
        <g>
          <circle cx={370} cy={145} r={26} className="fill-yellow-100 stroke-foreground" strokeWidth={1.3} />
          <text x={370} y={145} textAnchor="middle" dominantBaseline="middle" fontSize={20} fontWeight={600} className="fill-foreground">＋</text>
        </g>

        <Box x={560} y={145} w={170} h={50} fill="blue" font={12}>into block 1</Box>

        {/* arrows: emb and pos meet at + */}
        <Arrow d="M 230 95 L 344 132" />
        <Arrow d="M 230 195 L 344 158" />
        <Arrow d="M 396 145 L 475 145" />

        {/* notes below each source box */}
        <Note x={130} y={134} size={10}>vocab × d_model lookup</Note>
        <Note x={130} y={244} size={10}>sinusoidal · learned · RoPE · ALiBi</Note>
        <Note x={560} y={190} size={10}>same shape, now order-aware</Note>
      </svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        Token embeddings + positions → the input to block 1.
      </figcaption>
    </figure>
  );
}

/* ─────────────────────────────────────────── 3. ATTENTION FLOW ── */

export function AttentionFlow() {
  // X on the left fans out into Q, K, V.
  // Q+K feed the score chain along the top row.
  // V meets the softmax output at the "attention · V" box, producing Y.
  return (
    <figure className="not-prose my-8">
      <svg viewBox="0 0 880 380" width="100%" className="max-w-3xl mx-auto">
        <Defs />

        {/* source */}
        <Box x={70} y={200} w={70} h={50} fill="yellow">X</Box>

        {/* QKV column */}
        <Box x={220} y={80} w={110} h={40} fill="blue" font={11.5}>Q = X·W_Q</Box>
        <Box x={220} y={200} w={110} h={40} fill="blue" font={11.5}>K = X·W_K</Box>
        <Box x={220} y={320} w={110} h={40} fill="blue" font={11.5}>V = X·W_V</Box>

        <Arrow d="M 105 188 L 167 95" />
        <Arrow d="M 105 200 L 167 200" />
        <Arrow d="M 105 212 L 167 305" />

        {/* score chain across the top */}
        <Box x={420} y={80} w={140} h={42} fill="purple" font={11.5}>Q · Kᵀ / √d_k</Box>
        <Box x={600} y={80} w={120} h={42} fill="purple" font={11.5}>causal mask</Box>
        <Box x={760} y={80} w={90} h={42} fill="purple" font={11.5}>softmax</Box>

        {/* Q and K both contribute to the score */}
        <Arrow d="M 275 80 L 350 80" />
        <Arrow d="M 275 200 L 350 100" />
        <Arrow d="M 490 80 L 540 80" />
        <Arrow d="M 660 80 L 715 80" />

        {/* output row */}
        <Box x={560} y={300} w={150} h={44} fill="green" font={11.5}>attention · V</Box>
        <Box x={760} y={300} w={80} h={44} fill="yellow" font={12}>Y</Box>

        {/* softmax flows down into "attention · V" */}
        <Arrow d="M 760 102 L 615 279" />

        {/* V joins from the left */}
        <Arrow d="M 275 320 L 485 305" />

        {/* attention · V → Y */}
        <Arrow d="M 635 300 L 720 300" />

        {/* notes pinned safely to the right margin */}
        <Note x={870} y={50} anchor="end" size={10}>row-wise · sums to 1</Note>
        <Note x={490} y={140} size={10}>future tokens → −∞</Note>
        <Note x={560} y={350} size={10}>weighted sum of V rows</Note>
      </svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        Scaled dot-product self-attention, end to end.
      </figcaption>
    </figure>
  );
}

/* ─────────────────────────────────────────── 4. MULTI-HEAD ── */

export function MultiHeadSplit() {
  return (
    <figure className="not-prose my-8">
      <svg viewBox="0 0 820 360" width="100%" className="max-w-2xl mx-auto">
        <Defs />

        <Box x={70} y={180} w={70} h={50} fill="yellow">X</Box>

        {(["blue", "purple", "green", "orange"] as Fill[]).map((c, i) => {
          const y = 70 + i * 75;
          return (
            <g key={i}>
              <Box x={290} y={y} w={170} h={40} fill={c} font={11.5}>
                {`head ${i + 1} · own Q,K,V`}
              </Box>
              <Arrow d={`M 105 ${180 + (y - 180) * 0.2} L 205 ${y}`} />
              <Arrow d={`M 375 ${y} L 460 180`} />
            </g>
          );
        })}

        <Box x={530} y={180} w={110} h={50} fill="yellow">concat</Box>
        <Box x={690} y={180} w={80} h={50} fill="yellow">W_O</Box>
        <Arrow d="M 585 180 L 650 180" />

        <Note x={290} y={30} size={10}>each head: own subspace, own Q/K/V</Note>
        <Note x={690} y={240} size={10}>back to d_model</Note>
        <Note x={690} y={258} size={10}>MHA · MQA · GQA all live here</Note>
      </svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        Multi-head attention: parallel committee, then merge.
      </figcaption>
    </figure>
  );
}

/* ─────────────────────────────────────────── 5. TRANSFORMER BLOCK ── */

export function TransformerBlock() {
  // Vertical residual stream column down the centre.
  // Two side-branches tap off to the LEFT (attention, then FFN),
  // each rejoining via a "+" merge node back on the stream.
  return (
    <figure className="not-prose my-8">
      <svg viewBox="0 0 680 580" width="100%" className="max-w-md mx-auto">
        <Defs />

        {/* residual stream column */}
        <rect
          x={310}
          y={50}
          width={50}
          height={490}
          rx={6}
          className="fill-muted/40 stroke-foreground/30"
          strokeWidth={1}
        />
        <Note x={335} y={36} size={11}>residual stream</Note>

        {/* stream tokens */}
        <Box x={335} y={80} w={170} h={32} fill="plain" font={11}>x (d_model)</Box>

        {/* attention branch on the left */}
        <Box x={140} y={170} w={120} h={36} fill="purple" font={11.5}>RMSNorm</Box>
        <Box x={140} y={230} w={120} h={36} fill="blue" font={11.5}>attention</Box>

        {/* + merge for attention */}
        <g>
          <circle cx={335} cy={300} r={20} className="fill-yellow-100 stroke-foreground" strokeWidth={1.3} />
          <text x={335} y={300} textAnchor="middle" dominantBaseline="middle" fontSize={18} fontWeight={600} className="fill-foreground">＋</text>
        </g>

        {/* FFN branch on the left */}
        <Box x={140} y={380} w={120} h={36} fill="purple" font={11.5}>RMSNorm</Box>
        <Box x={140} y={440} w={120} h={36} fill="green" font={11.5}>SwiGLU FFN</Box>

        {/* + merge for FFN */}
        <g>
          <circle cx={335} cy={510} r={20} className="fill-yellow-100 stroke-foreground" strokeWidth={1.3} />
          <text x={335} y={510} textAnchor="middle" dominantBaseline="middle" fontSize={18} fontWeight={600} className="fill-foreground">＋</text>
        </g>

        {/* arrows: stream → branch in, branch out → merge */}
        <Arrow d="M 310 95 L 310 170 L 205 170" />
        <Arrow d="M 140 188 L 140 212" />
        <Arrow d="M 205 230 L 315 290" />

        <Arrow d="M 310 320 L 310 380 L 205 380" />
        <Arrow d="M 140 398 L 140 422" />
        <Arrow d="M 205 440 L 315 500" />

        {/* labels on the right margin (well clear of the stream box) */}
        <Note x={400} y={200} anchor="start" size={11}>read · norm · attend · write</Note>
        <Note x={400} y={410} anchor="start" size={11}>read · norm · MLP · write</Note>

        <Note x={335} y={555} size={10}>stream continues to next block</Note>
      </svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        One block: two taps on the residual stream.
      </figcaption>
    </figure>
  );
}

/* ─────────────────────────────────────────── 6. FULL STACK ── */

export function FullTransformerStack() {
  return (
    <figure className="not-prose my-8">
      <svg viewBox="0 0 600 600" width="100%" className="max-w-md mx-auto">
        <Defs />

        <Box x={300} y={40} w={240} h={36} fill="yellow">token IDs</Box>
        <Box x={300} y={100} w={240} h={36} fill="green">embedding + position</Box>

        {[0, 1, 2, 3, 4].map((i) => (
          <Box key={i} x={300} y={170 + i * 56} w={280} h={40} fill="blue">
            transformer block {i + 1}
          </Box>
        ))}

        <text x={300} y={460} textAnchor="middle" fontSize={14} className="fill-muted-foreground">⋮ (N blocks total)</text>

        <Box x={300} y={510} w={280} h={36} fill="purple" font={11.5}>final RMSNorm → logits (vocab)</Box>

        <Arrow d="M 300 58 L 300 82" />
        <Arrow d="M 300 118 L 300 150" />
        {[0, 1, 2, 3].map((i) => (
          <Arrow key={i} d={`M 300 ${190 + i * 56} L 300 ${206 + i * 56}`} />
        ))}
        <Arrow d="M 300 472 L 300 492" />

        {/* notes BELOW everything so they never collide */}
        <Note x={300} y={570} size={11}>
          Llama 3 8B · N=32   ·   Llama 3 70B · N=80   ·   Llama 3.1 405B · N=126
        </Note>
      </svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        The whole show: embed → N blocks → unembed.
      </figcaption>
    </figure>
  );
}

/* ─────────────────────────────────────────── 7. THREE ARCHITECTURES ── */

export function ThreeArchitectures() {
  const stack = (cx: number, label: string, sub: string, fill: Fill) => (
    <g>
      <Box x={cx} y={40} w={150} h={32} fill="yellow" font={11.5}>input</Box>
      {[0, 1, 2].map((i) => (
        <Box key={i} x={cx} y={95 + i * 48} w={150} h={36} fill={fill} font={11.5}>
          block {i + 1}
        </Box>
      ))}
      <Box x={cx} y={250} w={150} h={32} fill="green" font={11.5}>output</Box>
      <text x={cx} y={300} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">
        {label}
      </text>
      <text x={cx} y={318} textAnchor="middle" fontSize={10} className="fill-muted-foreground">
        {sub}
      </text>

      {/* connectors */}
      <Arrow d={`M ${cx} 58 L ${cx} 75`} />
      {[0, 1].map((i) => (
        <Arrow key={i} d={`M ${cx} ${115 + i * 48} L ${cx} ${122 + i * 48}`} />
      ))}
      <Arrow d={`M ${cx} 213 L ${cx} 232`} />
    </g>
  );
  return (
    <figure className="not-prose my-8">
      <svg viewBox="0 0 720 360" width="100%" className="max-w-2xl mx-auto">
        <Defs />
        {stack(130, "encoder-decoder", "T5 · BART · NMT", "purple")}
        {stack(360, "encoder-only", "BERT · retrievers", "blue")}
        {stack(590, "decoder-only", "GPT · Llama · Claude", "orange")}
      </svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        Same Lego bricks. Three instruction manuals. One ate the planet.
      </figcaption>
    </figure>
  );
}

/* ─────────────────────────────────────────── 8. TRAINING LOOP ── */

export function TrainingLoopDiagram() {
  // forward arrows along the top row; backward path is a clean
  // rectangular loop UNDER the row, with its label safely below it.
  return (
    <figure className="not-prose my-8">
      <svg viewBox="0 0 820 340" width="100%" className="max-w-2xl mx-auto">
        <Defs />

        <Note x={410} y={32} size={11}>~15T tokens · ~$10M – $100M · weeks on thousands of GPUs</Note>

        <Box x={110} y={150} w={140} h={48} fill="yellow">token stream</Box>
        <Box x={310} y={150} w={150} h={48} fill="blue">transformer (bf16)</Box>
        <Box x={510} y={150} w={150} h={48} fill="purple">cross-entropy</Box>
        <Box x={690} y={150} w={100} h={48} fill="green">AdamW</Box>

        {/* forward arrows */}
        <Arrow d="M 180 150 L 235 150" />
        <Arrow d="M 385 150 L 435 150" />
        <Arrow d="M 585 150 L 640 150" />

        {/* backward loop (rectangular, well below the row) */}
        <Arrow d="M 690 174 L 690 250 L 110 250 L 110 174" />

        <Note x={410} y={285} size={11}>backward pass + grad all-reduce across GPUs</Note>
      </svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        Pretraining: shift-by-one, repeat a trillion times.
      </figcaption>
    </figure>
  );
}

/* ─────────────────────────────────────────── 9. ALIGNMENT (RLHF vs DPO) ── */

export function AlignmentPipeline() {
  // top row = full RLHF chain
  // middle row = base → SFT → chat model
  // bottom row = DPO shortcut
  // SFT splits up (to pref data) and down (to DPO loss); both rejoin at "chat model"
  return (
    <figure className="not-prose my-8">
      <svg viewBox="0 0 880 380" width="100%" className="max-w-3xl mx-auto">
        <Defs />

        {/* main column */}
        <Box x={80} y={200} w={100} h={44} fill="yellow">base LM</Box>
        <Box x={220} y={200} w={80} h={44} fill="blue">SFT</Box>
        <Box x={790} y={200} w={130} h={44} fill="blue">chat model</Box>

        {/* RLHF top branch */}
        <Box x={380} y={80} w={140} h={36} fill="purple" font={11}>preference data</Box>
        <Box x={550} y={80} w={130} h={36} fill="purple" font={11}>reward model</Box>
        <Box x={690} y={80} w={80} h={36} fill="orange">PPO</Box>

        {/* DPO bottom branch */}
        <Box x={550} y={320} w={200} h={36} fill="green" font={11}>DPO loss (closed-form)</Box>

        {/* base → SFT */}
        <Arrow d="M 130 200 L 180 200" />

        {/* SFT branches: up to RLHF, down to DPO */}
        <Arrow d="M 260 192 L 310 95" />
        <Arrow d="M 260 208 L 450 312" />

        {/* RLHF chain */}
        <Arrow d="M 450 80 L 485 80" />
        <Arrow d="M 615 80 L 650 80" />

        {/* PPO → chat model */}
        <Arrow d="M 715 98 L 725 185" />

        {/* DPO → chat model */}
        <Arrow d="M 650 320 L 728 216" />

        {/* notes in safe zones */}
        <Note x={550} y={38} size={11}>RLHF · three models in memory · KL leash</Note>
        <Note x={550} y={358} size={11}>DPO · same data, no RM, no rollouts</Note>
      </svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        RLHF (top) vs DPO&apos;s shortcut (bottom). Same destination.
      </figcaption>
    </figure>
  );
}

/* ─────────────────────────────────────────── 10. DECODE LOOP + KV CACHE ── */

export function DecodeLoopKV() {
  // token strip on top → transformer (+ KV cache to its right) → sampler → "mat".
  // the dashed loop-back routes around the FAR right edge so it never crosses
  // the KV cache box.
  return (
    <figure className="not-prose my-8">
      <svg viewBox="0 0 920 440" width="100%" className="max-w-3xl mx-auto">
        <Defs />

        {/* prompt token strip */}
        {["The", "cat", "sat", "on", "the"].map((tok, i) => (
          <Box key={tok} x={120 + i * 78} y={70} w={64} h={32} fill="green" font={11}>{tok}</Box>
        ))}
        <Box x={510} y={70} w={64} h={32} fill="yellow" font={12}>?</Box>

        {/* transformer stack */}
        <Box x={360} y={210} w={400} h={58} fill="blue" font={12}>N transformer blocks (with KV cache)</Box>

        {/* KV cache to the right of the transformer */}
        <Box x={770} y={210} w={150} h={58} fill="purple" font={11}>KV cache (per layer)</Box>

        {/* sampler row */}
        <Box x={360} y={330} w={400} h={44} fill="orange" font={11.5}>
          temperature → top-k → top-p → sample
        </Box>

        {/* sampled token */}
        <Box x={770} y={330} w={150} h={44} fill="yellow" font={12}>&quot;mat&quot;</Box>

        {/* "?" token feeds the transformer */}
        <Arrow d="M 510 86 L 510 181" />

        {/* transformer ↔ KV cache (read + write) */}
        <Arrow d="M 560 203 L 690 203" />
        <Arrow d="M 690 217 L 560 217" />

        {/* transformer → sampler */}
        <Arrow d="M 360 239 L 360 308" />

        {/* sampler → "mat" */}
        <Arrow d="M 560 330 L 690 330" />

        {/* loop-back: "mat" routes around the far-right edge, clear of KV cache */}
        <Arrow d="M 845 330 L 890 330 L 890 38 L 510 38 L 510 54" dashed />

        {/* notes in safe margins */}
        <Note x={770} y={160} size={10}>grows by one row / token / layer</Note>
        <Note x={360} y={405} size={11}>vLLM · SGLang · llama.cpp do this for a living</Note>
        <Note x={770} y={300} size={10}>append → reuse cache → repeat</Note>
      </svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        The autoregressive loop. KV cache is why this is fast.
      </figcaption>
    </figure>
  );
}

/* ─────────────────────────────────────────── 11. MOE ROUTING ── */

export function MoERouter() {
  // token → router → 8 experts (only 2 highlighted) → weighted sum
  return (
    <figure className="not-prose my-8">
      <svg viewBox="0 0 820 400" width="100%" className="max-w-2xl mx-auto">
        <Defs />

        <Box x={90} y={190} w={100} h={44} fill="yellow">token x</Box>
        <Box x={260} y={190} w={130} h={44} fill="purple" font={11.5}>router (softmax)</Box>

        {/* 8 experts as a column */}
        {["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8"].map((e, i) => (
          <Box
            key={e}
            x={470}
            y={50 + i * 36}
            w={80}
            h={26}
            fill={i === 1 || i === 4 ? "green" : "plain"}
            font={11}
          >
            {e}
          </Box>
        ))}

        <Box x={680} y={190} w={120} h={44} fill="orange" font={11.5}>weighted sum</Box>

        {/* token → router → highlighted experts */}
        <Arrow d="M 140 190 L 195 190" />
        <Arrow d="M 325 185 L 430 86" />
        <Arrow d="M 325 195 L 430 194" />

        {/* highlighted experts → weighted sum */}
        <Arrow d="M 510 86 L 620 180" />
        <Arrow d="M 510 194 L 620 195" />

        {/* notes BELOW the experts column so they never sit on top of E8 */}
        <Note x={470} y={360} size={11}>top-2 of N experts fire (here: E2 + E5)</Note>
        <Note x={470} y={378} size={10}>Mixtral 8x7B · DeepSeek-V3 256 + 1</Note>
      </svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        Mixture of Experts: huge total params, only a sliver active per token.
      </figcaption>
    </figure>
  );
}

/* ─────────────────────────────────────────── 12. TEST-TIME COMPUTE ── */

export function TestTimeCompute() {
  // three branches from "hard question", each ending in an outcome.
  // arrows leave from the right edge of the question box and land
  // cleanly on the LEFT edge of each branch box (no slicing through anything).
  return (
    <figure className="not-prose my-8">
      <svg viewBox="0 0 880 360" width="100%" className="max-w-2xl mx-auto">
        <Defs />

        <Note x={500} y={32} size={11}>more inference compute → better answers</Note>

        <Box x={120} y={180} w={150} h={48} fill="yellow">hard question</Box>

        {/* three branches */}
        <Box x={460} y={80} w={200} h={40} fill="blue" font={11.5}>classic LLM (1 pass)</Box>
        <Box x={460} y={180} w={200} h={40} fill="purple" font={11.5}>long internal CoT</Box>
        <Box x={460} y={280} w={200} h={40} fill="green" font={11.5}>sample + verify ×N</Box>

        {/* outcomes */}
        <Box x={780} y={80} w={150} h={40} fill="red" font={11.5}>≈ wrong</Box>
        <Box x={780} y={180} w={150} h={40} fill="green" font={11.5}>often right (o1)</Box>
        <Box x={780} y={280} w={150} h={40} fill="green" font={11.5}>often right (R1)</Box>

        {/* question → three branches (arrows land cleanly on left edges) */}
        <Arrow d="M 195 180 L 360 80" />
        <Arrow d="M 195 180 L 360 180" />
        <Arrow d="M 195 180 L 360 280" />

        {/* branches → outcomes */}
        <Arrow d="M 560 80 L 705 80" />
        <Arrow d="M 560 180 L 705 180" />
        <Arrow d="M 560 280 L 705 280" />
      </svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        The new scaling law: thinking time at inference, not just bigger weights.
      </figcaption>
    </figure>
  );
}
