import type { Metadata } from "next";
import { ChapterShell } from "@/components/chapter-shell";
import { ChallengeBox } from "@/components/challenge-box";
import { Callout } from "@/components/callout";
import { RunnableCode } from "@/components/runnable-code";
import { DebuggingFlowchart, TakeawayFlowchart } from "@/components/flowcharts";

export const metadata: Metadata = {
  title: "Ch. 1 · How to Think in Flowcharts",
  description:
    "Learn to break down any ML problem into a clear flowchart — the foundation for thinking like a machine learning engineer before writing a single line of code.",
  keywords: [
    "flowcharts",
    "ML thinking",
    "problem decomposition",
    "ML workflow",
    "machine learning basics",
    "algorithmic thinking",
    "computational thinking",
    "if-else logic",
  ],
  alternates: { canonical: "/chapters/01-flowcharts/" },
  openGraph: {
    title: "Ch. 1 · How to Think in Flowcharts · MLFS",
    description:
      "Learn to break down any ML problem into a clear flowchart — the foundation for thinking like a machine learning engineer before writing a single line of code.",
    url: "https://mlfs.online/chapters/01-flowcharts/",
    type: "article",
    authors: ["Eeman Majumder"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ch. 1 · How to Think in Flowcharts · MLFS",
    description:
      "Learn to break down any ML problem into a clear flowchart — the foundation for thinking like a machine learning engineer before writing a single line of code.",
  },
};

const ARTICLE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Ch. 1 · How to Think in Flowcharts",
  description:
    "Learn to break down any ML problem into a clear flowchart — the foundation for thinking like a machine learning engineer before writing a single line of code.",
  author: { "@type": "Person", name: "Eeman Majumder", url: "https://github.com/Eeman1113" },
  publisher: { "@type": "Person", name: "Eeman Majumder" },
  url: "https://mlfs.online/chapters/01-flowcharts/",
  isPartOf: { "@type": "Book", name: "Machine Learning From Scratch", url: "https://mlfs.online/" },
  inLanguage: "en",
  image: "https://mlfs.online/opengraph-image",
  proficiencyLevel: "Beginner",
  about: ["Flowcharts", "Algorithmic Thinking", "Problem Decomposition"],
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
      name: "How to Think in Flowcharts",
      item: "https://mlfs.online/chapters/01-flowcharts/",
    },
  ],
};

export default function Page() {
  return (
    <ChapterShell slug="01-flowcharts">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <p>
        Alright, let's have a little chat. You, me, and your terminal. You've probably got a dozen
        projects on the go, a terminal window that looks like a scene from The Matrix, and a brain
        that moves at a million miles an hour. When you get a new idea, what's your first move? If
        you're like 99% of developers, you crack open your editor, type <code>import this</code>, and
        start slinging code like a digital gunslinger. You're all vibes, no blueprints.
      </p>
      <p>
        And that, my friend, is why your code sometimes looks like a plate of spaghetti that's been
        through a blender.
      </p>
      <p>
        Today, we're going to fix that. We're going to train your brain to think like a computer
        before you code like one. We're going to learn to think in steps, not vibes. We're going to
        learn the ancient, sacred art of the flowchart.
      </p>

      <h2>The Building Blocks of Logic (aka Funky Shapes)</h2>
      <p>
        A flowchart is just a map of your thoughts. It's a way to break down a complex problem into a
        series of ridiculously simple questions and actions. Before you write a single line of code,
        you draw a flowchart. It forces you to confront the logic of your problem head-on, instead of
        discovering a fatal flaw 300 lines deep at 2 AM.
      </p>
      <p>
        There are only a few shapes you need to know, and we're going to explain them with life's
        most pressing questions.
      </p>

      <ul>
        <li>
          <strong>The Oval (Terminator):</strong> This is your start and end point. Think of it as
          "Wake Up" and "Go Back to Bed." Every flowchart needs a beginning and an end.
        </li>
        <li>
          <strong>The Rectangle (Process):</strong> This is an action. "Make Coffee." "Google the
          Error Message." "Cry." It's a step where you <em>do</em> something.
        </li>
        <li>
          <strong>The Diamond (Decision):</strong> This is where the magic happens. It's a question
          that can only be answered with "Yes" or "No." "Is it Friday?" "Did the code work?" "Is
          this pizza still edible?"
        </li>
        <li>
          <strong>The Parallelogram (Input/Output):</strong> This is for getting data in or pushing
          data out. "Read user's password." "Print 'Hello, World'."
        </li>
      </ul>

      <p>Let's see this in action.</p>

      <h3>Example 1: The "Should I Get Takeaway?" Algorithm</h3>
      <p>
        You've had a long day. The thought of cooking is physically painful. Should you order a
        pizza? Let's consult the algorithm.
      </p>

      <TakeawayFlowchart />

      <p>
        Look at that beautiful, logical flow. This isn't just a silly diagram; it's a perfect
        representation of an <code>if-else</code> statement.
      </p>

      <RunnableCode
        title="takeaway.py"
        code={`# The flowchart, but in Python
is_weekday = True
have_energy = False

if is_weekday:
    if have_energy:
        print("Cook a healthy meal. You got this!")
    else:
        print("Order Pizza")
else:
    print("Cook something fancy!")`}
        caption="Edit the booleans, hit run. Watch the flowchart speak."
      />

      <p>
        See? You just mapped a real-life decision directly to code. You thought in steps, and the
        code wrote itself.
      </p>

      <h3>Example 2: The "Works on My Machine" Debugging Loop</h3>
      <p>
        Now for something a little spicier. Every developer knows this pain. You write some code, it
        works perfectly, you ship it, and then... it explodes. Here's the universal debugging
        flowchart.
      </p>

      <DebuggingFlowchart />

      <p>
        This flowchart introduces a loop. We go from the Google step back to checking the server,
        repeating the process until the problem is solved. This is the essence of <code>while</code>{" "}
        loops and iterative problem-solving.
      </p>

      <h2>From Funny to Functional: Why This Matters</h2>
      <p>
        Okay, so we've had some fun with pizza and broken code. But here's the kicker: the logic you
        used to decide whether to say "hi" to that person you vaguely know from college is
        structurally identical to the logic a bank uses to flag a credit card transaction as
        fraudulent.
      </p>

      <Callout title="“Should I say hi?” Flowchart">
        <ul>
          <li>Do I know their name? → Yes</li>
          <li>Am I sure? → Yes</li>
          <li>Have we spoken in the last year? → No</li>
          <li><strong>Decision:</strong> Awkwardly nod and walk faster.</li>
        </ul>
      </Callout>

      <Callout title="Fraud Detection Flowchart">
        <ul>
          <li>Is the transaction amount &gt; $1000? → Yes</li>
          <li>Is the location unusual? → Yes</li>
          <li>Has the card been used in the last hour? → No</li>
          <li><strong>Decision:</strong> Flag transaction and send a text alert.</li>
        </ul>
      </Callout>

      <p>
        Both are just a series of if-then-else checks. One prevents social awkwardness, the other
        prevents financial crime. The underlying logic is the same.
      </p>

      <p>
        When we get to Chapter 6, you'll see that a Decision Tree is literally just a flowchart that
        an algorithm learns on its own. When we get to Chapter 10, you'll see that a Neural Network
        is just a much, much more complex flowchart with thousands of interconnected paths and
        decisions.
      </p>

      <p>
        It all starts here. Learning to break problems down into these simple, visual steps is the
        most important skill you can develop. It's the foundation for everything that follows.
        Master the flowchart, and you've already taken your first giant leap into thinking like a
        machine learning engineer.
      </p>

      <ChallengeBox>
        <p>Your mission, should you choose to accept it:</p>
        <p>
          Design a flowchart for the process of deciding whether to start working on a big, scary
          project.
        </p>
        <p>Your flowchart must include:</p>
        <ul>
          <li>
            At least two decision diamonds (e.g., "Is the deadline tomorrow?", "Is there coffee?").
          </li>
          <li>At least one loop (e.g., the classic "Watch one more YouTube video" loop).</li>
          <li>A "Panic Mode" process block.</li>
        </ul>
        <p>Sketch it out on paper, use a tool, or even use ASCII art in a code comment.</p>
        <p>
          <strong>Bonus:</strong> Translate your flowchart into a Python script with{" "}
          <code>if/else</code> statements and a <code>while</code> loop.
        </p>
        <p>Don't just think about it. Draw it. It's the first step to rewiring your brain.</p>
      </ChallengeBox>
    </ChapterShell>
  );
}
