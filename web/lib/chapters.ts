export type ChapterMeta = {
  slug: string;
  num: number;
  title: string;
  part: string;
  partNum: number;
  blurb: string;
  emoji?: string;
};

export type PartMeta = {
  num: number;
  title: string;
  subtitle: string;
  bonus?: boolean;
};

export const PARTS: PartMeta[] = [
  { num: 1, title: "Basic Brain Rewiring", subtitle: "Foundations" },
  { num: 2, title: "Core Machine Learning", subtitle: "Real S#!t Starts Here" },
  { num: 3, title: "Let's Build Things", subtitle: "Projects & Fun Stuff" },
  { num: 4, title: "Bonus", subtitle: "LLMs & All Their Fun Magic", bonus: true },
];

export function partLabel(p: PartMeta) {
  return p.bonus ? p.title : `Part ${p.num} — ${p.title}`;
}

export const CHAPTERS: ChapterMeta[] = [
  {
    slug: "01-flowcharts",
    num: 1,
    title: "How to Think in Flowcharts",
    part: "Basic Brain Rewiring",
    partNum: 1,
    blurb: "Step over vibes. Learn to think like a computer before you code like one.",
  },
  {
    slug: "02-math",
    num: 2,
    title: "Math You Can't Ignore (Sorry, Bestie)",
    part: "Basic Brain Rewiring",
    partNum: 1,
    blurb: "Vectors, calculus, probability — the only three you actually need.",
  },
  {
    slug: "03-algorithm",
    num: 3,
    title: "The Algorithm is a Lazy Genius",
    part: "Basic Brain Rewiring",
    partNum: 1,
    blurb: "Supervised vs unsupervised, loss functions, gradient descent — the soul of ML.",
  },
  {
    slug: "04-linear-regression",
    num: 4,
    title: "DIY Linear Regression",
    part: "Core Machine Learning",
    partNum: 2,
    blurb: "Baby's first model. Predict stuff with a straight line, from scratch.",
  },
  {
    slug: "05-classification",
    num: 5,
    title: "Classification: The Yes or No Saga",
    part: "Core Machine Learning",
    partNum: 2,
    blurb: "Sigmoid, logistic regression, decision boundaries.",
  },
  {
    slug: "06-decision-trees",
    num: 6,
    title: "Decision Trees: The Judgmental Algorithm",
    part: "Core Machine Learning",
    partNum: 2,
    blurb: "A flowchart that learns. Gini, entropy, information gain.",
  },
  {
    slug: "07-knn",
    num: 7,
    title: "KNN: The Neighborhood Watch",
    part: "Core Machine Learning",
    partNum: 2,
    blurb: "No training, just vibes. You are the company you keep.",
  },
  {
    slug: "08-naive-bayes",
    num: 8,
    title: "Naive Bayes: Trust Issues but Make It Statistical",
    part: "Core Machine Learning",
    partNum: 2,
    blurb: "Build a spam filter from probabilities and bold assumptions.",
  },
  {
    slug: "09-clustering",
    num: 9,
    title: "Clustering: Group Therapy for Data",
    part: "Core Machine Learning",
    partNum: 2,
    blurb: "K-Means, the elbow method, finding cliques in chaos.",
  },
  {
    slug: "10-neural-networks",
    num: 10,
    title: "Intro to Neural Networks: Baby's First Brain",
    part: "Core Machine Learning",
    partNum: 2,
    blurb: "Perceptrons, activations, forward + backprop, conquering XOR.",
  },
  {
    slug: "11-playground",
    num: 11,
    title: "ML Playground: Code Like You Mean It",
    part: "Let's Build Things",
    partNum: 3,
    blurb: "Spotify popularity, tweet sentiment, mood-based snacks.",
  },
  {
    slug: "12-screwups",
    num: 12,
    title: "When Your Model Screws Up",
    part: "Let's Build Things",
    partNum: 3,
    blurb: "Overfitting, underfitting, cross-validation, precision vs recall.",
  },
  {
    slug: "13-sklearn",
    num: 13,
    title: "From Scratch to Sklearn",
    part: "Let's Build Things",
    partNum: 3,
    blurb: "Earn your library — refactor your hand-coded models into 3 lines.",
  },
  {
    slug: "14-ethics",
    num: 14,
    title: "Ethics, Bias & Bullshit Detectors",
    part: "Let's Build Things",
    partNum: 3,
    blurb: "Your model isn't neutral. Build it like a responsible adult.",
  },
  {
    slug: "15-final-boss",
    num: 15,
    title: "Final Boss: End-to-End ML Project",
    part: "Let's Build Things",
    partNum: 3,
    blurb: "Pick a quest. Build the pipeline. Ship it to the world.",
  },
  {
    slug: "16-llms",
    num: 16,
    title: "LLMs and All Their Fun Magic",
    part: "Bonus",
    partNum: 4,
    blurb:
      "From Attention Is All You Need to models that actually think. Tokens, embeddings, QKV, transformers, RLHF, sampling, KV caches, MoE, chain-of-thought, o1-style reasoning — the whole stack, from scratch.",
  },
];

export function getChapter(slug: string) {
  return CHAPTERS.find((c) => c.slug === slug);
}
export function getNext(slug: string) {
  const i = CHAPTERS.findIndex((c) => c.slug === slug);
  return i >= 0 && i < CHAPTERS.length - 1 ? CHAPTERS[i + 1] : null;
}
export function getPrev(slug: string) {
  const i = CHAPTERS.findIndex((c) => c.slug === slug);
  return i > 0 ? CHAPTERS[i - 1] : null;
}
