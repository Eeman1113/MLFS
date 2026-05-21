/** LLM-specific SVG figures for the bonus chapter.
 *  Style: same hand-drawn flowchart vibe as components/flowcharts.tsx —
 *  pastel fills, hairline strokes, viewBox-scaled.
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
  h = 40,
  rx = 6,
  fill = "plain",
  font = 11.5,
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
    markerEnd={head ? "url(#llmarrow)" : undefined}
  />
);

const Defs = () => (
  <defs>
    <marker id="llmarrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" className="fill-foreground" />
    </marker>
  </defs>
);

const Label = ({ x, y, children, size = 10, bold = 600 }: { x: number; y: number; children: React.ReactNode; size?: number; bold?: number }) => (
  <text x={x} y={y} fontSize={size} fontWeight={bold} className="fill-foreground" textAnchor="middle">
    {children}
  </text>
);

const Note = ({ x, y, children, anchor = "middle" as const }: { x: number; y: number; children: React.ReactNode; anchor?: "start" | "middle" | "end" }) => (
  <text x={x} y={y} fontSize={10} className="fill-muted-foreground" textAnchor={anchor}>
    {children}
  </text>
);

/* ─────────────────────────────────────────── 1. TOKENIZATION ── */

export function TokenizationFlow() {
  return (
    <figure className="not-prose my-8">
      <svg viewBox="0 0 720 240" width="100%" className="max-w-3xl mx-auto">
        <Defs />
        <Box x={70} y={120} w={120} h={48} fill="yellow">&quot;strawberry&quot;</Box>
        <Box x={230} y={120} w={120} h={48} fill="blue">pre-tokenizer (regex)</Box>
        <Box x={390} y={120} w={120} h={48} fill="blue">byte-level BPE merges</Box>
        <Box x={560} y={120} w={120} h={48} fill="green">[str, aw, berry]</Box>

        <Arrow d="M 132 120 L 168 120" />
        <Arrow d="M 292 120 L 328 120" />
        <Arrow d="M 452 120 L 498 120" />

        <Box x={560} y={200} w={210} h={32} fill="orange" font={10.5}>[496, 707, 15717] → embedding</Box>
        <Arrow d="M 560 146 L 560 182" />

        <Note x={360} y={32}>raw string → integer IDs (and back)</Note>
        <Note x={360} y={50}>vocab size: GPT-4 ≈ 100k · Llama 3 ≈ 128k · Gemma 256k</Note>
        <Note x={360} y={222}>the model never sees the letter &quot;R&quot; — only three opaque chunks</Note>
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
      <svg viewBox="0 0 640 240" width="100%" className="max-w-2xl mx-auto">
        <Defs />
        <Box x={90} y={70} w={150} h={42} fill="green">token embedding E[id]</Box>
        <Box x={90} y={170} w={150} h={42} fill="purple">positional encoding</Box>
        <Box x={300} y={120} w={50} h={50} rx={25} fill="yellow" font={20}>＋</Box>
        <Box x={490} y={120} w={130} h={50} fill="blue">into block 1</Box>

        <Arrow d="M 165 70 L 270 110" />
        <Arrow d="M 165 170 L 270 130" />
        <Arrow d="M 325 120 L 425 120" />

        <Note x={90} y={102} anchor="middle">vocab × d_model lookup</Note>
        <Note x={90} y={202} anchor="middle">sinusoidal · learned · RoPE · ALiBi</Note>
        <Note x={490} y={158}>same shape, now order-aware</Note>
      </svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        Token embeddings + positions → the input to block 1.
      </figcaption>
    </figure>
  );
}

/* ─────────────────────────────────────────── 3. ATTENTION FLOW ── */

export function AttentionFlow() {
  return (
    <figure className="not-prose my-8">
      <svg viewBox="0 0 760 320" width="100%" className="max-w-3xl mx-auto">
        <Defs />
        <Box x={70} y={160} w={70} h={42} fill="yellow">X</Box>

        <Box x={210} y={70} w={70} h={36} fill="blue">Q = XW_Q</Box>
        <Box x={210} y={160} w={70} h={36} fill="blue">K = XW_K</Box>
        <Box x={210} y={250} w={70} h={36} fill="blue">V = XW_V</Box>

        <Arrow d="M 108 152 L 175 80" />
        <Arrow d="M 108 160 L 175 160" />
        <Arrow d="M 108 168 L 175 240" />

        <Box x={360} y={115} w={130} h={42} fill="purple">Q·Kᵀ / √d_k</Box>
        <Arrow d="M 248 78 L 300 110" />
        <Arrow d="M 248 158 L 300 124" />

        <Box x={500} y={115} w={120} h={42} fill="purple">causal mask</Box>
        <Arrow d="M 426 115 L 442 115" />

        <Box x={640} y={115} w={90} h={42} fill="purple">softmax</Box>
        <Arrow d="M 562 115 L 596 115" />

        <Box x={500} y={230} w={120} h={42} fill="green">attention · V</Box>
        <Arrow d="M 640 138 L 580 215" />
        <Arrow d="M 248 256 L 458 240" />

        <Box x={680} y={230} w={70} h={42} fill="yellow">Y</Box>
        <Arrow d="M 562 230 L 645 230" />

        <Note x={500} y={75}>mask future tokens → -∞</Note>
        <Note x={690} y={85}>row-wise · sums to 1</Note>
        <Note x={500} y={275}>weighted sum of V rows</Note>
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
      <svg viewBox="0 0 720 280" width="100%" className="max-w-2xl mx-auto">
        <Defs />
        <Box x={70} y={140} w={70} h={50} fill="yellow">X</Box>

        {[0, 1, 2, 3].map((i) => {
          const y = 50 + i * 60;
          return (
            <g key={i}>
              <Box x={250} y={y} w={150} h={36} fill={i === 0 ? "blue" : i === 1 ? "purple" : i === 2 ? "green" : "orange"}>
                {`head ${i + 1} (Q,K,V)`}
              </Box>
              <Arrow d={`M 108 138 L 168 ${y}`} />
              <Arrow d={`M 328 ${y} L 410 140`} />
            </g>
          );
        })}

        <Box x={470} y={140} w={110} h={50} fill="yellow">concat</Box>
        <Box x={620} y={140} w={70} h={50} fill="yellow">W_O</Box>
        <Arrow d="M 528 140 L 583 140" />

        <Note x={250} y={28}>each head: own subspace, own Q/K/V</Note>
        <Note x={620} y={195}>back to d_model</Note>
        <Note x={620} y={210}>MHA · MQA · GQA all live here</Note>
      </svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        Multi-head attention: parallel committee, then merge.
      </figcaption>
    </figure>
  );
}

/* ─────────────────────────────────────────── 5. TRANSFORMER BLOCK ── */

export function TransformerBlock() {
  return (
    <figure className="not-prose my-8">
      <svg viewBox="0 0 640 360" width="100%" className="max-w-md mx-auto">
        <Defs />
        {/* residual stream column */}
        <rect x="295" y="30" width="50" height="300" rx="6" className="fill-muted/40 stroke-foreground/30" strokeWidth="1" />
        <Label x={320} y={22}>residual stream</Label>

        <Box x={320} y={60} w={170} h={32} fill="plain" font={10.5}>x (d_model)</Box>

        <Box x={170} y={130} w={100} h={32} fill="purple">RMSNorm</Box>
        <Box x={170} y={180} w={100} h={32} fill="blue">attention</Box>
        <Box x={320} y={210} w={60} h={36} rx={18} fill="yellow" font={18}>＋</Box>

        <Box x={170} y={270} w={100} h={32} fill="purple">RMSNorm</Box>
        <Box x={170} y={320} w={100} h={32} fill="green">SwiGLU FFN</Box>
        <Box x={320} y={330} w={60} h={20} fill="plain" font={9}>(no add yet)</Box>

        <Arrow d="M 295 75 L 230 122" />
        <Arrow d="M 170 148 L 170 162" />
        <Arrow d="M 230 188 L 300 208" />

        <Arrow d="M 295 215 L 230 262" />
        <Arrow d="M 170 288 L 170 302" />
        <Arrow d="M 230 328 L 300 332" />

        <Note x={500} y={140}>read · norm · attend · write</Note>
        <Note x={500} y={290}>read · norm · MLP · write</Note>
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
      <svg viewBox="0 0 520 460" width="100%" className="max-w-md mx-auto">
        <Defs />
        <Box x={260} y={30} w={220} h={32} fill="yellow">token IDs</Box>
        <Box x={260} y={80} w={220} h={32} fill="green">embedding + position</Box>

        {[0, 1, 2, 3, 4].map((i) => (
          <Box key={i} x={260} y={140 + i * 50} w={260} h={36} fill="blue">
            transformer block {i + 1}
          </Box>
        ))}

        <text x={260} y={400} textAnchor="middle" fontSize={13} className="fill-muted-foreground">⋮ (N total)</text>

        <Box x={260} y={430} w={260} h={30} fill="purple">final RMSNorm → logits (vocab)</Box>

        <Arrow d="M 260 46 L 260 64" />
        <Arrow d="M 260 96 L 260 122" />
        {[0, 1, 2, 3].map((i) => (
          <Arrow key={i} d={`M 260 ${158 + i * 50} L 260 ${172 + i * 50}`} />
        ))}
        <Arrow d="M 260 408 L 260 415" />

        <Note x={460} y={140} anchor="end">Llama 3 8B · N=32</Note>
        <Note x={460} y={155} anchor="end">Llama 3 70B · N=80</Note>
      </svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        The whole show: embed → N blocks → unembed.
      </figcaption>
    </figure>
  );
}

/* ─────────────────────────────────────────── 7. THREE ARCHITECTURES ── */

export function ThreeArchitectures() {
  const stack = (x: number, label: string, dir: string, fill: Fill) => (
    <g>
      <Box x={x} y={30} w={130} h={26} fill="yellow" font={10.5}>input</Box>
      {[0, 1, 2].map((i) => (
        <Box key={i} x={x} y={75 + i * 42} w={130} h={32} fill={fill} font={10.5}>
          block {i + 1}
        </Box>
      ))}
      <Box x={x} y={220} w={130} h={26} fill="green" font={10.5}>output</Box>
      <text x={x} y={262} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-foreground">{label}</text>
      <text x={x} y={278} textAnchor="middle" fontSize={9.5} className="fill-muted-foreground">{dir}</text>
    </g>
  );
  return (
    <figure className="not-prose my-8">
      <svg viewBox="0 0 640 300" width="100%" className="max-w-2xl mx-auto">
        <Defs />
        {stack(110, "encoder-decoder", "T5 · BART · NMT", "purple")}
        {stack(320, "encoder-only", "BERT · retrievers", "blue")}
        {stack(520, "decoder-only", "GPT · Llama · Claude", "orange")}
      </svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        Same Lego bricks. Three instruction manuals. One ate the planet.
      </figcaption>
    </figure>
  );
}

/* ─────────────────────────────────────────── 8. TRAINING LOOP ── */

export function TrainingLoopDiagram() {
  return (
    <figure className="not-prose my-8">
      <svg viewBox="0 0 720 280" width="100%" className="max-w-2xl mx-auto">
        <Defs />
        <Box x={100} y={140} w={130} h={42} fill="yellow">token stream</Box>
        <Box x={290} y={140} w={130} h={42} fill="blue">transformer (bf16)</Box>
        <Box x={480} y={140} w={130} h={42} fill="purple">cross-entropy</Box>
        <Box x={620} y={140} w={80} h={42} fill="green">AdamW</Box>

        <Arrow d="M 165 140 L 224 140" />
        <Arrow d="M 355 140 L 414 140" />
        <Arrow d="M 545 140 L 580 140" />
        <Arrow d="M 620 162 L 290 220 L 100 162" />

        <Note x={400} y={210}>backward pass + grad all-reduce across GPUs</Note>
        <Note x={400} y={50}>~15T tokens · ~$10M–$100M · weeks on thousands of GPUs</Note>
      </svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        Pretraining: shift-by-one, repeat a trillion times.
      </figcaption>
    </figure>
  );
}

/* ─────────────────────────────────────────── 9. ALIGNMENT (RLHF vs DPO) ── */

export function AlignmentPipeline() {
  return (
    <figure className="not-prose my-8">
      <svg viewBox="0 0 760 280" width="100%" className="max-w-3xl mx-auto">
        <Defs />
        <Box x={70} y={140} w={90} h={42} fill="yellow">base LM</Box>
        <Box x={210} y={140} w={70} h={42} fill="blue">SFT</Box>

        {/* RLHF top branch */}
        <Box x={350} y={70} w={130} h={36} fill="purple">preference data</Box>
        <Box x={510} y={70} w={130} h={36} fill="purple">reward model</Box>
        <Box x={680} y={70} w={70} h={36} fill="orange">PPO</Box>

        {/* DPO bottom shortcut */}
        <Box x={510} y={210} w={130} h={36} fill="green">DPO loss (closed-form)</Box>

        <Arrow d="M 116 140 L 174 140" />
        <Arrow d="M 246 140 L 280 140" />

        <Arrow d="M 280 130 L 290 90" />
        <Arrow d="M 280 150 L 450 210" />

        <Arrow d="M 415 70 L 444 70" />
        <Arrow d="M 575 70 L 644 70" />
        <Arrow d="M 715 90 L 715 240" dashed />

        <Note x={420} y={48}>three models in memory · KL leash</Note>
        <Note x={510} y={250}>same data, no RM, no rollouts</Note>
        <Note x={750} y={170} anchor="end">→ chat model</Note>
      </svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        RLHF (top) vs DPO&apos;s shortcut (bottom). Same destination.
      </figcaption>
    </figure>
  );
}

/* ─────────────────────────────────────────── 10. DECODE LOOP + KV CACHE ── */

export function DecodeLoopKV() {
  return (
    <figure className="not-prose my-8">
      <svg viewBox="0 0 720 320" width="100%" className="max-w-3xl mx-auto">
        <Defs />
        {/* token strip */}
        <Box x={130} y={40} w={60} h={28} fill="green" font={11}>The</Box>
        <Box x={200} y={40} w={60} h={28} fill="green" font={11}>cat</Box>
        <Box x={270} y={40} w={60} h={28} fill="green" font={11}>sat</Box>
        <Box x={340} y={40} w={60} h={28} fill="green" font={11}>on</Box>
        <Box x={410} y={40} w={60} h={28} fill="green" font={11}>the</Box>
        <Box x={480} y={40} w={60} h={28} fill="yellow" font={11}>?</Box>

        {/* transformer stack */}
        <Box x={335} y={140} w={300} h={50} fill="blue">N transformer blocks (with KV cache)</Box>

        {/* KV cache */}
        <Box x={620} y={140} w={140} h={50} fill="purple" font={10.5}>KV cache (per layer)</Box>
        <Arrow d="M 555 165 L 549 165" head={false} />
        <Arrow d="M 480 60 L 480 115" />
        <Arrow d="M 335 165 L 240 165 L 240 80" />

        {/* sampler */}
        <Box x={335} y={240} w={300} h={42} fill="orange">temperature → top-k → top-p → sample</Box>
        <Arrow d="M 335 190 L 335 219" />
        <Box x={620} y={240} w={140} h={42} fill="yellow">&quot;mat&quot;</Box>
        <Arrow d="M 485 240 L 550 240" />
        <Arrow d="M 620 220 L 540 75" dashed />

        <Note x={620} y={120} anchor="middle">grows by one row / token / layer</Note>
        <Note x={335} y={300}>vLLM · SGLang · llama.cpp do this for a living</Note>
      </svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        The autoregressive loop. KV cache is why this is fast.
      </figcaption>
    </figure>
  );
}

/* ─────────────────────────────────────────── 11. MOE ROUTING ── */

export function MoERouter() {
  return (
    <figure className="not-prose my-8">
      <svg viewBox="0 0 720 280" width="100%" className="max-w-2xl mx-auto">
        <Defs />
        <Box x={80} y={140} w={90} h={42} fill="yellow">token x</Box>
        <Box x={240} y={140} w={110} h={42} fill="purple">router (softmax)</Box>

        {["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8"].map((e, i) => (
          <Box key={e} x={430} y={40 + i * 28} w={70} h={22} fill={i === 1 || i === 4 ? "green" : "plain"} font={10}>
            {e}
          </Box>
        ))}

        <Box x={590} y={140} w={90} h={42} fill="orange">weighted sum</Box>

        <Arrow d="M 130 140 L 184 140" />
        <Arrow d="M 296 140 L 395 70" />
        <Arrow d="M 296 140 L 395 152" />
        <Arrow d="M 470 70 L 545 130" />
        <Arrow d="M 470 152 L 545 150" />

        <Note x={430} y={250}>top-2 of N experts fire</Note>
        <Note x={430} y={266}>Mixtral 8x7B · DeepSeek-V3 256+1</Note>
      </svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        Mixture of Experts: huge total params, only a sliver active per token.
      </figcaption>
    </figure>
  );
}

/* ─────────────────────────────────────────── 12. TEST-TIME COMPUTE ── */

export function TestTimeCompute() {
  return (
    <figure className="not-prose my-8">
      <svg viewBox="0 0 720 260" width="100%" className="max-w-2xl mx-auto">
        <Defs />
        <Box x={90} y={130} w={130} h={42} fill="yellow">hard question</Box>

        <Box x={300} y={50} w={150} h={32} fill="blue">classic LLM (1 pass)</Box>
        <Box x={300} y={130} w={150} h={32} fill="purple">long internal CoT</Box>
        <Box x={300} y={210} w={150} h={32} fill="green">sample + verify ×N</Box>

        <Arrow d="M 155 122 L 265 60" />
        <Arrow d="M 155 130 L 265 130" />
        <Arrow d="M 155 138 L 265 210" />

        <Box x={580} y={50} w={120} h={32} fill="red">≈ wrong</Box>
        <Box x={580} y={130} w={120} h={32} fill="green">often right (o1)</Box>
        <Box x={580} y={210} w={120} h={32} fill="green">often right (R1)</Box>

        <Arrow d="M 380 50 L 520 50" />
        <Arrow d="M 380 130 L 520 130" />
        <Arrow d="M 380 210 L 520 210" />

        <Note x={360} y={26}>more inference compute → better answers</Note>
      </svg>
      <figcaption className="text-center mt-2 text-xs text-muted-foreground italic">
        The new scaling law: thinking time at inference, not just bigger weights.
      </figcaption>
    </figure>
  );
}
