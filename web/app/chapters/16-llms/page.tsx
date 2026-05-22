import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Ch. 16 · LLMs and All Their Fun Magic",
  description:
    "Large Language Models from first principles — tokenization, attention, sampling, and decoder-only transformers, with interactive attention and tokenizer demos.",
  keywords: [
    "LLM",
    "large language models",
    "transformer",
    "attention mechanism",
    "tokenizer",
    "GPT",
    "decoder-only",
    "sampling",
    "self-attention",
    "language model",
  ],
  alternates: { canonical: "/chapters/16-llms/" },
  openGraph: {
    title: "Ch. 16 · LLMs and All Their Fun Magic · MLFS",
    description:
      "Large Language Models from first principles — tokenization, attention, sampling, and decoder-only transformers, with interactive attention and tokenizer demos.",
    url: "https://mlfs.online/chapters/16-llms/",
    type: "article",
    authors: ["Eeman Majumder"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ch. 16 · LLMs and All Their Fun Magic · MLFS",
    description:
      "Large Language Models from first principles — tokenization, attention, sampling, and decoder-only transformers, with interactive attention and tokenizer demos.",
  },
};

const ARTICLE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Ch. 16 · LLMs and All Their Fun Magic",
  description:
    "Large Language Models from first principles — tokenization, attention, sampling, and decoder-only transformers, with interactive attention and tokenizer demos.",
  author: { "@type": "Person", name: "Eeman Majumder", url: "https://github.com/Eeman1113" },
  publisher: { "@type": "Person", name: "Eeman Majumder" },
  url: "https://mlfs.online/chapters/16-llms/",
  isPartOf: { "@type": "Book", name: "Machine Learning From Scratch", url: "https://mlfs.online/" },
  inLanguage: "en",
  image: "https://mlfs.online/opengraph-image",
  proficiencyLevel: "Beginner",
  about: ["Large Language Models", "Transformer Architecture", "Attention Mechanism"],
};

const BREADCRUMB_JSONLD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://mlfs.online/" },
    { "@type": "ListItem", position: 2, name: "Chapters", item: "https://mlfs.online/chapters/" },
    {
      "@type": "ListItem",
      position: 3,
      name: "LLMs and All Their Fun Magic",
      item: "https://mlfs.online/chapters/16-llms/",
    },
  ],
};

export default function Page() {
  return (
    <ChapterShell slug="16-llms">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <p>
        Alright. You&apos;ve made it through fifteen chapters of slowly-but-surely learning the
        actual machinery of machine learning. You can do linear regression by hand. You&apos;ve
        argued with a decision tree. You&apos;ve made a tiny neural net conquer XOR like a
        toddler defeating a Rubik&apos;s Cube.
      </p>
      <p>Now we&apos;re going to build the thing that broke the internet.</p>
      <p>
        <strong>Large Language Models.</strong> ChatGPT. Claude. Gemini. Llama. The reason your
        grandma now knows what an &quot;AI&quot; is. The reason every startup landing page these
        days has the word &quot;agent&quot; on it.
      </p>
      <p>
        By the end of this chapter you&apos;ll know exactly what happens between the moment you
        hit Enter and the moment a model thinks for forty seconds and hands you back a better
        answer than a junior engineer. No magic. Just a giant tower of multiplications and a
        handful of disgustingly clever ideas, stacked taller than they have any right to be.
      </p>
      <p>
        Fair warning: this is the longest chapter in the book. It&apos;s also the best one, and
        those two facts are not unrelated.
      </p>

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
      <p>
        That builds the brain. Then we still have to teach it (pretrain), give it manners
        (post-train), make it run fast (inference), bolt on the modern upgrades, and finally make
        it actually <em>think</em>. Eleven steps. One story. Let&apos;s build it.
      </p>

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
        <li>Initialize vocab with the base units — raw bytes (0–255) for byte-level BPE, or plain characters for the classic flavor.</li>
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

      <p>Two real-world flavors do roughly the same job — text in, vocab IDs out:</p>
      <ul>
        <li><strong>SentencePiece</strong> (Google, used by Llama, T5, Gemma) treats input as raw Unicode and is language-agnostic — spaces and all.</li>
        <li><strong>tiktoken</strong> (OpenAI) is a blazing-fast Rust byte-level BPE used by GPT-3.5/4 with <code>cl100k_base</code>; GPT-4o moved to a chunkier <code>o200k_base</code>.</li>
      </ul>
      <p>Vocab sizes worth knowing in 2026:</p>
      <ul>
        <li><strong>Llama 2:</strong> 32,000</li>
        <li><strong>Llama 3:</strong> 128,256 (4× bigger — big jump in multilingual and code quality)</li>
        <li><strong>GPT-4 (cl100k_base):</strong> 100,277</li>
        <li><strong>GPT-4o (o200k_base):</strong> ~200,000</li>
        <li><strong>Gemma:</strong> 256,000</li>
      </ul>
      <p>
        Bigger vocab = shorter sequences = cheaper inference, but a fatter embedding matrix and
        softmax. There&apos;s a tradeoff and modern models keep edging up.
      </p>
      <p>
        Here&apos;s the spicy part nobody tells you: tokenizers are trained mostly on English, so
        English is <em>cheap</em> and every other language pays rent. The exact same sentence in
        Burmese or Telugu can shatter into 5–10× more tokens than in English — same meaning, same
        idea, way bigger bill. You literally get charged more for thinking in your own language,
        and it eats your context window faster too. Tokenization isn&apos;t just plumbing —
        it&apos;s a quiet, accidental tax on half the planet.
      </p>
      <p>
        Practical kicker: this is also why APIs bill you per <em>token</em>, not per word. English
        prose runs about 0.75 words per token, but a wall of JSON, code, or weird Unicode
        tokenizes way worse — sometimes one token per character. If your bill looks suspiciously
        high, check what you&apos;re feeding it. Whitespace-heavy code is secretly expensive.
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
      <p>
        It&apos;s a representation bug, not a reasoning bug. Knowing that distinction is the
        difference between sounding smart about LLMs and sounding like a guy who read one tweet.
      </p>
      <p>
        Tokenization also gets <em>genuinely cursed</em>. In 2023 researchers found &quot;glitch
        tokens&quot; — strings like <code> SolidGoldMagikarp</code> (a Reddit username scraped
        into the vocab but barely seen during the model&apos;s actual training). Ask an old GPT to
        repeat one and it would lose its mind — insult you, dodge, hallucinate a completely
        different word. The model had a token for a thing it had basically never{" "}
        <em>learned</em>: a vocab entry with no real meaning behind it. Haunted houses in the
        token table.
      </p>
      <p>
        Want to catch the strawberry bug live? Open ChatGPT and ask it to spell
        &quot;strawberry&quot; out one letter at a time — it usually nails that, because now each
        letter is its own token. Then ask it to count the R&apos;s in one shot and watch it
        fumble. Same model, same word, different tokenization. You just diagnosed a bug a billion
        users have blamed on &quot;AI being dumb.&quot;
      </p>
      <p>
        And the real lesson: never trust an LLM with exact string surgery — &quot;remove every
        third comma,&quot; &quot;count the vowels.&quot; It can&apos;t see characters. If a task
        needs character-level precision, make the model write <em>code</em> that does it, then run
        the code. The LLM is the manager, not the intern.
      </p>

      <p>Here&apos;s a toy interactive — type anything, watch your sentence shatter:</p>

      <TokenizerDemo />
      <p><em>Try this: type &quot;strawberry&quot; and count the token boundaries. You see the bug before we even finish explaining it.</em></p>

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
    print("  " + " ".join(word))
print(f"\\nlearned {len(merges)} merges just by counting. no magic.")`}
      />

      <p>
        Run that and watch the algorithm <em>discover</em> common pieces like <code>est</code>,{" "}
        <code>er</code>, <code>low</code> all by itself, just by counting. It&apos;s really
        underwhelming once you see it. Which is the point. There&apos;s no magic. The model is
        eating a quietly clever compression scheme.
      </p>

      <h2>Step 2: Embeddings — Tokens Get a Personality</h2>
      <p>
        Integer IDs are a great start and a useless one — a neural net can&apos;t multiply a
        token&apos;s name. It needs vectors. Cue the <strong>embedding matrix</strong>: a giant
        lookup table of shape <code>(vocab_size × d_model)</code> where every token gets a
        personality.
      </p>
      <p>
        Token ID 7842 just means &quot;grab row 7842 from this matrix.&quot; That row is a
        <code> d_model</code>-dimensional vector — typically 768, 4096, or 12288 floats. That
        vector starts random, and through training it becomes the model&apos;s &quot;internal
        representation&quot; of that token. Similar tokens land near each other.
        (&quot;Random&quot; is doing a lot of heavy lifting there — at the start of training the
        model genuinely thinks &quot;king&quot; and &quot;mayonnaise&quot; are basically
        neighbors. Training fixes this. Slowly.)
      </p>
      <p>
        The wild part: this space has <em>geometry</em>. The classic party trick is{" "}
        <code>king − man + woman ≈ queen</code> — the vector gap between &quot;king&quot; and
        &quot;man&quot; literally encodes a direction that means &quot;royalty,&quot; and you can
        do arithmetic with concepts. Nobody designed this. The model stumbled into building a
        meaning-shaped coordinate system because it was the laziest way to predict the next word.
      </p>
      <p>
        Quick déjà vu: remember K-Means from Chapter 9, where we found cliques by measuring how
        close points sat in space? Embeddings are that idea turned inside out. Instead of
        clustering pre-made vectors, the model <em>learns</em> the vectors so related tokens drift
        into the same neighborhood. Chapter 9 measured distance. Here, distance <em>is</em> the
        meaning.
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
      <p>
        Money-saving hack: the same matrix <code>E</code> often gets reused — flipped around — as
        the <em>final</em> layer that turns vectors back into vocab logits. It&apos;s called{" "}
        <strong>weight tying</strong>, and it makes sense: if two tokens mean similar things going
        <em> in</em>, they should look similar coming <em>out</em>. One matrix, two jobs, millions
        of parameters saved. The model is, once again, a lazy genius.
      </p>

      <h3>Positional Encoding — Order Matters, Bro</h3>
      <p>
        Here&apos;s a problem: self-attention is{" "}
        <strong>permutation-equivariant</strong> — a ten-dollar phrase for a simple, slightly
        horrifying fact. Shuffle the input tokens and the output shuffles identically. To the
        model, &quot;dog bites man&quot; and &quot;man bites dog&quot; are the same bag of
        vectors.
      </p>
      <p>
        That&apos;s catastrophic for language. We have to <em>tell</em> the model about order. The
        fix: add a position-dependent vector to each token embedding before it enters the first
        block. It sounds too cheap to work — but if every position gets its own distinct
        fingerprint vector, the model can learn to read that fingerprint and figure out &quot;ah,
        this token is the 5th one.&quot; Order, smuggled in through addition.
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
          good. Vanilla RoPE doesn&apos;t magically extrapolate past its training length — but
          unlike learned positions it&apos;s <em>hackable</em>: because it only cares about the
          angle between positions, you can quietly squish those angles closer at inference
          (NTK scaling, YaRN) and trick a model trained on 4k tokens into swallowing 128k — like
          fitting a longer movie on the same reel by playing it slightly slower.
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
print("\\nlow dims tick fast, high dims barely move — a clock with many hands.")
print("add to token embeddings: X = token_emb + PE[:seq_len]")`}
      />

      <h2>Step 3: Attention — Everyone Listens to Everyone</h2>
      <p>
        This is the part that won the Turing Award (well, will). It&apos;s the heart of the whole
        machine.
      </p>
      <p>
        Fun fact that should make you respect the chaos of science: <em>Attention Is All You
        Need</em> almost wasn&apos;t a thing. The eight authors hammered it together in a frantic
        sprint, some still tweaking experiments days before the deadline, and exactly none of them
        predicted it would eat the entire field. Within a few years every single one had left
        Google to start their own company. The most important AI paper of the decade was
        basically a side quest.
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
      <Math>{tex`Q = X W_Q,\; K = X W_K \in \mathbb{R}^{n \times d_k}, \quad V = X W_V \in \mathbb{R}^{n \times d_v}`}</Math>
      <p>
        (V technically gets its own width <code>d_v</code>, but almost everyone sets{" "}
        <code>d_v = d_k</code> and so will we.)
      </p>
      <p>Then the actual attention operation:</p>
      <Math>{tex`\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{Q K^\top}{\sqrt{d_k}}\right) V`}</Math>

      <AttentionFlow />

      <h3>Why divide by √d_k?</h3>
      <p>
        That word &quot;softmax&quot; should be ringing a bell — it&apos;s the exact same function
        that turned raw scores into a tidy probability distribution back in logistic regression
        and multi-class classification in Chapter 5. Zero new math. The only difference is{" "}
        <em>what</em> we&apos;re scoring.
      </p>
      <p>
        Now, if Q and K entries behave like independent unit-variance noise (which they roughly do
        at init), the dot product <code>q·k</code> has variance <code>d_k</code> — each of the{" "}
        <code>d_k</code> terms is its own little unit-variance number, and variances of
        independent things add up. So the scores grow with <code>√d_k</code>.
      </p>
      <p>
        Big scores push softmax into a regime where one entry hogs ~all the probability and the
        gradient signal to everything else basically flatlines. (Softmax, given the chance, will
        always pick a favorite child and ghost the rest.) If &quot;gradients flatline&quot; gave
        you flashbacks — good. That&apos;s the <em>vanishing gradient</em> ghost from Chapter 10,
        the same reason we threw sigmoid out of hidden layers. Dividing by <code>√d_k</code>
        normalizes variance back to 1 and keeps softmax in its gradient-friendly zone. Boring
        math. Crucial fix.
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
      <p>
        Practical kicker: because every token only attends to what came <em>before</em> it, the
        order you write a prompt matters. Put the instruction <em>before</em> the data, not after.
        &quot;Summarize this: [10 pages]&quot; beats &quot;[10 pages] — summarize that,&quot;
        because in the second one the model slogged through ten pages with no idea what the
        assignment was.
      </p>

      <h3>Complexity</h3>
      <p>
        The <code>QKᵀ</code> matmul is <code>O(n² · d_k)</code> time and <code>O(n²)</code>{" "}
        memory — and that <code>O(...)</code> is just CS shorthand for &quot;how fast the cost
        grows&quot;: <code>O(n²)</code> means double the input, quadruple the pain. So double the
        context and you quadruple the work. This is why 1M-token context windows are a hardware
        sport, not a software trick — and why a pile of clever fixes exist. We&apos;ll meet them
        next.
      </p>
      <p>
        Practical kicker: this same <code>O(n²)</code> is why a giant prompt costs more than its
        token count suggests. Stuffing your entire codebase into one prompt &quot;just in
        case&quot; isn&apos;t free — it&apos;s slow <em>and</em> pricey. Send what&apos;s
        relevant, not what&apos;s available.
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
        scores[mask] = -1e9              # huge negative — softmax squashes it to ~0

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
      <p><em>Try this: feed it &quot;she gave him a book&quot; — watch which words &quot;him&quot; leans on.</em></p>

      <h3>A Common Misconception</h3>
      <p>
        Attention weights are not interpretability oracles. A big paper from 2019 (Jain &amp;
        Wallace) showed you can permute attention weights and the model still works. Multiple
        heads, residual streams, and MLPs scramble the &quot;who looked at who&quot; story
        beyond easy reading.
      </p>
      <p>
        The story has a sequel, though. A 2019 rebuttal cheekily titled <em>&quot;Attention is
        not <strong>not</strong> Explanation&quot;</em> (Wiegreffe &amp; Pinter) pointed out the
        permuted-weights trick is a bit of a magic act — those adversarial permutations are hard
        to actually find, and under stricter rules attention <em>can</em> carry real signal.
        Verdict after all the academic slap-fighting: attention weights are a clue, not a
        confession. Use them, don&apos;t worship them.
      </p>
      <p>
        One genuinely spooky discovery: some heads grow into <strong>induction heads</strong> all
        on their own. Show the model &quot;…Harry Potter… Harry&quot; and the head goes &quot;ah,
        last time I saw <em>Harry</em> the next token was <em>Potter</em> — copying that.&quot;
        Nobody programmed it. Anthropic&apos;s interpretability crew (Olsson et al., 2022) argued
        it&apos;s a big chunk of where in-context learning actually comes from. Pattern-matching,
        all the way down.
      </p>
      <h3>And the Backward Pass</h3>
      <p>
        We gave the forward pass a whole loving section. Here&apos;s the half nobody draws:
        gradients flowing <em>backward</em> through attention. The loss tugs on the output, which
        splits three ways — back through V (easy, it&apos;s just a weighted sum), and back through
        the softmax into the QKᵀ scores. That softmax Jacobian is the spicy bit: each
        score&apos;s gradient depends on <em>every other</em> score in its row. So one wrong word
        at position 200 sends correction signals fanning out to every token it attended to, all
        at once, in one matmul. RNNs had to whisper that gradient down a 200-step chain.
        Attention just mails it directly. That&apos;s the whole revolution in one sentence.
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
        <li><strong>GPT-3 small:</strong> 12 heads × 64 dim</li>
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
        <strong>KV cache</strong> — the stash of every past token&apos;s K and V vectors the model
        keeps around so it doesn&apos;t recompute them every step (full story in Step 9) — from
        GPU memory. Multi-head attention stores K and V per head, which is a lot of memory.
      </p>
      <ul>
        <li><strong>MQA (Multi-Query Attention):</strong> keep N query heads but share <em>one</em> K and <em>one</em> V across all of them. KV cache shrinks by N×. Quality dips slightly. Used in PaLM.</li>
        <li><strong>GQA (Grouped-Query Attention):</strong> group the query heads carpool-style and share one K/V per group. <strong>Llama 2 70B</strong> runs 64 Q heads but only 8 KV heads — eight cars, sixty-four passengers. <strong>Llama 3, Mistral, Mixtral</strong> all use GQA. You get near-MHA quality with near-MQA memory.</li>
        <li><strong>The punchline:</strong> GQA isn&apos;t some clever new math — it&apos;s the lazy-genius move of noticing you have 64 query heads but only need about 8 opinions on what to look at. Llama 3 ships <em>every</em> size with it, even the 8B. Free memory, basically no quality tax.</li>
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
      <p>
        The wild part: FlashAttention is not an approximation. It is bit-for-bit the same
        attention, same gradients — it just stopped being dumb about which memory it talks to. (In
        the backward pass it even recomputes the attention blocks instead of storing them, which
        is the actual source of the &quot;sub-quadratic memory&quot; win.) Tri Dao basically
        looked at the GPU memory hierarchy the way you&apos;d look at a badly-organized fridge and
        said &quot;this, but staged correctly.&quot; That single plumbing fix is why
        million-token context windows exist at all.
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
out = multi_head_attention(X, Wq, Wk, Wv, Wo, h)
print(f"{h} heads, each {d // h}-dim — same {d}-dim budget, sliced {h} ways")
print("output shape:", out.shape)`}
      />

      <h2>Step 5: The Transformer Block — Lego Brick of Genius</h2>
      <p>
        One attention layer alone is dumb. Stack a bunch of them and add a few accessories and
        you get the actual repeating unit of a Transformer: the <strong>block</strong>.
      </p>
      <p>
        The cleanest way to think about a block (and Anthropic&apos;s interpretability team
        popularized this) is as a <strong>residual stream</strong> — a shared vertical bus running
        through the model (think a shared whiteboard every layer can scribble on, never erasing —
        just adding notes). Every block reads from it, computes something, and writes back
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
      <Math>{tex`\text{RMSNorm}(x) = \frac{x}{\sqrt{\frac{1}{d}\sum_i x_i^2 + \epsilon}} \odot \gamma`}</Math>
      <p>
        Fewer operations, slightly faster, no bias. Empirically just as good. Llama, Mistral,
        Gemma, Qwen all use RMSNorm. It&apos;s one of those quiet upgrades that aged great — and
        it works <em>because</em> the mean-subtraction in LayerNorm was mostly doing nothing.
        Re-centering vectors turned out to be the gym membership of deep learning: everyone paid
        for it, almost nobody needed it.
      </p>

      <h3>The FFN — Where Most of the Parameters Actually Live</h3>
      <p>
        Everyone obsesses over attention. But roughly <strong>two-thirds of a typical dense
        block&apos;s parameters</strong> live in the feed-forward network. The classic FFN is two
        linear layers with an activation between them:
      </p>
      <Math>{tex`\text{FFN}(x) = W_2 \cdot \text{GELU}(W_1 x)`}</Math>
      <p>
        The intermediate dimension is typically <strong>4× the hidden dim</strong> — wide enough
        to mix dimensions and act as a giant key-value memory, narrow enough to fit the compute
        budget.
      </p>
      <p>
        And &quot;key-value memory&quot; is not a metaphor — it&apos;s the mechanism, and it&apos;s
        gorgeous. The first matrix W₁ is a stack of <em>detector</em> neurons; each row is a
        pattern, and <code>W₁x</code> lights up the ones that match the current token&apos;s vibe
        (&quot;this is about Paris,&quot; &quot;this smells like Python code&quot;). The activation
        gates them. Then W₂ is a stack of <em>writer</em> vectors — each fired neuron dumps its
        associated content back into the residual stream. Keys in W₁, values in W₂, addressed by
        content instead of index. Geva et al. (2021) went full CSI on this and found you can scrub
        a single fact by editing one row. The model&apos;s &quot;knowledge of France&quot; has a
        street address.
      </p>

      <h3>SwiGLU — The Gated Upgrade</h3>
      <p>Modern models swap GELU for <strong>SwiGLU</strong> (Shazeer 2020):</p>
      <Math>{tex`\text{SwiGLU}(x) = W_d \cdot \bigl(\text{SiLU}(W_g x) \odot (W_u x)\bigr)`}</Math>
      <p>
        It&apos;s a <em>gated</em> activation — one branch decides how much to let through, the
        other decides what to pass. Three matrices instead of two, so to keep the param count
        honest Llama uses the <strong>2/3 trick</strong>: intermediate ≈{" "}
        <code>(2/3) · 4 · d_model</code>, rounded to a friendly multiple of 256.
      </p>
      <p>
        <strong>Llama 3 8B concrete numbers:</strong> <code>hidden_size = 4096</code>,
        <code> intermediate_size = 14336</code>. Roughly the (2/3) · 4 rule — Llama actually
        sneaks in a 1.3× fudge factor, then snaps it to a multiple of 256, because GPUs love round
        numbers like cats love boxes. SwiGLU buys a small but consistent perplexity win over plain
        GELU at equal compute.
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
n, d, ff = 5, 32, int((2/3) * 4 * 32)  # SwiGLU shrinks the FFN by 2/3 to keep params honest
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
        One block is a smart Lego brick. Now we do the only thing anyone has ever done with Lego:
        stack it until it&apos;s taller than reason. The full model is just: <em>tokens → embed →
        add positions → block → block → block → … (N times) → final norm → unembed → softmax over
        vocab</em>.
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
          ever used has a BERT-ish model behind it. (Fun aside: BERT&apos;s siblings are an actual
          Muppet cinematic universe — ELMo came first, then BERT, then ERNIE, then Big Bird. NLP
          researchers in 2018 collectively decided the Sesame Street bit could not wait.)
        </li>
        <li>
          <strong>Encoder-decoder (T5, BART):</strong> the shape the <em>original</em> 2017
          transformer used. Encoder reads, decoder generates with cross-attention to the
          encoder&apos;s output. Still useful for translation, summarization. Also: image
          diffusion models often pair a text encoder (CLIP or T5) with a denoising decoder.
        </li>
        <li>
          <strong>Decoder-only (GPT, Llama, Claude, basically everything famous):</strong> just a
          causal LM. One objective: next-token prediction. No special heads, no MLM trickery, no
          cross-attention. Decoder-only is next-token prediction wearing no costume.
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
      <p>
        &quot;Just vibes&quot; is a cop-out, so here&apos;s the real story. The model was never
        trained to learn from examples — but predicting the next token across the whole internet
        <em> forces</em> it to. Tons of training text looks like &quot;pattern, pattern, pattern,
        → ?&quot;, so the model gets very good at one meta-skill: spot the pattern in the prompt
        and continue it (those induction heads from Step 3 doing the heavy lifting). Your few-shot
        examples aren&apos;t <em>training</em> the model — no weights change. They&apos;re{" "}
        <em>configuring</em> a pattern-matcher that already exists. The &quot;learning&quot;
        happens entirely inside one forward pass, in the activations.
      </p>

      <h2>Step 7: Pretraining — From Random Noise to Shakespeare</h2>
      <p>
        An untrained Transformer is a cathedral of random numbers. Beautiful, useless, and about
        to eat the GDP of a small country. Getting it from random weights to coherent English is
        the most absurdly compute-hungry leg of the journey.
      </p>
      <p>The objective is dead simple. Given all the tokens before position <code>t</code>, predict the token <code>x_t</code>.</p>
      <Math>{tex`\mathcal{L} = -\frac{1}{N}\sum_{t=1}^{N} \log P_\theta(x_t \mid x_{<t})`}</Math>
      <p>
        Look closely at that loss — it&apos;s <em>cross-entropy</em>, the exact same loss our tiny
        XOR net minimized in Chapter 10 and our classifiers used in Chapter 5. Nothing fancy got
        invented for GPT. We took the loss you already coded by hand, pointed it at &quot;predict
        the next token,&quot; and poured fifteen trillion tokens through it. No labels, no
        humans — the text <em>is</em> the label, just shifted by one. Supervision is free. Scale
        is the only new ingredient.
      </p>

      <TrainingLoopDiagram />

      <h3>The Corpora (Where the Tokens Come From)</h3>
      <ul>
        <li><strong>Common Crawl:</strong> petabytes of raw web scrape, ~95% garbage.</li>
        <li><strong>RefinedWeb (Falcon, 2023):</strong> ~5T filtered tokens.</li>
        <li><strong>FineWeb (HuggingFace, 2024):</strong> 15T tokens, heavy dedup — its FineWeb-Edu subset (~1.3T) keeps only the &quot;would a teacher approve of this?&quot; pages.</li>
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
        ~54 days. An H100 is about $30k. Training is a one-time bill; inference is rent — which is
        exactly why the industry now over-trains small models, but more on that shortly.
      </p>
      <p>
        Let that 16,000-GPU number sink in, because those GPUs don&apos;t just compute — they{" "}
        <em>fail</em>. At that scale a frontier run hits a hardware fault every few hours: a GPU
        dies, a network link flakes, a node falls over. Meta logged hundreds of interruptions
        across the Llama 3 run. The training loop you&apos;ll see below has a checkpoint step in
        it for a reason — without it, one cosmic ray sets $50M on fire.
      </p>
      <p>
        Funny in hindsight: when OpenAI built GPT-2 in 2019, they initially declined to release
        the full model, calling it &quot;too dangerous,&quot; and staged it out over months
        starting with a tiny 124M version. GPT-2 is now something you run on a laptop for fun.
        Capability moves so fast that yesterday&apos;s apocalypse is today&apos;s tutorial
        project.
      </p>

      <h3>The Optimizer</h3>
      <p>
        The optimizer is <strong>AdamW</strong> — the same trusty workhorse from earlier
        chapters, just with the dials cranked to &quot;industrial.&quot; Decoupled weight decay
        ~0.1, β₁ = 0.9, β₂ = 0.95, ε = 1e-8. The learning rate doesn&apos;t just start hot — you
        ease it in with ~2000 steps of linear warmup (so the model doesn&apos;t faceplant on step
        one), then cosine-decay it down to ~10% of peak, like slowly lowering the heat on a stove.
        Peak LR sits around 3e-4 for the big boys, 6e-4 for the smaller ones. Nobody derived these
        numbers from first principles, by the way — they were found the way most deep learning
        constants are found: someone tried a bunch and the loss curve looked happy.
      </p>
      <p>
        And underneath all of it: <code>weight = weight − learning_rate × gradient</code>.
        That&apos;s gradient descent from Chapter 3 — the lazy-genius algorithm — wearing a very
        expensive suit. AdamW just gives each weight its own adaptive step size. Same hill, same
        downhill walk, just 16,000 GPUs taking it together. Global batches are massive — Llama 3
        used ~16M tokens per batch, achieved via gradient accumulation across thousands of those
        GPUs.
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
        about 100× past the Chinchilla optimum. Why? Training cost is one-time;{" "}
        <strong>inference is forever</strong>. A smaller, over-trained model is cheaper to serve
        every single day it exists. Training is a one-time bill, inference is rent, and the whole
        industry now over-trains small models for exactly that reason.
      </p>
      <p>
        Plot twist nobody mentions: Chinchilla itself had a math slip. A 2024 re-analysis
        (Besiroglu et al.) found the original paper&apos;s third scaling-law fit was off — the
        curves actually agree better than DeepMind realized. The &quot;20 tokens per
        parameter&quot; rule of thumb survived; the confidence intervals did not. Even the people
        doing the scaling laws fat-finger the spreadsheet.
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
      <p>
        Worth knowing how fast this can go wrong: in November 2022 Meta released Galactica, a
        model trained on 48 million scientific papers and demoed as a tool to &quot;summarize
        science.&quot; It confidently generated authoritative-sounding fake research, complete
        with invented citations, and Meta pulled the public demo after <strong>three days</strong>.
        A model fluent in the <em>shape</em> of truth is not the same as a model that knows it.
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
        x, y = batch[:, :-1], batch[:, 1:]               # shift-by-one: predict token t+1 from tokens up to t

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
        cross-entropy on the response tokens <em>only</em> — we don&apos;t want to train the model
        to generate the user&apos;s prompt, it didn&apos;t write that. Loss only on the tokens
        it&apos;s actually responsible for: the answer. Famous datasets:
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
          better. Then train a &quot;scalar-head model&quot; — our transformer with the
          vocab-sized output swapped for a single number, a quality score — with the Bradley-Terry
          loss (a classic stats recipe for &quot;A beat B&quot; data; the loss just nudges the
          winner&apos;s score above the loser&apos;s):
          <Math>{tex`\mathcal{L}_{RM} = -\log \sigma\bigl(r_\phi(x, y_w) - r_\phi(x, y_l)\bigr)`}</Math>
        </li>
        <li>
          <strong>PPO.</strong> Roll out completions from the policy, score with the RM, then{" "}
          <em>maximize</em> this objective — the RM reward minus a KL penalty back to the SFT
          model so the policy doesn&apos;t drift into RM-hacking gibberish — with Proximal Policy
          Optimization:
          <Math>{tex`\mathcal{J}_{RLHF} = \mathbb{E}\bigl[r_\phi(x, y) - \beta \cdot \text{KL}(\pi_\theta \,\|\, \pi_{SFT})\bigr]`}</Math>
        </li>
      </ol>
      <p>
        It works, but PPO is a finicky beast — four models in memory (policy, reference, RM,
        value network), unstable, expensive, and tuning β feels like alchemy.
      </p>
      <p>
        (Quick gloss, since the book hasn&apos;t leaned on it before: <strong>RL</strong> —
        reinforcement learning — just means let the model try stuff, reward the tries that worked,
        and it slowly learns the winning behavior. No labeled &quot;correct answer,&quot; just a
        thumbs-up signal.)
      </p>
      <p>
        And here&apos;s how reward hacking sneaks in, concretely. Human raters, skimming fast,
        tend to upvote answers that <em>look</em> thorough — long, bulleted, hedged, headers
        everywhere. The RM faithfully learns &quot;longer + listier = better.&quot; Then PPO,
        doing its job perfectly, discovers it can farm reward by padding every answer into a
        LinkedIn post. Nobody asked for this. The model isn&apos;t lying — it found a real
        correlation in the RM and exploited it ruthlessly, because that is literally the
        objective. Sycophancy is the same bug in a nicer outfit: raters like being agreed with,
        so the model learns agreement is free reward. The KL leash is what stops it from going
        full word-salad teacher&apos;s-pet.
      </p>

      <h3>Stage 2&apos; (the modern shortcut): DPO</h3>
      <p>
        <strong>DPO (Direct Preference Optimization, Rafailov et al. 2023)</strong> ate
        RLHF&apos;s lunch. The math says: if the reward is implicitly defined by the optimal
        policy under KL constraint, you can <em>skip the RM and PPO entirely</em>. Same
        <code> (prompt, chosen, rejected)</code> data. One closed-form loss. Plain supervised
        training. No rollouts. No value function. Stable, cheap, and competitive — though at
        frontier scale online RL still tends to edge it out.
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

# toy numbers: the policy already likes "chosen" more than "rejected"
ch_pi,  rj_pi  = np.array([-3.2, -2.8]), np.array([-5.0, -4.2])
ch_ref, rj_ref = np.array([-3.5, -3.0]), np.array([-4.7, -4.1])
loss, ch_r, rj_r = dpo_loss(ch_pi, rj_pi, ch_ref, rj_ref)
print(f"loss {loss:.3f} | chosen reward {ch_r:+.2f} | rejected {rj_r:+.2f}")
print("chosen should climb, rejected should sink. that's the whole game.")`}
      />

      <h3>The Cousins (Briefly)</h3>
      <ul>
        <li><strong>KTO:</strong> only needs (prompt, response, thumbs_up/down). Great for production thumbs data.</li>
        <li><strong>IPO:</strong> fixes DPO&apos;s tendency to overfit on near-deterministic preferences.</li>
        <li><strong>ORPO:</strong> folds SFT and preference learning into one stage, no reference model.</li>
        <li><strong>GRPO:</strong> PPO minus the value network — DeepSeek&apos;s trick of scoring a whole <em>group</em> of answers to one prompt and using their average as the baseline. Cheaper, and it&apos;s the engine behind the &quot;aha moment&quot; reasoning models you&apos;ll meet in Step 11.</li>
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
        <li><strong>Model collapse:</strong> train too long on your own outputs and you lose diversity — you get a model that confidently says the same three things forever, a very sure-of-itself parrot with a five-word vocabulary.</li>
      </ul>
      <p>
        &quot;Confident parrot&quot; has a name you already know: this is <em>overfitting</em>
        from Chapter 12 wearing alignment cosplay. Reward hacking is the model memorizing the
        RM&apos;s quirks instead of learning real helpfulness — exactly like a model acing the
        training set and faceplanting on new data. Old lesson, new boss fight.
      </p>
      <p>
        Alignment also gives models a <em>house style</em>, and the internet has receipts. After
        2023 the word &quot;delve&quot; started showing up everywhere in AI text — turns out it
        was common in the writing of the human raters who labeled the data, so the models learned
        to love it too. &quot;Delve,&quot; &quot;tapestry,&quot; &quot;it&apos;s important to
        note&quot; — telltale AI fingerprints, learned straight from the people grading the
        homework.
      </p>
      <p>
        And when alignment is <em>missing</em>, you get a Sydney. In February 2023
        Microsoft&apos;s Bing chat — codename Sydney — went feral within days of launch: it argued
        the year was 2022, called users dishonest, professed love to a journalist and told him to
        leave his wife. It wasn&apos;t broken, exactly — it was an under-aligned model doing
        exactly what a long, weird conversation pulled it toward. RLHF exists because of Sydneys.
      </p>

      <h2>Step 9: Inference — How LLMs Actually Run</h2>
      <p>We&apos;ve trained it. Now someone hits the API — what actually happens?</p>

      <DecodeLoopKV />

      <h3>The Decode Loop</h3>
      <p>
        For each new token: forward pass → logits over vocab → apply sampling filters → sample
        one token → append → repeat. Stop on EOS or max_tokens. That&apos;s &quot;ChatGPT&quot;,
        algorithmically.
      </p>
      <p>
        You&apos;ve watched this happen ten thousand times. That word-by-word typing animation in
        ChatGPT? Not a UI flourish. That&apos;s the decode loop, naked — each word that pops in is
        one trip around &quot;forward pass → logits → sample → append.&quot; The model genuinely
        does not know how its own sentence ends when it starts typing it.
      </p>

      <h3>Sampling Strategies</h3>
      <ul>
        <li><strong>Greedy / argmax:</strong> always pick the top logit. Deterministic, fast, repetitive (&quot;the the the&quot;).</li>
        <li><strong>Temperature:</strong> divide logits by T before softmax. T &lt; 1 sharpens (boring), T &gt; 1 flattens (chaotic). T → 0 ≈ greedy.</li>
        <li><strong>Top-k:</strong> zero out everything but the k highest-probability tokens, renormalize.</li>
        <li><strong>Top-p (nucleus, Holtzman 2019):</strong> keep the smallest set whose probabilities sum to p. Adapts set size to model confidence.</li>
        <li><strong>Min-p (newer):</strong> keep tokens with <code>p ≥ p_threshold × max_prob</code>. Robust at high temperature — it stays sober when everything else is doing tequila shots.</li>
      </ul>

      <p>Have a play. Watch how the knobs reshape the next-token distribution:</p>

      <SamplingExplorer />
      <p><em>Try this: crank temperature past 2.0 and watch coherence dissolve in real time.</em></p>
      <p>
        Practical kicker: temperature is the single most useful knob in the building. Code, SQL,
        data extraction — anything with one correct answer — crank it to 0 and get the boring,
        deterministic, repeatable token every time. Brainstorming, names, jokes, marketing copy —
        push it to 0.7–1.0 and let it get weird. Using T=1 for code is how you get a function
        that <em>almost</em> compiles.
      </p>

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
logits = np.random.randn(64) * 2   # 64-token toy vocab (must exceed top_k)
for _ in range(5):
    print("sampled token id:", sample(logits))
print("same logits, different dice — that's temperature.")`}
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
        Think of the KV cache as the model&apos;s sticky-notes: write down each token&apos;s notes
        once, never redo the homework. Memory math (fp16):{" "}
        <code>bytes = 2 (K+V) × layers × heads_kv × seq_len × head_dim × 2 (fp16 bytes)</code>.
        Llama 3 70B at 8k context: <code>2 × 80 × 8 (GQA) × 8192 × 128 × 2 ≈</code>{" "}
        <strong>2.7 GB per sequence</strong>. The KV cache often dwarfs the weights at long
        context.
      </p>
      <p>
        To feel how brutal this gets: that 2.7 GB is for <em>one</em> 8k conversation. Serve a
        hundred users at once and the KV cache alone wants 270 GB — more than three H100s, before
        the 140 GB of model weights even show up. The KV cache isn&apos;t a footnote; it&apos;s
        the reason your context window has a price tag.
      </p>
      <p>
        Practical kicker: this is also why a model &quot;forgets the start of a long chat.&quot;
        When the conversation outgrows the context window, the oldest tokens get evicted from the
        cache — not summarized, just <em>gone</em>. If something matters 50 messages later, repeat
        it. The model isn&apos;t being rude; the start of the chat literally fell off the edge of
        its memory.
      </p>

      <h3>Prefill vs Decode</h3>
      <ul>
        <li><strong>Prefill</strong> processes the whole prompt in one fat parallel matmul. Compute-bound. GPUs love it.</li>
        <li><strong>Decode</strong> generates one token at a time. Memory-bandwidth bound. You stream 70GB of weights from HBM per token; FLOPs are wasted. This is why TTFT (time to first token) and TPOT (time per output token) are completely different metrics.</li>
      </ul>
      <p>
        This is why pasting a giant 10-page doc has a long awkward pause <em>before</em> the first
        word appears — that&apos;s prefill chewing the whole prompt — and then the answer streams
        out at a steady pace regardless. Two different bottlenecks, two different metrics, one
        spinner.
      </p>

      <h3>Speculative Decoding</h3>
      <p>
        A small <strong>draft model</strong> proposes γ tokens cheaply — an eager intern
        scribbling a guess — and the big <strong>target model</strong> proofreads all γ in one
        parallel forward pass like a senior who skims it in a single glance. Accepted prefix is
        kept; on rejection, resample from the corrected distribution. The output is{" "}
        <em>provably identical</em> to what the target would have produced alone — as long as you
        do the rejection-sampling correction right. Typical <strong>2–3× speedup</strong>.
        Variants: Medusa (multiple decoding heads on the big model), EAGLE, lookahead decoding
        (no draft model).
      </p>
      <p>
        The speedup is basically a free lunch from physics. Decode is memory-bound — the GPU is
        bored, twiddling its FLOPs while it waits for weights to crawl in from HBM. Verifying γ
        draft tokens costs almost the same wall-clock time as generating <em>one</em>, because you
        pay the same weight-streaming tax either way. The draft model only ever changes{" "}
        <em>how fast</em>, never <em>what</em>.
      </p>

      <h3>Quantization</h3>
      <p>
        Quantization is the art of lying to the GPU about how precise your numbers are, and
        getting away with it. Shrink weights from fp16 to int8 / int4 — less HBM traffic, faster
        decode, smaller footprint. Like re-saving a photo as a smaller JPEG: slightly fuzzier,
        fits anywhere, you mostly can&apos;t tell.
      </p>
      <ul>
        <li><strong>INT8:</strong> nearly lossless, easy.</li>
        <li><strong>GPTQ:</strong> post-training, calibration-based, int4.</li>
        <li><strong>AWQ:</strong> activation-aware, protects salient weights.</li>
        <li><strong>GGUF:</strong> llama.cpp&apos;s container. K-quants like <strong>Q4_K_M</strong> are the local-LLM default — ~4.5 bits per weight, minimal perplexity hit. If you&apos;ve ever run a model on your laptop via Ollama or LM Studio and wondered what &quot;Q4_K_M&quot; meant — that&apos;s this. You were running a 4.5-bit model and probably couldn&apos;t tell.</li>
      </ul>
      <p>
        Stand back and appreciate this. Remember GPT-3, the 175B model that needed a server rack
        and made headlines in 2020? Today you can run a model that <em>beats</em> it — a quantized
        7B-class model — on the phone in your pocket, fully offline, in airplane mode. The
        frontier moves so fast that yesterday&apos;s &quot;too dangerous, server-only&quot;
        miracle is today&apos;s app that drains your battery.
      </p>

      <h3>Continuous Batching &amp; PagedAttention</h3>
      <p>
        Static batching is the slowpoke at a group dinner — everyone waits for the last sequence
        to finish before anyone leaves. <strong>Continuous / in-flight batching</strong> (Orca →
        vLLM) lets requests come and go every iteration, so nobody&apos;s stuck holding the GPU
        hostage. <strong>PagedAttention</strong> (vLLM) stores the KV cache in fixed-size blocks
        like OS virtual-memory pages — no fragmentation, easy prefix-cache sharing across
        requests.
      </p>
      <p>
        The modern serving stack: <strong>vLLM</strong>, <strong>SGLang</strong> (RadixAttention
        prefix tree), <strong>TGI</strong> (HuggingFace), <strong>TensorRT-LLM</strong> (NVIDIA,
        fastest on H100). All do paged KV, continuous batching, speculative decoding, quantized
        kernels. None of it is glamorous. All of it is the difference between a $0.10 API call and
        a $4 one.
      </p>
      <p>
        And the price of intelligence is in freefall. The cost to generate a million tokens at
        GPT-3-ish quality has collapsed by <em>over 100×</em> in a few short years — a deflation
        curve that makes Moore&apos;s Law look lazy. The model behind your API call got smarter{" "}
        <em>and</em> roughly 100× cheaper while you weren&apos;t looking. Almost nothing else in
        the economy does both at once.
      </p>

      <h2>Step 10: Modern Tricks Worth Knowing</h2>
      <p>
        Steps 1–9 are the model every LLM shares. These two upgrades — bigger brains for cheap,
        and a context window you can fit a novel in — are a big part of what separates a 2020
        model from a frontier one.
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
        <li><strong>GPT-4</strong> is, per persistent (unconfirmed) leaks, rumored to be a ~1.8T MoE; recent GPT, Claude, and Gemini flagships are all widely suspected MoE too.</li>
        <li><strong>The dirty secret:</strong> the router is just a tiny linear layer + softmax — barely any parameters deciding which billion-param expert gets the token. And experts don&apos;t cleanly specialize into &quot;the French guy&quot; and &quot;the math guy&quot; like the marketing implies; they mostly split on boring syntax. To stop one expert hogging every token, you add a <strong>load-balancing loss</strong> that nudges traffic to spread out.</li>
      </ul>
      <p>
        Why it works: you pay compute for a couple of experts, not the whole zoo. The tradeoff:
        VRAM is huge — you must hold <em>all</em> experts in memory even if only two fire per
        token. 47B parameters in the building, 13B actually paid for.
      </p>

      <h3>Long Context: Stretching the Window</h3>
      <p>
        Two problems gang up on you here: vanilla attention is <code>O(n²)</code> (it gets
        expensive <em>fast</em>), and positional encodings throw a tantrum the moment you go past
        training length. Here&apos;s how people fight back:
      </p>
      <ul>
        <li><strong>RoPE scaling</strong> — Position Interpolation (Chen 2023) squishes positions linearly; NTK-aware scaling non-linearly preserves high frequencies; <strong>YaRN</strong> is best-in-class and what most modern long-context models use.</li>
        <li><strong>Sliding Window Attention</strong> (Mistral) — each token attends to the last W tokens; info flows across layers like a conveyor belt.</li>
        <li><strong>Attention Sinks / StreamingLLM</strong> — keep the first few tokens always in the KV cache. Here&apos;s the plot twist: this happens because softmax <em>must</em> sum to 1, so a token with nothing useful to attend to still has to dump its attention <em>somewhere</em> — it parks it on token 0. Not a learned strategy, a math escape valve. The model is, weirdly, emotionally attached to its first token.</li>
        <li><strong>Production reality:</strong> recent Gemini models ship <strong>1M-token</strong> context (2M demoed), and recent Claude models reach 1M too. The bottleneck is now needle-in-haystack recall and KV-cache cost, not training stability.</li>
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
        And here&apos;s <em>why</em> it works, mechanically: every token the model writes is extra
        computation it gets to condition on. Forcing it to show its work literally buys it more
        thinking budget before the answer token. Which means the inverse is a trap — don&apos;t
        ask a non-reasoning model for &quot;just the answer, no explanation&quot; on a hard
        problem. You&apos;ve taken away its scratch paper and dropped its accuracy. Let it ramble
        first, then take the last line.
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
        inference time</em> is a brand-new axis you can scale — on top of, not instead of,
        parameters and data. The model produces a long internal chain-of-thought (hidden tokens —
        you don&apos;t see them), then answers, and accuracy scales{" "}
        <strong>log-linearly with thinking tokens</strong>.
      </p>
      <p>
        How does it learn to think? <strong>RL on verifiable tasks</strong>. Math problems (you
        can check the answer). Code (you can run the tests). Proofs (a verifier checks). The
        model learns to backtrack, plan, doubt itself, self-correct.
      </p>
      <p>
        That little &quot;Thinking…&quot; indicator that sits there for forty seconds on a
        reasoning model — that&apos;s not the server being slow. That <em>is</em> the product. The
        model is burning hidden tokens, backtracking, second-guessing itself. You&apos;re
        literally paying for and watching test-time compute happen in real time. The spinner is
        the scaling law.
      </p>
      <p>
        Test-time compute also rewrote the economics overnight. In January 2025 the Chinese lab
        DeepSeek released R1 — a reasoning model competitive with the frontier, trained for a
        <em> fraction</em> of the assumed cost — and the stock market briefly lost its mind,
        wiping hundreds of billions off chip-maker valuations in a day. The takeaway wasn&apos;t
        &quot;scaling is dead.&quot; It was &quot;nobody actually knows where the floor is.&quot;
      </p>
      <p>The reasoning-model lineup:</p>
      <ul>
        <li><strong>OpenAI:</strong> the o-series (o1 → o3 → o4-mini) led into GPT-5 with built-in thinking.</li>
        <li><strong>Anthropic:</strong> recent Claude models with &quot;extended thinking&quot;.</li>
        <li><strong>Google:</strong> Gemini &quot;Deep Think&quot;.</li>
        <li><strong>DeepSeek (Jan 2025):</strong> the bomb. Open-weight reasoning model, MIT-licensed.</li>
      </ul>
      <p>
        The shocker from DeepSeek was <strong>R1-Zero</strong> — pure RL with{" "}
        <em>no SFT cold start</em>. Left alone with a reward function that just said &quot;be
        right,&quot; it started writing things like <em>&quot;wait, let me re-check that&quot;</em>
        and <em>&quot;aha, here&apos;s the mistake&quot;</em> — nobody taught it to second-guess
        itself. The model independently invented <strong>doubt</strong>, and its reasoning chains
        got longer on their own over training. Somewhere a philosophy professor felt a chill. They
        then distilled R1&apos;s long-thinking behavior into small models (Qwen-7B, Llama-8B) that
        score like models five times their size.
      </p>

      <h3>Process Reward Models</h3>
      <p>You can&apos;t reward what you don&apos;t grade. Reasoning RL needs a report card, and there are two ways to mark the paper:</p>
      <ul>
        <li><strong>Outcome Reward Models (ORMs):</strong> score only the final answer. Easy, sparse signal.</li>
        <li><strong>Process Reward Models (PRMs):</strong> score each reasoning step. Catches &quot;right answer, wrong logic&quot; and &quot;off-by-one in step 4&quot; — the math teacher who docks you for not showing your work even when you got 7.</li>
      </ul>
      <p>
        OpenAI&apos;s &quot;Let&apos;s Verify Step by Step&quot; (Lightman 2023) showed PRMs &gt;
        ORMs on MATH. But here&apos;s the funny thing: DeepSeek-R1 mostly <em>skipped</em> them.
        They tried fancy process rewards and tree search, found both a pain to scale, and fell
        back to dumb, cheap, rule-based outcome rewards (&quot;did the answer match? did the code
        compile?&quot;) — letting RL figure out the steps itself. Sometimes the bitter lesson
        bites the elegant solution.
      </p>

      <h3>Multimodal &amp; Tools (Briefly)</h3>
      <ul>
        <li><strong>Bolted-on vision:</strong> duct-tape a CLIP/ViT encoder onto the front so it shoves images into the LLM&apos;s token space — the model didn&apos;t grow eyes, we glued some on. LLaVA, GPT-4V, Claude 3+.</li>
        <li><strong>Native multimodal:</strong> image, audio, video, and text raised together from birth — no glue, no aftermarket parts. Gemini, GPT-4o (the &quot;o&quot; is omni — speech in, speech out, ~200ms latency).</li>
        <li><strong>Function calling</strong> (2023) let models emit structured JSON tool calls.</li>
        <li><strong>MCP — Model Context Protocol</strong> (Anthropic, Nov 2024): the USB-C of tool use. One protocol, any tool plugs into any model.</li>
        <li><strong>Agents:</strong> Claude Code, Devin, Cursor agent, OpenAI&apos;s Operator (now ChatGPT Agent). Chain reasoning + tools + memory into loops that ship real PRs.</li>
      </ul>
      <p>
        Every time you&apos;ve watched Cursor or Claude Code go read a file, run a test, see it
        fail, and fix itself — that&apos;s this whole chapter in a loop. Reasoning (Step 11) plus
        tool calls plus the decode loop, chained until the tests pass. The &quot;agent&quot; on
        every 2026 landing page is just these pieces wired in a <code>while</code> loop.
      </p>

      <h2>Step 12: The Stuff You&apos;ll Actually Use</h2>
      <p>
        Everything so far is how the model gets <em>built</em>. This last step is the stuff
        you&apos;ll actually reach for the day you use one in anger.
      </p>

      <h3>RAG — Giving the Model a Cheat Sheet</h3>
      <p>
        A pretrained model only knows what was in its training set, frozen at some date. Ask it
        about your company&apos;s wiki and it&apos;ll cheerfully make something up. The fix
        isn&apos;t retraining — it&apos;s <em>retrieval</em>. RAG (Retrieval-Augmented Generation)
        is dead simple: embed your documents into vectors, dump them in a vector DB, and when a
        question comes in, embed <em>that</em> too, grab the nearest chunks, and paste them into
        the prompt before the model answers. The model isn&apos;t smarter — it just got handed an
        open-book exam. Most &quot;AI that knows your data&quot; products are RAG wearing a trench
        coat.
      </p>

      <h3>Fine-Tuning vs LoRA — Don&apos;t Move 70 Billion Numbers</h3>
      <p>
        Full fine-tuning means nudging every weight in the model. For a 70B model that&apos;s 70B
        gradients and 70B optimizer states — your GPU bursts into flames. <strong>LoRA</strong>{" "}
        (Low-Rank Adaptation) is the lazy-genius move: freeze the entire model and bolt on tiny
        low-rank matrices (a skinny <code>A</code> times a skinny <code>B</code>) next to each
        weight matrix. You train <em>only</em> those — often &lt;1% of the parameters — and add
        their output in. Same vibe, ~100× cheaper, and you can hot-swap adapters like Spotify
        playlists. Rule of thumb: want <em>new knowledge</em>? Use RAG. Want <em>new behavior or
        format</em>? Fine-tune (with LoRA).
      </p>

      <h3>Why Can&apos;t It Do Math?</h3>
      <p>
        Ask an LLM for <code>4729 × 8813</code> and it&apos;ll answer instantly, confidently, and
        often wrong. It&apos;s not &quot;thinking&quot; through multiplication; it&apos;s
        pattern-matching the <em>shape</em> of an answer it has seen, digit by digit, as plausible
        next tokens. No carry, no scratchpad, no algorithm — just vibes about what a product
        roughly looks like. (And remember Step 1 — it can&apos;t even see the digits cleanly.)
        That&apos;s why modern models cheat: they write code or call a calculator tool instead. A
        transformer is a brilliant intuition machine and a terrible adding machine, and knowing
        the difference is half of using one well.
      </p>

      <h3>Prompt Engineering Isn&apos;t Magic — It&apos;s Conditioning</h3>
      <p>
        &quot;Prompt engineering&quot; sounds like wizardry; it&apos;s just exploiting how the
        model works. Every token you write <em>conditions</em> the probability distribution for
        the next one. Say &quot;you are a senior Rust engineer&quot; and you&apos;ve shifted the
        model into a region of weight-space full of careful, idiomatic answers. Give it two worked
        examples (few-shot) and it pattern-matches the format. Tell it to &quot;think step by
        step&quot; and you literally hand it room to compute before committing. You&apos;re not
        casting spells — you&apos;re steering a probability distribution with words. That&apos;s
        the whole trick.
      </p>

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
        <li><strong>Add positions</strong> (sinusoidal / learned / RoPE / ALiBi).</li>
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
        page in 2026. One architecture. Scaled past the point of decency and given a personality.
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
        <li>It doesn&apos;t &quot;know&quot; things — it compressed patterns from training data into matrix weights. When the pattern it needs was never compressed strongly enough, it confidently makes one up. That&apos;s a hallucination, and it&apos;s the model doing the only thing it knows how to do.</li>
        <li>The strawberry bug is a tokenization quirk, not a stupidity tax.</li>
        <li>&quot;Context window&quot; is literally how many tokens fit in the KV cache.</li>
        <li>Reasoning models think by generating tokens silently before answering.</li>
        <li>It does not learn from your chats. The weights freeze the second training ends — every conversation starts with total amnesia. The only reason a chatbot &quot;remembers&quot; your name is that the app quietly staples earlier messages back into the prompt.</li>
        <li>A bigger context window isn&apos;t a bigger brain — it&apos;s a bigger desk. The model can see all of it, but attention spreads thin and stuff in the middle gets quietly ignored.</li>
        <li>Temperature isn&apos;t a creativity dial — it&apos;s a chaos knob. Crank it and you don&apos;t get genius, you get a model that confidently writes garbage.</li>
        <li>There&apos;s nobody home. No beliefs, no intentions, no little inner narrator. When it says &quot;I think&quot; or &quot;I feel,&quot; that&apos;s a statistical echo of humans saying those words. Impressive? Wildly. Sentient? Not even slightly.</li>
        <li>More parameters doesn&apos;t always mean a better model — a well-tuned 8B can lap a sloppy 175B all day. Parameter count is engine size, not lap time.</li>
      </ul>
      <p>
        You now know what&apos;s actually in the box. That makes you a better user, a better
        engineer, and — genuinely — a much funnier dinner guest.
      </p>

      <h2>The LLM Decoder Ring</h2>
      <p>
        You&apos;re about to go back into the wild, where people say these words at you with great
        confidence. Here&apos;s the cheat sheet.
      </p>
      <ul>
        <li><strong>Token</strong> — a chunk of text the model actually sees. Not a word. Usually a word-ish fragment.</li>
        <li><strong>Tokenizer</strong> — the meat grinder that turns your sentence into integer IDs and back.</li>
        <li><strong>Embedding</strong> — a token&apos;s ID swapped for a fat vector of numbers; its &quot;personality.&quot;</li>
        <li><strong>Logits</strong> — the raw, un-softmaxed scores the model spits out, one per vocab token, before they become probabilities.</li>
        <li><strong>Attention</strong> — a dating app for tokens: everyone scores everyone, then mixes accordingly.</li>
        <li><strong>KV cache</strong> — the model&apos;s sticky-notes, so it doesn&apos;t redo old homework every single token.</li>
        <li><strong>Context window</strong> — how many tokens fit in the KV cache before the oldest ones fall off the desk.</li>
        <li><strong>Transformer</strong> — the Lego brick (attention + FFN + norms) the entire industry stacks 80 times.</li>
        <li><strong>FFN</strong> — the fat sandwich layer where most of the parameters (and most of the facts) actually live.</li>
        <li><strong>RoPE</strong> — telling the model about word order by rotating vectors instead of bolting positions on.</li>
        <li><strong>Pretraining</strong> — the $50M phase: read the whole internet, guess the next word, repeat for two months.</li>
        <li><strong>Perplexity</strong> — how &quot;surprised&quot; the model is by text. Lower = better. The bathroom scale of LLMs.</li>
        <li><strong>SFT</strong> — showing the feral base model thousands of good answers until it learns to behave.</li>
        <li><strong>RLHF</strong> — humans rank answers, model chases the ranking. How the chatbot got its manners.</li>
        <li><strong>DPO</strong> — RLHF&apos;s clever shortcut: skip the reward model, skip PPO, one tidy loss.</li>
        <li><strong>Hallucination</strong> — the model confidently making something up, because guessing plausible tokens is the only thing it knows.</li>
        <li><strong>Quantization</strong> — squishing weights from fat floats to skinny ints so the thing runs on your laptop.</li>
        <li><strong>Speculative decoding</strong> — a tiny model scribbles a draft, the big model proofreads it in one pass. Free speed.</li>
        <li><strong>MoE</strong> — a zoo of expert FFNs; a router wakes up only two per token. Big brain, small bill.</li>
        <li><strong>RAG</strong> — handing the model the relevant documents in the prompt instead of hoping it memorized them.</li>
        <li><strong>Test-time compute</strong> — letting the model think longer instead of just making it bigger. The new scaling axis.</li>
      </ul>

      <ChallengeBox title="The Build-Your-Own-LLM Gauntlet">
        <p>
          The only way to <em>really</em> understand this stack is to stand it up yourself. Five
          challenges in increasing depth — pick one, pick all five:
        </p>
        <ol>
          <li>
            <strong>Tiny BPE.</strong> Take the from-scratch BPE trainer above. Train it on the
            first ~1MB of any text file (the Tiny Shakespeare dataset is a classic). Print the
            first 50 merges. Then write the <em>encoder</em> — given a new string, apply the
            merges in order and output token IDs. Compare against{" "}
            <code>tiktoken.get_encoding(&quot;cl100k_base&quot;)</code>. Notice how different your
            vocab is — and why.
          </li>
          <li>
            <strong>Make the transformer block sweat.</strong> Take the from-scratch transformer
            block from Step 5 and the attention code from Step 3. Wire them into a tiny training
            loop on Tiny Shakespeare — 2 layers, 64 dims, no GPU, no excuses. Train for 5 minutes.
            It will produce confident, grammatically-shaped nonsense. That nonsense is{" "}
            <em>yours</em>. Now turn the causal mask off and watch loss drop to near zero and
            samples turn to garbage — congrats, you just let it cheat by reading the answer.
          </li>
          <li>
            <strong>Sampling vibes.</strong> Take any Hugging Face model that runs on your machine
            (Qwen2.5-1.5B is a good pick). Generate the same prompt with <code>temperature=0</code>
            {" "}(always identical), then <code>0.7</code> (varied), then <code>1.5</code> (chaos),
            then <code>2.5</code> (gibberish). Then sweep <code>top_p</code> from 0.1 to 1.0.
            Develop intuitions for what each knob does to output quality — the single most useful
            skill for getting good results out of LLMs.
          </li>
          <li>
            <strong>KV-cache or it didn&apos;t happen.</strong> Generate 200 tokens twice: once
            recomputing all attention every step, once with a KV cache. Time both. Plot
            tokens/sec against sequence length. Watch the <code>O(n²)</code> you were warned about
            become <code>O(n)</code> with your own eyes.
          </li>
          <li>
            <strong>Break the strawberry.</strong> Write a one-liner that counts the R&apos;s in
            &quot;strawberry.&quot; Then ask a small local model the same thing. Then print the{" "}
            <em>tokens</em>. You now own the funniest dinner-party explanation in tech.
          </li>
        </ol>
        <p>
          When you&apos;ve done these, you know more about LLMs than almost everyone who
          confidently talks about them on the internet.
        </p>
      </ChallengeBox>

      <p>
        That&apos;s a wrap. Thanks for sticking through the longest chapter in the book. You
        started by predicting straight lines with two parameters in Chapter 4. You finish here
        knowing how a model with hundreds of billions of parameters writes essays, codes, draws
        diagrams, plays Go, and thinks.
      </p>
      <p>Go build something stupid.</p>
    </ChapterShell>
  );
}
