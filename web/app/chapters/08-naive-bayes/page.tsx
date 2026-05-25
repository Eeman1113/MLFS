import type { Metadata } from "next";
import { ChapterShell } from "@/components/chapter-shell";
import { ChallengeBox } from "@/components/challenge-box";
import { RunnableCode } from "@/components/runnable-code";
import { Math, tex } from "@/components/math";

export const metadata: Metadata = {
  title: "Ch. 8 · Naive Bayes: Trust Issues but Make It Statistical",
  description:
    "Naive Bayes built from probability fundamentals — Bayes' theorem, conditional independence, and why the 'naive' assumption works surprisingly well for text.",
  keywords: [
    "naive bayes",
    "bayes theorem",
    "probability ML",
    "text classification",
    "spam filter",
    "conditional probability",
    "naive bayes Python",
    "generative classifier",
  ],
  alternates: { canonical: "/chapters/08-naive-bayes/" },
  openGraph: {
    title: "Ch. 8 · Naive Bayes: Trust Issues but Make It Statistical · MLFS",
    description:
      "Naive Bayes built from probability fundamentals — Bayes' theorem, conditional independence, and why the 'naive' assumption works surprisingly well for text.",
    url: "https://mlfs.online/chapters/08-naive-bayes/",
    type: "article",
    authors: ["Eeman Majumder"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ch. 8 · Naive Bayes: Trust Issues but Make It Statistical · MLFS",
    description:
      "Naive Bayes built from probability fundamentals — Bayes' theorem, conditional independence, and why the 'naive' assumption works surprisingly well for text.",
  },
};

const ARTICLE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Ch. 8 · Naive Bayes: Trust Issues but Make It Statistical",
  description:
    "Naive Bayes built from probability fundamentals — Bayes' theorem, conditional independence, and why the 'naive' assumption works surprisingly well for text.",
  author: { "@type": "Person", name: "Eeman Majumder", url: "https://github.com/Eeman1113" },
  publisher: { "@type": "Person", name: "Eeman Majumder" },
  url: "https://mlfs.online/chapters/08-naive-bayes/",
  mainEntityOfPage: "https://mlfs.online/chapters/08-naive-bayes/",
  isPartOf: { "@type": "Book", name: "Machine Learning From Scratch", url: "https://mlfs.online/" },
  inLanguage: "en",
  image: "https://mlfs.online/chapters/08-naive-bayes/opengraph-image",
  proficiencyLevel: "Beginner",
  about: ["Naive Bayes", "Bayes Theorem", "Text Classification"],
  datePublished: "2025-01-01",
  dateModified: "2026-05-25",
  timeRequired: "PT35M",
  wordCount: 2400,
  articleSection: "Core Machine Learning",
  learningResourceType: "tutorial",
  educationalLevel: "Beginner",
  isAccessibleForFree: true,
  teaches: [
    "Bayes' theorem",
    "Conditional probability",
    "Naive Bayes classifier",
    "Text classification",
    "Building a spam filter",
  ],
  keywords: [
    "naive bayes",
    "bayes theorem",
    "probability ML",
    "text classification",
    "spam filter",
    "conditional probability",
    "naive bayes Python",
    "generative classifier",
  ],
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "h2"],
  },
  mentions: ["Naive Bayes", "Bayes' Theorem", "Conditional Probability", "Spam Filter", "Text Classification"],
};

const HOWTO_JSONLD = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Build a Naive Bayes Spam Filter from Scratch",
  description:
    "Use Bayes' theorem and word counts to build a simple, surprisingly effective spam filter in Python without any ML library.",
  totalTime: "PT35M",
  inLanguage: "en",
  supply: [
    { "@type": "HowToSupply", name: "A laptop" },
    { "@type": "HowToSupply", name: "Python 3 installation" },
  ],
  tool: [
    { "@type": "HowToTool", name: "Python" },
  ],
  step: [
    {
      "@type": "HowToStep",
      name: "Collect labeled examples",
      text: "Gather a small set of messages labeled as spam or not spam. Tokenize each one into lowercase words.",
    },
    {
      "@type": "HowToStep",
      name: "Count word occurrences per class",
      text: "Tally how often each word appears in spam messages and in normal messages. Add Laplace smoothing so unseen words don't zero out.",
    },
    {
      "@type": "HowToStep",
      name: "Compute class priors",
      text: "Calculate the prior probability of spam and not-spam from the proportions in your training data.",
    },
    {
      "@type": "HowToStep",
      name: "Score a new message",
      text: "For a new message, multiply (or sum logs of) the word likelihoods together with the class prior. Pick the class with the higher score.",
    },
  ],
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
      name: "Naive Bayes: Trust Issues but Make It Statistical",
      item: "https://mlfs.online/chapters/08-naive-bayes/",
    },
  ],
};

export default function Page() {
  return (
    <ChapterShell slug="08-naive-bayes">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <p>
        Alright, let's talk about an algorithm that is simultaneously brilliant, powerful, and built
        on a foundation of complete and utter delusion.
      </p>
      <p>Meet <strong>Naive Bayes</strong>.</p>
      <p>
        This algorithm is the workhorse behind many early spam filters. It's a probabilistic
        classifier that's fast, efficient, and surprisingly effective. And it achieves all this by
        making one of the most ridiculously bold—and technically wrong—assumptions in all of machine
        learning. It's like a detective who assumes every suspect in a crime acted completely
        independently, with no communication or conspiracy whatsoever.
      </p>
      <p>It's a "naive" assumption. But damn, if it doesn't work.</p>

      <h2>The Core Idea: Bayes' Theorem in Action</h2>
      <p>
        We're going back to Chapter 2 and dusting off our old friend, Bayes' Theorem. As a reminder,
        it's the formula that lets us update our beliefs in the face of new evidence.
      </p>
      <Math>{tex`P(A \mid B) = \frac{P(B \mid A) \, P(A)}{P(B)}`}</Math>
      <p>
        In classification, we want to calculate the probability of a certain class (C) given some
        observed data (D). For a spam filter, this translates to:
      </p>
      <Math>{tex`P(\text{Spam} \mid \text{Words}) = \frac{P(\text{Words} \mid \text{Spam}) \, P(\text{Spam})}{P(\text{Words})}`}</Math>
      <p>Let's break this down with a food allergy analogy:</p>
      <ul>
        <li><strong>P(Spam):</strong> The <strong>prior probability</strong>. What's the chance that any random email is spam, before we've even read it? Maybe it's 1 in 5 (20%). This is our starting belief.</li>
        <li><strong>P(Words | Spam):</strong> The <strong>likelihood</strong>. Given that an email is spam, what's the probability it contains certain words (like "Viagra," "prince," "free")? We can calculate this from our training data.</li>
        <li><strong>P(Words):</strong> The <strong>evidence</strong>. What's the overall probability of seeing these words in any email, spam or not?</li>
        <li><strong>P(Spam | Words):</strong> The <strong>posterior probability</strong>. After seeing the words in the email, what is our updated probability that it's spam? This is what we want to calculate.</li>
      </ul>
      <p>We calculate the posterior probability for both 'Spam' and 'Ham' (not spam). Whichever is higher is our prediction.</p>

      <h2>The "Naive" Assumption: The Group Project Mentality</h2>
      <p>
        Here's where the magic and the madness come in. Calculating the probability of an entire
        sentence, like P("free money now"|Spam), is hard because the words aren't independent. The
        word "money" is more likely to appear if the word "free" is already there.
      </p>
      <p>Naive Bayes says: "LOL, who cares."</p>
      <p>
        It makes the <strong>class-conditional independence assumption</strong>. It naively assumes
        that every feature (in this case, every word) is completely independent of every other
        feature, given the class.
      </p>
      <p>So, instead of a complex calculation, it does this:</p>
      <Math>{tex`P(\text{"free money now"} \mid \text{Spam}) \approx P(\text{free} \mid S) \cdot P(\text{money} \mid S) \cdot P(\text{now} \mid S)`}</Math>
      <p>
        This is obviously wrong. In the real world, words have context. "San" is not independent of
        "Francisco." But this assumption simplifies the math so dramatically that it becomes not
        just possible, but incredibly fast. It's the ultimate "good enough" engineering tradeoff:
        sacrifice theoretical purity for practical speed and effectiveness. It's the algorithm
        equivalent of assuming everyone in a group project will do their part without
        coordinating—a naive hope, but it simplifies planning.
      </p>

      <h2>From-Scratch Spam Filter: Let's Catch Some Scammers</h2>
      <p>Let's build a text classifier from the ground up.</p>

      <h3>Step 1: Data Preparation and Training</h3>
      <p>The "training" phase for Naive Bayes is just counting.</p>
      <ol>
        <li>Take a dataset of emails already labeled spam or ham.</li>
        <li>Calculate the prior probabilities: P(Spam) and P(Ham).</li>
        <li>Create a vocabulary of all unique words in the dataset.</li>
        <li>
          For each word in the vocabulary, calculate its likelihood for each class. For example:
          <Math>{tex`P(\text{"Viagra"} \mid \text{Spam}) = \frac{\text{count of "Viagra" in spam}}{\text{total words in spam}}`}</Math>
        </li>
        <li>Store all these probabilities in a dictionary or hash map. That's our "trained" model.</li>
      </ol>

      <h3>Step 2: The Problem of Zero Probability & Laplace Smoothing</h3>
      <p>
        What happens if our new email contains a word the model has never seen before? The count for
        this word would be 0, making its probability 0. When we multiply all the probabilities
        together, the entire calculation becomes 0, and our model breaks.
      </p>
      <p>
        To fix this, we use <strong>Laplace Smoothing</strong> (or add-one smoothing). It's a simple
        trick: we pretend we've seen every word in our vocabulary one more time than we actually
        have.
      </p>
      <Math>{tex`P(\text{word} \mid \text{Class}) = \frac{\text{count(word, Class)} + 1}{\text{total words in Class} + |\text{vocab}|}`}</Math>
      <p>This ensures that no word ever has a zero probability. It's like giving every word a tiny head start.</p>

      <h3>Step 3: The predict() function</h3>
      <p>Now, to classify a new, unseen email:</p>
      <ol>
        <li>Start with the prior probabilities for 'Spam' and 'Ham'.</li>
        <li>For each word in the new email, multiply the running probability by the word's likelihood for that class.</li>
      </ol>
      <p>
        <strong>Pro Tip:</strong> Since we're multiplying lots of small probabilities, we can run
        into floating-point underflow. The standard trick is to use the log of the probabilities
        instead. Multiplication becomes addition, which is numerically much more stable:
      </p>
      <Math>{tex`\log P(\text{Class}) + \sum_i \log P(\text{word}_i \mid \text{Class})`}</Math>
      <p>Compare the final log-probability scores for 'Spam' and 'Ham'. The class with the higher score is our prediction.</p>

      <RunnableCode
        title="naive_bayes.py"
        code={`import math
from collections import Counter

spam = [
    "win money now prince nigeria",
    "free viagra free meds",
    "claim your free prize now",
    "lottery winner you have won",
]
ham = [
    "hey are you up for lunch tomorrow",
    "meeting at three is fine",
    "the report is attached please review",
    "love you call me when free",
]

def tokens(s): return s.lower().split()
vocab = set(w for d in spam + ham for w in tokens(d))

def class_model(docs):
    counts = Counter()
    total = 0
    for d in docs:
        for w in tokens(d):
            counts[w] += 1; total += 1
    return counts, total

cs, ts = class_model(spam)
ch, th = class_model(ham)
prior_s = math.log(len(spam) / (len(spam) + len(ham)))
prior_h = math.log(len(ham)  / (len(spam) + len(ham)))

def score(doc, counts, total):
    s = 0.0
    for w in tokens(doc):
        s += math.log((counts[w] + 1) / (total + len(vocab)))
    return s

def predict(doc):
    s = prior_s + score(doc, cs, ts)
    h = prior_h + score(doc, ch, th)
    return ("SPAM", s) if s > h else ("HAM", h)

for t in ["claim free viagra now",
          "see you at lunch please",
          "free meeting tomorrow"]:
    label, _ = predict(t)
    print(f"{label:>4} :: {t}")`}
      />

      <p>
        This approach reveals a powerful engineering principle: sometimes, a model that is
        technically "wrong" in its assumptions can be more useful in practice than a "correct" model
        that is too slow or complex to be feasible. Naive Bayes is a triumph of pragmatism over
        purity, and a testament to the power of a "lazy genius" shortcut.
      </p>

      <ChallengeBox title="Sentiment Analyzer">
        <p>Your mission is to repurpose our spam filter for a new task: sentiment analysis.</p>
        <p>Find a dataset of movie reviews labeled as 'positive' or 'negative'. The IMDB dataset is a classic choice.</p>
        <p>Adapt your from-scratch Naive Bayes code. Instead of 'spam' and 'ham', your classes are now 'positive' and 'negative'.</p>
        <p>Train your model on the review data.</p>
        <p>After training, find the top 10 words with the highest likelihood for the 'positive' class and the top 10 for the 'negative' class. Do they make sense?</p>
        <p>Write a function that takes a new review (a string) and predicts whether its sentiment is positive or negative. Test it out!</p>
      </ChallengeBox>
    </ChapterShell>
  );
}
