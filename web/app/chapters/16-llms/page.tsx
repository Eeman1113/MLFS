import { ChapterShell } from "@/components/chapter-shell";
import { ChallengeBox } from "@/components/challenge-box";
import { RunnableCode } from "@/components/runnable-code";
import { Math, tex } from "@/components/math";
import { TokenizerDemo } from "@/components/interactives/tokenizer";
import { AttentionDemo } from "@/components/interactives/attention";
import { SamplingExplorer } from "@/components/interactives/sampling";
import {
  TokenizationFlow,
  EmbeddingPlusPosition,
  AttentionFlow,
  MultiHeadSplit,
  TransformerBlock,
  FullTransformerStack,
  ThreeArchitectures,
  TrainingLoopDiagram,
  AlignmentPipeline,
  DecodeLoopKV,
  MoERouter,
  TestTimeCompute,
} from "@/components/llm-diagrams";

export const metadata = { title: "Ch. 16 · LLMs and All Their Fun Magic · MLFS" };

export default function Page() {
  return (
    <ChapterShell slug="16-llms">
      <p>
        Alright. You&apos;ve made it through fifteen chapters of slowly-but-surely learning the
        actual machinery of machine learning. You can do linear regression by hand. You&apos;ve
        argued with a decision tree. You&apos;ve made a tiny neural net conquer XOR like a
        toddler defeating a Rubik&apos;s Cube.
      </p>
      <p>Now we&apos;re going to build the thing that broke the internet.</p>
      <p>
        <strong>Large Language Models.</strong> ChatGPT. Claude. Gemini. Llama. The reason your
        grandma now knows what an &quot;AI&quot; is. The reason every startup landing page in 2025
        has the word &quot;agent&quot; on it.
      </p>
      <p>
        We&apos;re going to demystify the whole thing. End to end. From the moment you type a word
        into a text box, to the moment a model thinks for forty seconds and gives you back a
        better answer than a junior engineer. No magic. Just a giant tower of multiplications and a
        few extremely clever ideas, stacked taller than they have any right to be.
      </p>
      <p>Buckle up. This one is long. It&apos;s also the best chapter in the book.</p>

      <h2>The Setup: What Even Is an LLM?</h2>
      <p>
        Strip away the marketing and an LLM is one sentence: <em>a giant neural network trained
        to predict the next word in a sequence of words.</em>
      </p>
      <p>
        That&apos;s it. That&apos;s the trick. You feed it &quot;The cat sat on the&quot; and it
        outputs a probability distribution over its vocabulary saying things like:
      </p>
      <ul>
        <li>mat → 38%</li>
        <li>rug → 14%</li>
        <li>couch → 9%</li>
        <li>floor → 7%</li>
        <li>&hellip; (the other ~99,996 tokens)</li>
      </ul>
      <p>
        You sample one. You glue it onto the end. You feed the new string back in and ask for the
        next one. You do that 500 times. Suddenly, you&apos;ve written a poem about regret.
      </p>
      <p>
        That entire output — the essays, the code, the &quot;you&apos;re absolutely right!&quot;
        apologies — is just an autoregressive loop over &quot;guess the next word&quot;, trained
        on basically the whole internet. The trick is in <em>how</em> the guessing works inside.
      </p>
      <p>
        The architecture that made it all possible is called the <strong>Transformer</strong>,
        introduced in a 2017 paper with the unforgettably arrogant title{" "}
        <em>Attention Is All You Need</em>. They were right.
      </p>
      <p>The journey looks like this:</p>
      <ol>
        <li><strong>Tokenize</strong> — turn the input string into integer IDs.</li>
        <li><strong>Embed</strong> — turn each ID into a vector.</li>
        <li><strong>Add positions</strong> — so the model knows what came first.</li>
        <li><strong>Attention</strong> — every token looks at every other token.</li>
        <li><strong>MLP / FFN</strong> — mix it all up some more.</li>
        <li>Stack steps 4 + 5 a few dozen times.</li>
        <li><strong>Unembed</strong> — project back to vocab-size logits.</li>
        <li><strong>Sample</strong> — pick a token. Glue. Repeat.</li>
      </ol>
      <p>That&apos;s the whole show. Let&apos;s build it.</p>

      <h2>Step 1: Tokenization — Why Words Are a Lie</h2>
      <p>
        A neural net does math on numbers. Strings aren&apos;t numbers. So before anything else
        we need to chop the input string into pieces and assign each piece an integer ID. This is
        <strong> tokenization</strong>, and it&apos;s lowkey the most underrated part of the
        whole stack.
      </p>
      <p>You have three options:</p>
      <ul>
        <li><strong>Character-level</strong> — vocab is ~256, but the sequences are huge and the model wastes capacity learning that &quot;th&quot; is common.</li>
        <li><strong>Word-level</strong> — short sequences, but the vocab explodes past a million once you count typos, names, URLs, and every Unicode script ever. Every unknown word becomes <code>&lt;UNK&gt;</code>. Death for code.</li>
        <li><strong>Subword (BPE)</strong> — the sweet spot. Frequent words stay whole, rare words shatter into reusable pieces. Zero OOV ever.</li>
      </ul>
      <p>
        Modern LLMs all use subword. The dominant algorithm is{" "}
        <strong>Byte-Pair Encoding (BPE)</strong>, originally a 1994 compression trick repurposed
        for NLP in 2016. Here&apos;s the algorithm — it&apos;s shockingly simple:
      </p>
      <ol>
        <li>Initialize vocab with every individual byte (0–255).</li>
        <li>Pre-split the corpus into words.</li>
        <li>Count all adjacent symbol pairs.</li>
        <li><strong>Merge the most frequent pair</strong> into a new symbol; add it to the vocab.</li>
        <li>Repeat until vocab hits your target size (say 50,000).</li>
      </ol>
      <p>
        Encoding new text just applies the merges in the same order they were learned. Greedy,
        deterministic, fast.
      </p>

      <TokenizationFlow />

      <p>
        Real-world flavors:
        <strong> SentencePiece</strong> (Google, used by Llama, T5, Gemma) treats input as raw
        Unicode and is language-agnostic.
        <strong> tiktoken</strong> (OpenAI) is a blazing-fast Rust byte-level BPE used by GPT-3.5
        / 4 / 4o.
        Both end up doing roughly the same thing: turn text into a sequence of vocab IDs.
      </p>
      <p>Vocab sizes worth knowing in 2026:</p>
      <ul>
        <li><strong>Llama 2:</strong> 32,000</li>
        <li><strong>Llama 3:</strong> 128,256 (4× bigger — big jump in multilingual and code quality)</li>
        <li><strong>GPT-4 (cl100k_base):</strong> 100,277</li>
        <li><strong>GPT-4o (o200k_base):</strong> 200,019</li>
        <li><strong>Gemma:</strong> 256,000</li>
      </ul>
      <p>
        Bigger vocab = shorter sequences = cheaper inference, but a fatter embedding matrix and
        softmax. There&apos;s a tradeoff and modern models keep edging up.
      </p>

      <h3>The Strawberry Bug</h3>
      <p>
        Ask GPT-4 &quot;how many R&apos;s are in strawberry&quot; and it might confidently say{" "}
        <strong>2</strong>. People treat this as a reasoning failure. It isn&apos;t. It&apos;s a{" "}
        <em>tokenization</em> failure.
      </p>
      <p>
        The word <code>strawberry</code> tokenizes into three opaque chunks like{" "}
        <code>[str, aw, berry]</code>. The model literally never sees individual letters — it
        sees three opaque vocab IDs. Asking it to count R&apos;s is like asking you to count the
        bones in a hot dog you only saw whole and pre-packaged.
      </p>
      <p>Same reason LLMs are bad at:</p>
      <ul>
        <li>Reversing strings.</li>
        <li>Counting syllables.</li>
        <li>Rhyming reliably.</li>
        <li>Arithmetic on really long numbers (each digit can be a separate token, and adjacent digits get glued unpredictably).</li>
      </ul>
      <p>It&apos;s a representation bug, not a reasoning bug. Knowing this distinction makes you about 30% smarter on LLM Twitter.</p>

      <p>Here&apos;s a toy interactive — type anything, watch your sentence shatter:</p>

      <TokenizerDemo />

      <p>And here&apos;s a from-scratch BPE trainer in &lt;25 lines. Run it. Watch merges happen.</p>

      <RunnableCode
        title="bpe.py"
        code={`from collections import Counter

# tiny corpus
corpus = "low low low low low lower lower newest newest newest widest widest widest"

# each word -> tuple of chars + end marker
words = Counter(corpus.split())
words = {tuple(w) + ("</w>",): c for w, c in words.items()}

merges = []
for step in range(8):
    # count adjacent pairs (weighted by word frequency)
    pairs = Counter()
    for word, freq in words.items():
        for i in range(len(word) - 1):
            pairs[(word[i], word[i+1])] += freq
    if not pairs:
        break

    # merge the most frequent pair
    best = max(pairs, key=pairs.get)
    merges.append(best)
    print(f"merge {step+1:>2}: {best[0]!r:>8} + {best[1]!r:<8}  count={pairs[best]}")

    # rebuild the corpus with the merge applied
    new = {}
    for word, freq in words.items():
        out, i = [], 0
        while i < len(word):
            if i < len(word) - 1 and (word[i], word[i+1]) == best:
                out.append(word[i] + word[i+1])
                i += 2
            else:
                out.append(word[i])
                i += 1
        new[tuple(out)] = freq
    words = new

print("\\nfinal vocab pieces:")
for word in words:
    print("  " + " ".join(word))`}
      />

      <p>
        Run that and watch the algorithm <em>discover</em> common pieces like <code>est</code>,{" "}
        <code>er</code>, <code>low</code> all by itself, just by counting. It&apos;s really
        underwhelming once you see it. Which is the point. There&apos;s no magic. The model is
        eating a quietly clever compression scheme.
      </p>

      <h2>Step 2: Embeddings — Tokens Get a Personality</h2>
      <p>
        So we have integer IDs. Great. The model needs vectors. Enter the{" "}
        <strong>embedding matrix</strong>: a giant lookup table of shape{" "}
        <code>(vocab_size × d_model)</code>.
      </p>
      <p>
        Token ID 7842 just means &quot;grab row 7842 from this matrix.&quot; That row is a
        <code> d_model</code>-dimensional vector — typically 768, 4096, or 12288 floats. That
        vector starts random, and through training it becomes the model&apos;s &quot;internal
        representation&quot; of that token. Similar tokens land near each other.
      </p>
      <ul>
        <li><strong>GPT-2 small:</strong> 50,257 × 768</li>
        <li><strong>Llama 3 8B:</strong> 128,256 × 4096</li>
        <li><strong>GPT-3 175B:</strong> 50,257 × 12,288</li>
      </ul>
      <p>
        Mathematically this is equivalent to a one-hot vector times <code>E</code>, but no sane
        person actually does that. You just index: <code>E[token_ids]</code>.
      </p>

      <h3>Positional Encoding — Order Matters, Bro</h3>
      <p>
        Here&apos;s a problem: self-attention is{" "}
        <strong>permutation-equivariant</strong>. Shuffle the input tokens and the output
        shuffles identically. To the model, &quot;dog bites man&quot; and &quot;man bites
        dog&quot; are the same bag of vectors.
      </p>
      <p>
        That&apos;s catastrophic for language. We have to <em>tell</em> the model about order. The
        fix: add a position-dependent vector to each token embedding before it enters the first
        block.
      </p>

      <EmbeddingPlusPosition />

      <p>There have been four good ideas about how to do this:</p>
      <ol>
        <li>
          <strong>Sinusoidal (2017):</strong> a fixed sine/cosine pattern of geometrically-spaced
          frequencies. Low dims tick fast, high dims tick slow — like a multi-resolution clock.
          Intuitive, never needs training.
        </li>
        <li>
          <strong>Learned (BERT, GPT-2):</strong> another <code>(max_seq_len × d_model)</code>{" "}
          matrix, trained from scratch. Flexible but hard-capped at the training length — GPT-2
          dies past 1024 tokens.
        </li>
        <li>
          <strong>RoPE (2021):</strong> the modern winner. Instead of <em>adding</em>, you{" "}
          <em>rotate</em> the Q and K vectors inside attention by an angle that depends on
          position. The math conveniently makes attention scores depend only on{" "}
          <em>relative</em> distance. Used by Llama, Mistral, Qwen, DeepSeek, basically everyone
          good. Extrapolates well and is hackable for long context (NTK scaling, YaRN).
        </li>
        <li>
          <strong>ALiBi (2022):</strong> skip positions entirely. Add a linear penalty{" "}
          <code>-m·|i-j|</code> to attention scores. Simple, extrapolates great. Used by BLOOM
          and MPT.
        </li>
      </ol>

      <p>The original 2017 sinusoidal formula:</p>
      <Math>{tex`\text{PE}(pos, 2i) = \sin\!\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right), \quad \text{PE}(pos, 2i+1) = \cos\!\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)`}</Math>
      <p>Here it is in &lt;15 lines of numpy:</p>

      <RunnableCode
        title="positional_encoding.py"
        code={`import numpy as np

def sinusoidal_pe(seq_len, d_model):
    pos = np.arange(seq_len)[:, None]                       # (L, 1)
    i   = np.arange(d_model)[None, :]                       # (1, D)
    angle_rates = 1.0 / np.power(10000, (2 * (i // 2)) / d_model)
    angles = pos * angle_rates                              # (L, D)
    pe = np.zeros((seq_len, d_model))
    pe[:, 0::2] = np.sin(angles[:, 0::2])                   # even dims
    pe[:, 1::2] = np.cos(angles[:, 1::2])                   # odd dims
    return pe

PE = sinusoidal_pe(seq_len=8, d_model=16)
print("position 0:", np.round(PE[0], 2))
print("position 1:", np.round(PE[1], 2))
print("position 7:", np.round(PE[7], 2))
print("\\nadd to token embeddings: X = token_emb + PE[:seq_len]")`}
      />

      <h2>Step 3: Attention — Everyone Listens to Everyone</h2>
      <p>
        This is the part that won the Turing Award (well, will). It&apos;s the heart of the whole
        machine.
      </p>
      <p>
        The pre-Transformer world used <strong>RNNs</strong> — networks that processed tokens one
        at a time and compressed all of history into a single hidden state. By the time you
        reached token 200, token 3 was a faint smell. Gradients vanished. Memory was a sieve.
      </p>
      <p>
        <strong>Attention</strong>&apos;s pitch: stop compressing. Let every token directly look
        at every other token in the context and pull what it needs. No bottleneck. No forgetting.
        Just a soft database lookup over the entire sequence.
      </p>
      <p>The trick uses three vectors per token, made by three learned matrices:</p>
      <ul>
        <li><strong>Query (Q):</strong> what <em>I</em> am looking for. (&quot;Tall, likes dogs.&quot;)</li>
        <li><strong>Key (K):</strong> what <em>I</em> am advertising. (&quot;I am tall, I like dogs.&quot;)</li>
        <li><strong>Value (V):</strong> what you actually get if matched. (the actual person.)</li>
      </ul>
      <p>
        Yes, attention is essentially a dating app for tokens. A token&apos;s Q gets
        dot-producted against every other token&apos;s K to score compatibility. Softmax turns
        scores into probabilities. Then we mix the V vectors weighted by those probabilities. The
        output is what this token &quot;found&quot; in the context.
      </p>

      <h3>The Formula</h3>
      <p>Given input X of shape (n × d_model), compute:</p>
      <Math>{tex`Q = X W_Q, \quad K = X W_K, \quad V = X W_V \quad \text{each} \in \mathbb{R}^{n \times d_k}`}</Math>
      <p>Then the actual attention operation:</p>
      <Math>{tex`\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{Q K^\top}{\sqrt{d_k}}\right) V`}</Math>

      <AttentionFlow />

      <h3>Why divide by √d_k?</h3>
      <p>
        If Q and K entries are unit-variance, the dot product <code>q·k</code> has variance{" "}
        <code>d_k</code>. So as <code>d_k</code> grows, the scores grow with{" "}
        <code>√d_k</code>. Big scores push softmax into a regime where one entry hits ~1 and
        everything else collapses to ~0, and gradients through softmax die. Scaling by{" "}
        <code>√d_k</code> normalizes variance back to 1 and keeps softmax in its gradient-friendly
        zone. Boring math. Crucial fix.
      </p>

      <h3>Causal Masking — No Peeking</h3>
      <p>
        For a decoder-style LM (GPT, Llama, Claude), token <em>i</em> must not be allowed to
        attend to tokens <em>j &gt; i</em>. Otherwise during training the model just cheats by
        peeking at the next word and we&apos;ve trained an extremely expensive identity function.
      </p>
      <p>
        Fix: before softmax, add a mask matrix with <code>-∞</code> in the upper triangle.
        <code> softmax(-∞) = 0</code>. The future is dark. The encoder side of BERT skips this —
        it&apos;s allowed to look both ways.
      </p>

      <h3>Complexity</h3>
      <p>
        The <code>QKᵀ</code> matmul is <code>O(n² · d_k)</code> time and <code>O(n²)</code>{" "}
        memory. Double the context, quadruple the work. This is why 1M-token context windows are a
        hardware sport, not a software trick. It&apos;s also why FlashAttention, sliding-window
        attention, and linear-attention variants exist.
      </p>

      <p>Here&apos;s the whole thing from scratch in numpy. Read it carefully — every modern LLM does exactly this, just bigger:</p>

      <RunnableCode
        title="attention.py"
        code={`import numpy as np

def softmax(x, axis=-1):
    x = x - x.max(axis=axis, keepdims=True)
    e = np.exp(x)
    return e / e.sum(axis=axis, keepdims=True)

def scaled_dot_product_attention(X, W_Q, W_K, W_V, causal=True):
    Q = X @ W_Q                          # (n, d_k)
    K = X @ W_K
    V = X @ W_V
    d_k = Q.shape[-1]

    scores = Q @ K.T / np.sqrt(d_k)      # (n, n)
    if causal:
        n = scores.shape[0]
        mask = np.triu(np.ones((n, n)), k=1).astype(bool)
        scores[mask] = -1e9              # -inf in upper triangle

    A = softmax(scores, axis=-1)         # rows sum to 1
    return A @ V, A                      # output, attention weights

np.random.seed(0)
n, d = 5, 8
X = np.random.randn(n, d)
W_Q, W_K, W_V = [np.random.randn(d, 4) for _ in range(3)]

out, A = scaled_dot_product_attention(X, W_Q, W_K, W_V)
print("output shape:", out.shape)
print("\\nattention matrix (rows = queries, cols = keys):")
print(np.round(A, 2))
print("\\nnotice the upper triangle is 0 — that's the causal mask")`}
      />

      <p>And here&apos;s a tiny interactive so you can <em>see</em> attention flow on a real sentence:</p>

      <AttentionDemo />

      <h3>A Common Misconception</h3>
      <p>
        Attention weights are not interpretability oracles. A big paper from 2019 (Jain &amp;
        Wallace) showed you can permute attention weights and the model still works. Multiple
        heads, residual streams, and MLPs scramble the &quot;who looked at who&quot; story
        beyond easy reading. Heatmaps are pretty. They are not explanations.
      </p>

      <h2>Step 4: Multi-Head Attention — A Committee of Specialists</h2>
      <p>
        One attention head is forced to do one kind of looking. But &quot;the cat that the dog
        chased&quot; needs syntactic attention (subject-verb), coreference attention
        (pronoun-antecedent), and positional attention all at once.
      </p>
      <p>
        So we run several attention operations in parallel — call them <strong>heads</strong> —
        each with their own Q, K, V projections, each looking at a different subspace. Then we
        concatenate and project back. Same parameter budget, sliced into parallel views.
      </p>

      <MultiHeadSplit />

      <p>Concrete head counts:</p>
      <ul>
        <li><strong>GPT-3 Small:</strong> 12 heads × 64 dim</li>
        <li><strong>GPT-3 175B:</strong> 96 heads × 128 dim</li>
        <li><strong>Llama 3 70B:</strong> 64 query heads</li>
        <li><strong>PaLM 540B:</strong> 48 heads</li>
      </ul>
      <p>
        Probing studies (Clark et al., 2019) found that BERT heads do specialize — some track
        direct objects, others determiners, others coreference. Nobody asked them to. They just
        did.
      </p>

      <h3>MQA, GQA — Saving the KV Cache</h3>
      <p>
        At inference time, the bottleneck isn&apos;t compute. It&apos;s reading the{" "}
        <strong>KV cache</strong> (we&apos;ll explain it in detail later) from GPU memory.
        Multi-head attention stores K and V per head, which is a lot of memory.
      </p>
      <ul>
        <li><strong>MQA (Multi-Query Attention):</strong> keep N query heads but share <em>one</em> K and <em>one</em> V across all of them. KV cache shrinks by N×. Quality dips slightly. Used in PaLM.</li>
        <li><strong>GQA (Grouped-Query Attention):</strong> middle ground. Group the query heads, share one K/V per group. <strong>Llama 2 70B</strong> uses 64 Q heads with 8 KV heads. <strong>Llama 3, Mistral, Mixtral</strong> all use GQA. You get near-MHA quality with near-MQA memory.</li>
      </ul>

      <h3>FlashAttention — Not Math, Plumbing</h3>
      <p>
        Tri Dao&apos;s 2022 paper noticed: attention isn&apos;t slow because of FLOPs, it&apos;s
        slow because you keep shuttling the n×n attention matrix between slow HBM (high-bandwidth
        memory) and fast SRAM on the GPU. <strong>FlashAttention</strong> tiles Q, K, V into
        SRAM-sized blocks and computes softmax incrementally with an &quot;online softmax&quot;
        trick. The n×n matrix is <em>never materialized</em>. Same math. Same gradients. 2–4×
        faster. Sub-quadratic memory.
      </p>
      <p>
        FlashAttention-1 (2022), -2 (2023), -3 (2024 on Hopper async + FP8). It is now what
        every serious framework uses under the hood. You probably never write attention by hand
        in 2026.
      </p>

      <RunnableCode
        title="multi_head_attention.py"
        code={`import numpy as np

def softmax(x, axis=-1):
    x = x - x.max(axis=axis, keepdims=True)
    e = np.exp(x); return e / e.sum(axis=axis, keepdims=True)

def multi_head_attention(X, Wq, Wk, Wv, Wo, h):
    n, d = X.shape
    dk = d // h
    # project, then split into heads
    Q = (X @ Wq).reshape(n, h, dk).transpose(1, 0, 2)   # (h, n, dk)
    K = (X @ Wk).reshape(n, h, dk).transpose(1, 0, 2)
    V = (X @ Wv).reshape(n, h, dk).transpose(1, 0, 2)

    scores = Q @ K.transpose(0, 2, 1) / np.sqrt(dk)     # (h, n, n)
    # causal mask
    mask = np.triu(np.ones((n, n)), k=1).astype(bool)
    scores[:, mask] = -1e9

    A = softmax(scores, axis=-1)
    out = (A @ V).transpose(1, 0, 2).reshape(n, d)      # concat heads
    return out @ Wo

np.random.seed(0)
n, d, h = 6, 32, 4
X = np.random.randn(n, d)
Wq, Wk, Wv, Wo = [np.random.randn(d, d) for _ in range(4)]
print("output shape:", multi_head_attention(X, Wq, Wk, Wv, Wo, h).shape)`}
      />

      <h2>Step 5: The Transformer Block — Lego Brick of Genius</h2>
      <p>
        One attention layer alone is dumb. Stack a bunch of them and add a few accessories and
        you get the actual repeating unit of a Transformer: the <strong>block</strong>.
      </p>
      <p>
        The cleanest way to think about a block (and Anthropic&apos;s interpretability team
        popularized this) is as a <strong>residual stream</strong> — a shared vertical bus
        running through the model. Every block reads from it, computes something, and writes back
        additively. Nothing overwrites — it&apos;s always <code>x = x + something</code>. The
        residual stream is the communication channel. Delete the residual connections and the
        model forgets how to talk to itself.
      </p>

      <TransformerBlock />

      <p>The modern (Llama-style) block does two taps on this bus:</p>
      <ol>
        <li><strong>Normalize</strong> a copy of the current state.</li>
        <li>Run <strong>multi-head attention</strong> on it.</li>
        <li><strong>Add</strong> the result back to the bus.</li>
        <li>Normalize a copy again.</li>
        <li>Run a <strong>feed-forward network (FFN)</strong> on it.</li>
        <li>Add the result back to the bus.</li>
      </ol>

      <h3>Pre-Norm vs Post-Norm</h3>
      <p>
        The original 2017 paper used <strong>post-norm</strong>: <code>x = LayerNorm(x + Sublayer(x))</code>.
        Norm sits <em>outside</em> the residual, so gradients get re-normed every layer. Hard to
        train deep without warmup and careful init.
      </p>
      <p>
        Modern models all use <strong>pre-norm</strong>: <code>x = x + Sublayer(LayerNorm(x))</code>.
        Norm is <em>inside</em>. The residual is a clean highway. Gradients flow back untouched.
        You can train 70B+ models without babysitting the learning rate.
      </p>

      <h3>LayerNorm vs RMSNorm</h3>
      <p>
        <strong>LayerNorm</strong> subtracts the mean, divides by std, applies learned scale and
        bias. <strong>RMSNorm</strong> (2019) drops the mean centering:
      </p>
      <Math>{tex`\text{RMSNorm}(x) = \frac{x}{\sqrt{\frac{1}{d}\sum_i x_i^2 + \epsilon}} \cdot \gamma`}</Math>
      <p>
        Fewer operations, slightly faster, no bias. Empirically just as good. Llama, Mistral,
        Gemma, Qwen all use RMSNorm. It&apos;s one of those quiet upgrades that aged great.
      </p>

      <h3>The FFN — Where Most of the Parameters Actually Live</h3>
      <p>
        Everyone obsesses over attention. But somewhere around <strong>2/3 of a block&apos;s
        parameters</strong> live in the feed-forward network. The classic FFN is two linear
        layers with an activation between them:
      </p>
      <Math>{tex`\text{FFN}(x) = W_2 \cdot \text{GELU}(W_1 x)`}</Math>
      <p>
        The intermediate dimension is typically <strong>4× the hidden dim</strong>. Wide enough
        to mix dimensions and act as a giant key-value memory (Geva et al., 2021 — the FFN
        literally stores facts), narrow enough to fit the compute budget.
      </p>
      <p>
        Modern models swap GELU for <strong>SwiGLU</strong> (Shazeer 2020):
      </p>
      <Math>{tex`\text{SwiGLU}(x) = W_d \cdot \bigl(\text{SiLU}(W_g x) \odot (W_u x)\bigr)`}</Math>
      <p>
        It&apos;s a <em>gated</em> activation — one branch decides how much to let through, the
        other decides what to pass. Three matrices instead of two, so to keep param count
        constant Llama uses the <strong>2/3 trick</strong>: intermediate ≈ <code>(2/3) · 4 · d_model</code>,
        rounded to a multiple of 256.
      </p>
      <p>
        <strong>Llama 3 8B concrete numbers:</strong> <code>hidden_size = 4096</code>,
        <code> intermediate_size = 14336</code>. That&apos;s exactly the (2/3) · 4 ratio,
        rounded. SwiGLU consistently beats GELU by ~0.5–1 perplexity points on equal compute.
      </p>

      <RunnableCode
        title="transformer_block.py"
        code={`import numpy as np

def rms_norm(x, gamma, eps=1e-6):
    rms = np.sqrt((x ** 2).mean(axis=-1, keepdims=True) + eps)
    return (x / rms) * gamma

def silu(x):
    return x * (1.0 / (1.0 + np.exp(-x)))   # SiLU = x * sigmoid(x)

def softmax(x, axis=-1):
    x = x - x.max(axis=axis, keepdims=True)
    e = np.exp(x); return e / e.sum(axis=axis, keepdims=True)

def attention(x, Wq, Wk, Wv, Wo):
    n, d = x.shape
    Q, K, V = x @ Wq, x @ Wk, x @ Wv
    scores = Q @ K.T / np.sqrt(d)
    mask = np.triu(np.ones((n, n)), k=1).astype(bool)
    scores[mask] = -1e9
    return softmax(scores, -1) @ V @ Wo

def swiglu_ffn(x, Wg, Wu, Wd):
    return (silu(x @ Wg) * (x @ Wu)) @ Wd

def block(x, params):
    # pre-norm, then attention, residual add
    x = x + attention(rms_norm(x, params["g1"]),
                      params["Wq"], params["Wk"], params["Wv"], params["Wo"])
    # pre-norm, then SwiGLU FFN, residual add
    x = x + swiglu_ffn(rms_norm(x, params["g2"]),
                       params["Wg"], params["Wu"], params["Wd"])
    return x

np.random.seed(0)
n, d, ff = 5, 32, int((2/3) * 4 * 32)  # ≈ 85
params = {
    "g1": np.ones(d), "g2": np.ones(d),
    "Wq": np.random.randn(d, d) * 0.02, "Wk": np.random.randn(d, d) * 0.02,
    "Wv": np.random.randn(d, d) * 0.02, "Wo": np.random.randn(d, d) * 0.02,
    "Wg": np.random.randn(d, ff) * 0.02, "Wu": np.random.randn(d, ff) * 0.02,
    "Wd": np.random.randn(ff, d) * 0.02,
}
x = np.random.randn(n, d)
print("block in/out shape:", x.shape, "->", block(x, params).shape)
print("a full LLM is just this, 32x or 80x deep.")`}
      />

      <h2>Step 6: Stack &apos;Em Tall — The Whole Transformer</h2>
      <p>
        Now we&apos;ve got a block. The full model is just: <em>tokens → embed → add positions →
        block → block → block → … (N times) → final norm → unembed → softmax over vocab</em>.
      </p>

      <FullTransformerStack />

      <p>
        That&apos;s the whole machine. The depth budget is mostly &quot;how many blocks can you
        afford to train.&quot;
      </p>
      <ul>
        <li><strong>GPT-2 small:</strong> N = 12</li>
        <li><strong>GPT-2 XL:</strong> N = 48</li>
        <li><strong>Llama 3 8B:</strong> N = 32</li>
        <li><strong>Llama 3 70B:</strong> N = 80</li>
        <li><strong>Llama 3.1 405B:</strong> N = 126</li>
      </ul>

      <h3>Three Architectures, One Winner</h3>
      <p>
        Historically there were three transformer flavors, all from the same family of Lego
        bricks but stacked differently:
      </p>

      <ThreeArchitectures />

      <ul>
        <li>
          <strong>Encoder-only (BERT, 2018):</strong> bidirectional attention, masked language
          modeling, output is a tower of contextual vectors that you fine-tune with a head for
          classification, retrieval, etc. Still rules where you need <em>understanding</em>:
          embeddings (SBERT, ColBERT), rerankers, toxicity classifiers. Every vector DB you&apos;ve
          ever used has a BERT-ish model behind it.
        </li>
        <li>
          <strong>Encoder-decoder (T5, BART):</strong> the original 2017 design. Encoder reads,
          decoder generates with cross-attention to the encoder&apos;s output. Still useful for
          translation, summarization. Also: image diffusion models often pair a text encoder
          (CLIP or T5) with a denoising decoder.
        </li>
        <li>
          <strong>Decoder-only (GPT, Llama, Claude, basically everything famous):</strong> just a
          causal LM. One objective: next-token prediction. No special heads, no MLM trickery, no
          cross-attention. The model <em>is</em> the loss.
        </li>
      </ul>
      <p>Decoder-only won because:</p>
      <ol>
        <li><strong>Unified objective.</strong> Translation, summarization, code, math, chat — all just &quot;continue this string.&quot;</li>
        <li><strong>Scalability.</strong> One tensor flow, no encoder/decoder imbalance, dead simple to shard.</li>
        <li><strong>Generation-native.</strong> Sampling falls out for free.</li>
      </ol>
      <p>
        T5 framed everything as text-to-text in 2019; GPT-3 made it dogma in 2020 by proving
        scale + next-token is enough for <em>in-context learning</em>. Show the model a few
        examples in the prompt and it learns the task. No fine-tuning. Just vibes.
      </p>

      <h2>Step 7: Pretraining — From Random Noise to Shakespeare</h2>
      <p>
        So we&apos;ve got the architecture. Now we have to <em>train</em> it. From random weights
        to coherent English is the most absurdly compute-hungry leg of the journey.
      </p>
      <p>The objective is dead simple. Given tokens <code>x₁, x₂, …, x_{`{t-1}`}</code>, predict <code>x_t</code>.</p>
      <Math>{tex`\mathcal{L} = -\frac{1}{N}\sum_{t=1}^{N} \log P_\theta(x_t \mid x_{<t})`}</Math>
      <p>
        That&apos;s it. Cross-entropy on the shifted sequence. No labels, no humans. The text{" "}
        <em>is</em> the label. Supervision is free.
      </p>

      <TrainingLoopDiagram />

      <h3>The Corpora (Where the Tokens Come From)</h3>
      <ul>
        <li><strong>Common Crawl:</strong> petabytes of raw web scrape, ~95% garbage.</li>
        <li><strong>RefinedWeb (Falcon, 2023):</strong> ~5T filtered tokens.</li>
        <li><strong>FineWeb / FineWeb-Edu (HuggingFace, 2024):</strong> 15T tokens, heavy dedup.</li>
        <li><strong>The Pile (EleutherAI, 2020):</strong> 825GB, 22 sources (ArXiv, GitHub, PubMed, Books3).</li>
        <li><strong>Code mixes:</strong> The Stack v2 (~900B tokens), StarCoder data. Code boosts reasoning even on non-code benchmarks. Yes, training on code makes the model better at <em>math</em>.</li>
      </ul>

      <h3>Scale: Numbers That Should Scare You</h3>
      <table>
        <thead>
          <tr><th>Model</th><th>Params</th><th>Training Tokens</th></tr>
        </thead>
        <tbody>
          <tr><td>GPT-3</td><td>175B</td><td>300B</td></tr>
          <tr><td>Llama 2 70B</td><td>70B</td><td>2T</td></tr>
          <tr><td>Llama 3 8B / 70B</td><td>8B / 70B</td><td>15T</td></tr>
          <tr><td>Llama 3.1 405B</td><td>405B</td><td>15.6T</td></tr>
        </tbody>
      </table>
      <p>
        Llama 3.1 405B reportedly used ~3.8 × 10²⁵ FLOPs across <strong>16,000 H100s</strong> for
        ~54 days. An H100 is about $30k. You do the math on what that month cost.
      </p>

      <h3>The Optimizer</h3>
      <p>
        <strong>AdamW</strong> (decoupled weight decay ~0.1, β₁ = 0.9, β₂ = 0.95, ε = 1e-8).
        Learning rate uses linear warmup (~2000 steps) then cosine decay to ~10% of peak. Peak LR
        is around 3e-4 for big models, 6e-4 for smaller ones.
      </p>
      <p>
        Global batches are massive — Llama 3 used ~16M tokens per batch, achieved via gradient
        accumulation across thousands of GPUs.
      </p>

      <h3>Parallelism — The Real Engineering</h3>
      <p>
        A 70B fp32 model needs ~280GB just for weights. An H100 has 80GB. So you split
        <em> everything</em>:
      </p>
      <ul>
        <li><strong>Data parallel (DP):</strong> same model, different data shards.</li>
        <li><strong>Tensor parallel (TP):</strong> split a single matmul across GPUs (Megatron-LM).</li>
        <li><strong>Pipeline parallel (PP):</strong> layers 1–10 on GPU A, 11–20 on B, microbatches keep the assembly line full.</li>
        <li><strong>ZeRO / FSDP:</strong> shard optimizer states, gradients, and weights across the DP ranks.</li>
        <li><strong>3D / 4D parallelism:</strong> stack DP × TP × PP simultaneously. Llama 3 added context parallelism for long sequences. Four axes of pain.</li>
      </ul>
      <p>
        Mixed precision: <strong>bfloat16</strong> in the forward/backward (wider exponent than
        fp16, no loss scaling needed), fp32 master weights and optimizer states.
      </p>

      <h3>Scaling Laws — Chinchilla&apos;s Lesson</h3>
      <p>
        Kaplan et al. (2020) found loss is a power law of compute, params, and data. They
        suggested scaling params faster than data. Two years later DeepMind&apos;s{" "}
        <strong>Chinchilla (2022)</strong> said: <em>actually no</em>. Optimal compute splits
        roughly equally between parameters and tokens — about <strong>20 tokens per
        parameter</strong>. GPT-3 (1.7 tok/param) was wildly under-trained.
      </p>
      <p>
        Modern reality: Llama 3 8B trained on <strong>15T tokens ≈ 1875 tok/param</strong> —
        about 100× past Chinchilla optimum. Why? Training cost is one-time;{" "}
        <strong>inference is forever</strong>. A smaller, over-trained model is cheaper to serve.
        Welcome to economics.
      </p>

      <h3>Are Emergent Abilities Real?</h3>
      <p>
        Wei et al. (2022) claimed certain abilities (multi-step arithmetic, multi-hop reasoning)
        appear suddenly past a scale threshold — phase transitions. Then{" "}
        <strong>Schaeffer et al. (2023)</strong> argued these jumps are artifacts of discontinuous
        metrics (exact-match accuracy). Switch to token-level log-likelihood and the curves are
        smooth. Real capability gain — fake phase transition. The honest answer is somewhere in
        the middle and depends on what you&apos;re measuring.
      </p>

      <RunnableCode
        title="training_loop.py"
        code={`# pseudo-PyTorch sketch of the full pretraining loop. won't actually run
# without a real model / dataset, but every modern trainer is this.

def pretrain(model, corpus_stream, total_steps=500_000, grad_accum=8):
    model = FSDP(model, mixed_precision=bf16_policy)
    optim = AdamW(model.parameters(), lr=3e-4,
                  betas=(0.9, 0.95), weight_decay=0.1)
    sched = cosine_with_warmup(optim, warmup=2000, total=total_steps)

    for step in range(total_steps):
        batch = next(corpus_stream)                      # (B, T) of token IDs
        x, y = batch[:, :-1], batch[:, 1:]               # shift-by-one!

        with bf16_autocast():
            logits = model(x)                            # (B, T, vocab)
            loss = cross_entropy(logits.flatten(0, 1),
                                 y.flatten())
            loss = loss / grad_accum

        loss.backward()

        if (step + 1) % grad_accum == 0:
            clip_grad_norm_(model.parameters(), 1.0)
            optim.step(); sched.step(); optim.zero_grad()

        if step % 1000 == 0:
            print(f"step {step}  loss {loss.item():.3f}")
            checkpoint_if_needed(model, optim)

print("this is a $50M loop. respect.")`}
      />

      <h2>Step 8: Post-training — How a Base Model Becomes a Chat Model</h2>
      <p>
        Pretraining gives you a smart-but-feral model. Show a raw base model{" "}
        <em>&quot;What is the capital of France?&quot;</em> and it might continue with{" "}
        <em>&quot;What is the capital of Germany? What is the capital of Spain?&quot;</em>{" "}
        because the internet has lots of quiz lists. It doesn&apos;t know that it&apos;s supposed
        to be a helpful assistant. That&apos;s on us.
      </p>

      <AlignmentPipeline />

      <h3>Stage 1: SFT (Supervised Fine-Tuning)</h3>
      <p>
        Curate <code>(prompt, ideal_response)</code> pairs and continue training with
        cross-entropy on the response tokens only. Famous datasets:
      </p>
      <ul>
        <li><strong>Alpaca:</strong> 52k instructions, ChatGPT-generated.</li>
        <li><strong>OpenAssistant:</strong> crowd-sourced multi-turn.</li>
        <li><strong>ShareGPT:</strong> scraped ChatGPT logs.</li>
        <li><strong>Dolly, FLAN, etc.</strong></li>
      </ul>
      <p>
        After SFT the model <em>follows instructions</em> but is often bland and
        confidently-wrong, and has no idea what humans <em>prefer</em> among many correct
        answers.
      </p>

      <h3>Stage 2: RLHF — The InstructGPT Recipe</h3>
      <p>OpenAI&apos;s 2022 three-stage pipeline that birthed ChatGPT:</p>
      <ol>
        <li>SFT (above).</li>
        <li>
          <strong>Reward Model (RM).</strong> Show humans two completions A and B, ask which is
          better. Train a scalar-head model with Bradley-Terry loss:
          <Math>{tex`\mathcal{L}_{RM} = -\log \sigma\bigl(r_\phi(x, y_w) - r_\phi(x, y_l)\bigr)`}</Math>
        </li>
        <li>
          <strong>PPO.</strong> Roll out completions from the policy, score with RM, optimize
          with Proximal Policy Optimization plus a KL penalty back to the SFT model so the
          policy doesn&apos;t drift into RM-hacking gibberish:
          <Math>{tex`\mathcal{L}_{PPO} = \mathbb{E}\bigl[r_\phi(x, y) - \beta \cdot \text{KL}(\pi_\theta \,\|\, \pi_{SFT})\bigr]`}</Math>
        </li>
      </ol>
      <p>
        It works, but PPO is a finicky beast — four models in memory (policy, reference, RM,
        value network), unstable, expensive, and tuning β feels like alchemy.
      </p>

      <h3>Stage 2&apos; (the modern shortcut): DPO</h3>
      <p>
        <strong>DPO (Direct Preference Optimization, Rafailov et al. 2023)</strong> ate
        RLHF&apos;s lunch. The math says: if the reward is implicitly defined by the optimal
        policy under KL constraint, you can <em>skip the RM and PPO entirely</em>. Same
        <code> (prompt, chosen, rejected)</code> data. One closed-form loss. Plain supervised
        training. No rollouts. No value function. Stable, cheap, almost-or-better.
      </p>

      <RunnableCode
        title="dpo.py"
        code={`# Direct Preference Optimization loss
# - one closed-form expression
# - no reward model, no PPO, no rollouts
# - same (prompt, chosen, rejected) preference data

import numpy as np

def log_sigmoid(x):
    # numerically stable
    return -np.log1p(np.exp(-np.clip(x, -50, 50)))

def dpo_loss(policy_chosen_logps, policy_rejected_logps,
             ref_chosen_logps,    ref_rejected_logps,
             beta=0.1):
    # how much more does the *policy* prefer chosen over rejected,
    # relative to the frozen *reference* (SFT) model?
    pi_logratio  = policy_chosen_logps  - policy_rejected_logps
    ref_logratio = ref_chosen_logps     - ref_rejected_logps

    # implicit reward margin
    logits = beta * (pi_logratio - ref_logratio)

    # Bradley-Terry on the implicit reward → sigmoid log-loss
    loss = -log_sigmoid(logits).mean()

    # implicit rewards for monitoring
    chosen_reward   = beta * (policy_chosen_logps   - ref_chosen_logps)
    rejected_reward = beta * (policy_rejected_logps - ref_rejected_logps)
    return loss, chosen_reward.mean(), rejected_reward.mean()

# made-up numbers, just to see the shapes
ch_pi,  rj_pi  = np.array([-3.2, -2.8]), np.array([-5.0, -4.2])
ch_ref, rj_ref = np.array([-3.5, -3.0]), np.array([-4.7, -4.1])
print(dpo_loss(ch_pi, rj_pi, ch_ref, rj_ref))`}
      />

      <h3>The Cousins (Briefly)</h3>
      <ul>
        <li><strong>KTO:</strong> only needs (prompt, response, thumbs_up/down). Great for production thumbs data.</li>
        <li><strong>IPO:</strong> fixes DPO&apos;s tendency to overfit on near-deterministic preferences.</li>
        <li><strong>ORPO:</strong> folds SFT and preference learning into one stage, no reference model.</li>
      </ul>

      <h3>Constitutional AI &amp; RLAIF</h3>
      <p>
        <strong>Anthropic&apos;s twist:</strong> replace human labelers with… a model. Write a
        constitution (a list of principles), have an AI critique and revise responses against
        it, train an RM on AI-generated preferences. Scales infinitely, costs pennies, and is
        how Claude gets its manners.
      </p>

      <h3>Synthetic Data Everywhere</h3>
      <p>
        Llama 3&apos;s alignment leaned hard on model-generated SFT and preference data — bigger
        models teaching smaller ones, rejection sampling on outputs of the same model. The new
        normal: humans set the rubric, models do the labeling.
      </p>

      <h3>The Sharp Edges of Alignment</h3>
      <ul>
        <li><strong>Reward hacking:</strong> the model learns RM exploits — overly long, overly hedged, bullet-listed responses, because that&apos;s what the RM scored well in training.</li>
        <li><strong>Sycophancy:</strong> &quot;You&apos;re absolutely right!&quot; — RMs reward agreement, so models agree with everything.</li>
        <li><strong>Model collapse:</strong> train too long on your own outputs and you lose diversity, getting a confident potato.</li>
      </ul>

      <h2>Step 9: Inference — How LLMs Actually Run</h2>
      <p>
        Alright, we&apos;ve trained it. Now someone hits the API. What happens? This is its own
        rabbit hole and it&apos;s where the math meets the GPU.
      </p>

      <DecodeLoopKV />

      <h3>The Decode Loop</h3>
      <p>
        For each new token: forward pass → logits over vocab → apply sampling filters → sample
        one token → append → repeat. Stop on EOS or max_tokens. That&apos;s &quot;ChatGPT&quot;,
        algorithmically.
      </p>

      <h3>Sampling Strategies</h3>
      <ul>
        <li><strong>Greedy / argmax:</strong> always pick the top logit. Deterministic, fast, repetitive (&quot;the the the&quot;).</li>
        <li><strong>Temperature:</strong> divide logits by T before softmax. T &lt; 1 sharpens (boring), T &gt; 1 flattens (chaotic). T → 0 ≈ greedy.</li>
        <li><strong>Top-k:</strong> zero out everything but the k highest-probability tokens, renormalize.</li>
        <li><strong>Top-p (nucleus, Holtzman 2019):</strong> keep the smallest set whose probabilities sum to p. Adapts set size to model confidence.</li>
        <li><strong>Min-p (newer):</strong> keep tokens with <code>p ≥ p_threshold × max_prob</code>. Robust at high temperature.</li>
      </ul>

      <p>Have a play. Watch how the knobs reshape the next-token distribution:</p>

      <SamplingExplorer />

      <p>Here&apos;s the actual sampling step in &lt;25 lines of numpy:</p>

      <RunnableCode
        title="sample_step.py"
        code={`import numpy as np

def sample(logits, temperature=0.8, top_k=40, top_p=0.95):
    # 1. temperature
    logits = logits / max(temperature, 1e-6)

    # 2. top-k filter
    if top_k:
        kth = np.partition(logits, -top_k)[-top_k]
        logits = np.where(logits < kth, -np.inf, logits)

    # 3. stable softmax
    logits -= logits.max()
    probs = np.exp(logits); probs /= probs.sum()

    # 4. top-p (nucleus) filter
    if top_p < 1.0:
        order = np.argsort(-probs)
        cum = np.cumsum(probs[order])
        cutoff = np.searchsorted(cum, top_p) + 1
        keep = order[:cutoff]
        mask = np.zeros_like(probs); mask[keep] = 1
        probs = probs * mask; probs /= probs.sum()

    # 5. sample one token
    return int(np.random.choice(len(probs), p=probs))

np.random.seed(0)
logits = np.random.randn(20) * 2
for _ in range(5):
    print("sampled token id:", sample(logits))`}
      />

      <h3>The KV Cache — The Single Most Important Inference Trick</h3>
      <p>
        Attention at token <em>t</em> needs the K and V vectors for every previous token. If
        you naively recompute them every step, you do <code>O(n²)</code> work <em>per token</em>
        and <code>O(n³)</code> for a full sequence. That&apos;s catastrophic.
      </p>
      <p>
        Fix: <strong>cache K and V</strong>. Each step you only project the new token&apos;s Q,
        K, V; append the new K/V to the cache; attend over the stored cache. Now it&apos;s{" "}
        <code>O(n)</code> per token and <code>O(n²)</code> total.
      </p>
      <p>
        Memory math (fp16): <code>bytes = 2 (K+V) × layers × heads_kv × seq_len × head_dim × 2</code>.
        Llama 3 70B at 8k context: 80 × 8 (GQA) × 8192 × 128 × 4 ≈ <strong>2.7 GB per
        sequence</strong>. The KV cache often dwarfs the weights at long context. This is why
        long context windows are a hardware problem.
      </p>

      <h3>Prefill vs Decode</h3>
      <ul>
        <li><strong>Prefill</strong> processes the whole prompt in one fat parallel matmul. Compute-bound. GPUs love it.</li>
        <li><strong>Decode</strong> generates one token at a time. Memory-bandwidth bound. You stream 70GB of weights from HBM per token; FLOPs are wasted. This is why TTFT (time to first token) and TPOT (time per output token) are completely different metrics.</li>
      </ul>

      <h3>Speculative Decoding</h3>
      <p>
        A small <strong>draft model</strong> proposes γ tokens cheaply, the big{" "}
        <strong>target model</strong> verifies them in one parallel forward pass. Accepted
        prefix is kept; on rejection, resample from the corrected distribution. Output
        distribution is provably identical to the target&apos;s. Typical{" "}
        <strong>2–3× speedup</strong>. Variants: Medusa (multiple decoding heads on the big
        model), EAGLE, lookahead decoding (no draft model).
      </p>

      <h3>Quantization</h3>
      <p>
        Shrink weights from fp16 to int8 / int4 — less HBM traffic, faster decode, smaller
        footprint.
      </p>
      <ul>
        <li><strong>INT8:</strong> nearly lossless, easy.</li>
        <li><strong>GPTQ:</strong> post-training, calibration-based, int4.</li>
        <li><strong>AWQ:</strong> activation-aware, protects salient weights.</li>
        <li><strong>GGUF:</strong> llama.cpp&apos;s container. K-quants like <strong>Q4_K_M</strong> are the local-LLM default — ~4.5 bits per weight, minimal perplexity hit. If you&apos;ve ever run a model on your laptop, you&apos;ve run this.</li>
      </ul>

      <h3>Continuous Batching &amp; PagedAttention</h3>
      <p>
        Static batching wastes GPU when sequences finish at different times. <strong>Continuous
        / in-flight batching</strong> (Orca → vLLM) admits and evicts requests every iteration.
        <strong> PagedAttention</strong> (vLLM) stores the KV cache in fixed-size blocks like OS
        virtual memory pages — no fragmentation, easy prefix-cache sharing across requests.
      </p>
      <p>
        The serving stack as of 2026: <strong>vLLM</strong>, <strong>SGLang</strong>
        (RadixAttention prefix tree), <strong>TGI</strong> (HuggingFace),{" "}
        <strong>TensorRT-LLM</strong> (NVIDIA, fastest on H100). All do paged KV, continuous
        batching, speculative decoding, quantized kernels.
      </p>

      <h2>Step 10: Modern Tricks Worth Knowing</h2>
      <p>
        We&apos;ve covered the spine. Now the upgrades that make 2025-era frontier models work.
      </p>

      <h3>Mixture of Experts (MoE): Big Brain, Small Bill</h3>
      <p>
        Dense transformers waste compute — every token activates every parameter. MoE says:
        replace the FFN with <strong>N experts</strong> (specialized FFN blocks), but per token,
        a tiny <strong>router</strong> picks the <strong>top-k</strong> (usually k=2).
        Parameters scale, FLOPs don&apos;t.
      </p>

      <MoERouter />

      <ul>
        <li><strong>Mixtral 8x7B</strong> (Dec 2023): 8 experts, top-2. <strong>47B total, ~13B active</strong>.</li>
        <li><strong>DeepSeek-V3</strong> (Dec 2024): <strong>671B total, 37B active</strong>, 256 routed experts + 1 shared, top-8.</li>
        <li><strong>GPT-4</strong> is widely believed to be MoE (~8 experts, ~1.8T total per leaks). GPT-4o, Claude 3.5/4, Gemini 1.5/2.0 are all suspected MoE.</li>
      </ul>
      <p>
        Why it works: experts specialize (some on code, some on math, some on languages), and
        you pay compute for a couple, not the whole zoo. The tradeoff: VRAM is huge — you must
        hold <em>all</em> experts in memory even if only two fire per token.
      </p>

      <h3>Long Context: Stretching the Window</h3>
      <p>
        Vanilla attention is <code>O(n²)</code>. Positional encodings break past training
        length. Fixes:
      </p>
      <ul>
        <li><strong>RoPE scaling</strong> — Position Interpolation (Chen 2023) squishes positions linearly; NTK-aware scaling non-linearly preserves high frequencies; <strong>YaRN</strong> (Peng 2023) is best-in-class and what most modern long-context models use.</li>
        <li><strong>Sliding Window Attention</strong> (Mistral) — each token attends to the last W tokens; info flows across layers like a conveyor belt.</li>
        <li><strong>Attention Sinks / StreamingLLM</strong> — keep the first few tokens always in the KV cache. Models dump attention mass there; evicting them collapses quality.</li>
        <li><strong>Gemini 1.5 Pro / 2.0</strong> ship <strong>1M–2M token</strong> context in production. Claude Sonnet 4.5 hits 1M. The bottleneck is now needle-in-haystack recall and KV-cache cost, not training stability.</li>
      </ul>

      <h2>Step 11: Reasoning Models — Models That Actually Think</h2>
      <p>
        And finally, the climax. The thing nobody saw coming until September 2024.
      </p>
      <p>
        For years the scaling story was simple: more parameters + more data + more compute →
        smarter models. Then OpenAI shipped <strong>o1</strong> and rewrote the story.
      </p>

      <TestTimeCompute />

      <h3>Chain-of-Thought</h3>
      <p>
        <strong>Chain-of-Thought (Wei et al., 2022)</strong> — append &quot;Let&apos;s think
        step by step&quot; to a hard math prompt and accuracy jumps. Emergent at scale — barely
        helps small models, transforms big ones. It&apos;s the closest thing to a free lunch in
        LLM-land.
      </p>
      <p>
        <strong>Self-Consistency (Wang et al., 2022)</strong> — sample N CoTs at temperature
        &gt; 0, majority-vote the final answer. Free accuracy points, just spend more compute at
        inference.
      </p>

      <RunnableCode
        title="self_consistency.py"
        code={`# self-consistency: sample N reasoning paths, vote on the final answer.
# this is the cheapest, most powerful test-time-compute trick.

from collections import Counter
import re

def extract_answer(text):
    # toy parser - real ones are regex monsters
    m = re.search(r"answer is\\s*([A-Za-z0-9]+)", text, re.IGNORECASE)
    return m.group(1) if m else None

def self_consistent_answer(prompt, model, n=20, temp=0.8):
    answers = []
    for _ in range(n):
        cot = model.generate(
            prompt + "\\nLet's think step by step.",
            temperature=temp,
            max_tokens=512,
        )
        ans = extract_answer(cot)
        if ans is not None:
            answers.append(ans)
    if not answers:
        return None
    return Counter(answers).most_common(1)[0][0]   # majority vote

# pseudo-usage:
# print(self_consistent_answer("If a train ...", my_model, n=20))`}
      />

      <p>
        Beyond that you get <strong>Tree of Thoughts (Yao 2023)</strong> — branch out partial
        reasoning states, evaluate each, BFS/DFS over the tree. <strong>Graph of Thoughts</strong>{" "}
        generalizes to arbitrary DAGs where thoughts merge and refine.
      </p>

      <h3>Test-Time Compute — The New Scaling Law</h3>
      <p>
        September 2024: OpenAI&apos;s <strong>o1</strong> showed that <em>thinking longer at
        inference time</em> beats just scaling parameters. The model produces a long internal
        chain-of-thought (hidden tokens — you don&apos;t see them), then answers. Accuracy
        scales <strong>log-linearly with thinking tokens</strong> — a brand new axis next to
        data and parameters.
      </p>
      <p>
        How does it learn to think? <strong>RL on verifiable tasks</strong>. Math problems (you
        can check the answer). Code (you can run the tests). Proofs (a verifier checks). The
        model learns to backtrack, plan, doubt itself, self-correct.
      </p>
      <p>The 2025 lineup of reasoning models:</p>
      <ul>
        <li><strong>OpenAI:</strong> o1, o3, o4-mini, GPT-5 with thinking mode.</li>
        <li><strong>Anthropic:</strong> Claude 3.7 / 4 Sonnet with &quot;extended thinking&quot;.</li>
        <li><strong>Google:</strong> Gemini 2.5 Pro &quot;Deep Think&quot;.</li>
        <li><strong>DeepSeek (Jan 2025):</strong> the bomb. Open-weight reasoning model, MIT-licensed.</li>
      </ul>
      <p>
        The shocker from DeepSeek was <strong>R1-Zero</strong> — pure RL with{" "}
        <em>no SFT cold start</em>, and the model spontaneously developed &quot;aha
        moments&quot; mid-thought. They then distilled R1&apos;s long-thinking behavior into
        small models (Qwen-7B, Llama-8B) that punch absurdly above their weight.
      </p>

      <h3>Process Reward Models</h3>
      <p>
        Reasoning RL needs a reward signal. Two flavors:
      </p>
      <ul>
        <li><strong>Outcome Reward Models (ORMs):</strong> score only the final answer. Easy, sparse.</li>
        <li><strong>Process Reward Models (PRMs):</strong> score each reasoning step. Catches &quot;right answer, wrong logic&quot; and &quot;off-by-one in step 4&quot;.</li>
      </ul>
      <p>
        OpenAI&apos;s &quot;Let&apos;s Verify Step by Step&quot; (Lightman 2023) showed PRMs &gt;
        ORMs on MATH. Combined with verifier-guided generation, reflection, and self-critique
        loops — this is the secret sauce.
      </p>

      <h3>Multimodal &amp; Tools (Briefly)</h3>
      <ul>
        <li><strong>Bolted-on vision:</strong> a CLIP/ViT encoder projects images into the LLM&apos;s token space. LLaVA, GPT-4V, Claude 3+.</li>
        <li><strong>Native multimodal:</strong> image, audio, video, text trained together. Gemini 1.5/2.0, GPT-4o (the &quot;o&quot; is omni — speech in, speech out, 200ms latency).</li>
        <li><strong>Function calling</strong> (2023) let models emit structured JSON tool calls.</li>
        <li><strong>MCP — Model Context Protocol</strong> (Anthropic, Nov 2024): the USB-C of tool use. One protocol, any tool plugs into any model.</li>
        <li><strong>Agents:</strong> Claude Code, Devin, Cursor agent, Operator. Chain reasoning + tools + memory into loops that ship real PRs.</li>
      </ul>

      <h2>The Whole Map</h2>
      <p>
        Take a breath. Here&apos;s the full thing, in one mental picture:
      </p>
      <ol>
        <li>
          <strong>Text in</strong> → <em>tokenize</em> (byte-level BPE) →{" "}
          <strong>integer IDs</strong>.
        </li>
        <li><strong>Embed</strong> each ID into a vector.</li>
        <li><strong>Add positions</strong> (sinusoidal / learned / RoPE).</li>
        <li>
          For N blocks: <strong>RMSNorm → multi-head causal attention (with KV cache) →
          residual add → RMSNorm → SwiGLU FFN → residual add</strong>.
        </li>
        <li><strong>Final RMSNorm → unembed → logits over vocab</strong>.</li>
        <li><strong>Sample</strong> (temperature / top-k / top-p) one token.</li>
        <li><strong>Append</strong>. Reuse KV cache. Repeat.</li>
        <li>
          That trained model was: pretrained on 15T tokens of internet, then SFT&apos;d on
          instructions, then DPO&apos;d on preferences, then maybe RL&apos;d to reason.
        </li>
        <li>
          The reasoning variants <em>think first, answer second</em>, scaling accuracy with
          thinking tokens.
        </li>
      </ol>
      <p>
        That&apos;s every chatbot, every code completer, every &quot;AI&quot; on every product
        page in 2026. It really is just one architecture, scaled and dressed up.
      </p>

      <h2>One More Thing: Why You Now Have a Superpower</h2>
      <p>
        Most people on Earth interact with LLMs daily and have absolutely no model of what&apos;s
        happening inside. They think it&apos;s a search engine, or a database, or magic, or a
        conspiracy.
      </p>
      <p>You&apos;ve just spent a long chapter learning that:</p>
      <ul>
        <li>It&apos;s not searching. It&apos;s sampling from a learned probability distribution.</li>
        <li>It doesn&apos;t &quot;know&quot; things — it has compressed patterns from training data into matrix weights.</li>
        <li>The strawberry bug is a tokenization quirk, not a stupidity tax.</li>
        <li>Hallucinations are the model doing the only thing it knows how to do (sample plausible next tokens) when it doesn&apos;t have the answer cached.</li>
        <li>&quot;Context window&quot; is literally how many tokens fit in the KV cache.</li>
        <li>Reasoning models think by generating tokens silently before answering.</li>
        <li>Models hosted &quot;in the cloud&quot; are mostly just GPU racks streaming weights from HBM at 1.5 TB/s.</li>
      </ul>
      <p>
        Knowing how the sausage is made makes you a better user, a better engineer, and a much
        funnier dinner guest.
      </p>

      <ChallengeBox title="The Build-Your-Own-LLM Gauntlet">
        <p>
          The only way to <em>really</em> understand this stack is to stand it up yourself.
          Three challenges in increasing depth — pick one (or all three):
        </p>
        <ol>
          <li>
            <strong>Tiny BPE.</strong> Take the from-scratch BPE trainer above. Train it on the
            first ~1MB of any text file (try the Tiny Shakespeare dataset). Print the first 50
            merges. Then write the <em>encoder</em> — given a new string, apply the merges in
            order and output token IDs. Compare against{" "}
            <code>tiktoken.get_encoding(&quot;cl100k_base&quot;)</code>. Notice how different
            your vocab is — and why.
          </li>
          <li>
            <strong>nanoGPT speedrun.</strong> Clone{" "}
            <code>karpathy/nanoGPT</code>. Train a 2-layer, 64-dim transformer on Tiny
            Shakespeare for 5 minutes on CPU. Sample from it. Watch it write half-coherent
            Shakespearean fragments. <em>You</em> now have a language model. It&apos;s bad. It&apos;s
            yours. That&apos;s the whole game, just smaller.
          </li>
          <li>
            <strong>Sampling vibes.</strong> Take any Hugging Face model that runs on your
            machine (try Qwen2.5-1.5B). Generate the same prompt 5 times with{" "}
            <code>temperature=0</code> (always identical), then with <code>temperature=0.7</code>{" "}
            (varied), then with <code>temperature=1.5</code> (chaos), then with{" "}
            <code>temperature=2.5</code> (gibberish). Then sweep <code>top_p</code> from 0.1 to
            1.0. Develop intuitions for what each knob actually does to output quality. This is
            the single most useful skill for getting good results out of LLMs.
          </li>
        </ol>
        <p>
          When you&apos;ve done these, you know more about LLMs than 99% of people who talk
          about them on the internet.
        </p>
      </ChallengeBox>

      <p>
        That&apos;s a wrap. Thanks for sticking through the longest chapter in the book. You
        started by predicting straight lines with two parameters in Chapter 4. You finish here
        knowing how a model with hundreds of billions of parameters writes essays, codes, draws
        diagrams, plays go, and thinks.
      </p>
      <p>Go build something stupid.</p>
    </ChapterShell>
  );
}
