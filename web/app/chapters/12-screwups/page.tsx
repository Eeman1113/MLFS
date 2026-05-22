import type { Metadata } from "next";
import { ChapterShell } from "@/components/chapter-shell";
import { ChallengeBox } from "@/components/challenge-box";
import { RunnableCode } from "@/components/runnable-code";
import { OverfitExplorer } from "@/components/interactives/overfit";

export const metadata: Metadata = {
  title: "Ch. 12 · When Your Model Screws Up",
  description:
    "Overfitting, underfitting, data leakage, and the most common ML mistakes — with interactive demos so you can feel the bias-variance tradeoff, not just read about it.",
  keywords: [
    "overfitting",
    "underfitting",
    "data leakage",
    "ML mistakes",
    "bias variance tradeoff",
    "ML debugging",
    "generalization",
    "regularization",
  ],
  alternates: { canonical: "/chapters/12-screwups/" },
  openGraph: {
    title: "Ch. 12 · When Your Model Screws Up · MLFS",
    description:
      "Overfitting, underfitting, data leakage, and the most common ML mistakes — with interactive demos so you can feel the bias-variance tradeoff, not just read about it.",
    url: "https://mlfs.online/chapters/12-screwups/",
    type: "article",
    authors: ["Eeman Majumder"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ch. 12 · When Your Model Screws Up · MLFS",
    description:
      "Overfitting, underfitting, data leakage, and the most common ML mistakes — with interactive demos so you can feel the bias-variance tradeoff, not just read about it.",
  },
};

const ARTICLE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Ch. 12 · When Your Model Screws Up",
  description:
    "Overfitting, underfitting, data leakage, and the most common ML mistakes — with interactive demos so you can feel the bias-variance tradeoff, not just read about it.",
  author: { "@type": "Person", name: "Eeman Majumder", url: "https://github.com/Eeman1113" },
  publisher: { "@type": "Person", name: "Eeman Majumder" },
  url: "https://mlfs.online/chapters/12-screwups/",
  isPartOf: { "@type": "Book", name: "Machine Learning From Scratch", url: "https://mlfs.online/" },
  inLanguage: "en",
  image: "https://mlfs.online/opengraph-image",
  proficiencyLevel: "Beginner",
  about: ["Overfitting and Underfitting", "Bias-Variance Tradeoff", "ML Debugging"],
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
      name: "When Your Model Screws Up",
      item: "https://mlfs.online/chapters/12-screwups/",
    },
  ],
};

export default function Page() {
  return (
    <ChapterShell slug="12-screwups">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <p>
        So, you've built a model. You fed it data, you watched the loss curve go down, and you got
        a prediction. You might have even calculated its accuracy and seen a glorious 99% printed to
        your console.
      </p>
      <p>Time to deploy to production and become a billionaire, right?</p>
      <p>Wrong.</p>
      <p>
        Welcome to the most important chapter in this book. This is where we talk about debugging.
        Because your model might have 99% accuracy and still be complete and utter garbage. And when
        your model screws up, there's one person to blame: you.
      </p>

      <h2>Overfitting vs. Underfitting: The Student Analogy</h2>
      <p>
        The most common failure modes for a model are <strong>overfitting</strong> and{" "}
        <strong>underfitting</strong>. They represent two sides of the same coin: the model's ability
        to generalize from the training data to new, unseen data.
      </p>
      <p><strong>Underfitting (High Bias): The Lazy Student</strong></p>
      <ul>
        <li><strong>The Symptom:</strong> The model performs poorly on the training data <em>and</em> the test data.</li>
        <li><strong>The Analogy:</strong> The student who didn't study at all. Fails the practice questions and fails the final exam.</li>
        <li><strong>The Cause:</strong> Model too simple. Using a linear model on a curvy relationship.</li>
        <li><strong>The Fix:</strong> Use a more complex model. Polynomial, deeper tree, neural net.</li>
      </ul>
      <p><strong>Overfitting (High Variance): The Memorizing Nerd</strong></p>
      <ul>
        <li><strong>The Symptom:</strong> Model performs perfectly on training data but falls apart on test data.</li>
        <li><strong>The Analogy:</strong> The student who memorized exact answers to study-guide questions; lost when the real exam asks something slightly different.</li>
        <li><strong>The Cause:</strong> Model is too complex. It learned the noise in the training data, not the signal.</li>
        <li><strong>The Fix:</strong> Simplify the model. Regularize, prune, get more training data.</li>
      </ul>

      <OverfitExplorer />

      <p>
        The model fits the training data perfectly. But it won't work for any other data point
        because it has learned the noise, not the simple underlying curve. It has failed to
        generalize.
      </p>

      <h2>The Bias-Variance Tradeoff: The Goldilocks Problem</h2>
      <p>These two problems are fundamentally linked. This is the <strong>Bias-Variance Tradeoff</strong>, the central tension in supervised learning.</p>
      <ul>
        <li><strong>Bias</strong> is the error from a model being too simple (underfitting).</li>
        <li><strong>Variance</strong> is the error from a model being too sensitive to the training data (overfitting).</li>
      </ul>
      <p>You can't have your cake and eat it too.</p>
      <ul>
        <li>If you decrease bias (make your model more complex), you almost always increase variance.</li>
        <li>If you decrease variance (simplify your model), you almost always increase bias.</li>
      </ul>
      <p>
        The goal is not to eliminate one or the other, but to find the "Goldilocks" spot in the
        middle—a model that is complex enough to capture the true signal, but not so complex that it
        starts memorizing the noise.
      </p>

      <h2>Cross-Validation: Stop Lying to Yourself</h2>
      <p>How do you find this sweet spot? Your simple train-test split is a good start, but what if you just got lucky (or unlucky) with your split?</p>
      <p>
        <strong>K-Fold Cross-Validation</strong> is the professional's tool for getting a more
        robust and honest evaluation of model performance.
      </p>
      <p>Here's how it works (k=5 is a common choice):</p>
      <ol>
        <li>Shuffle your dataset randomly.</li>
        <li>Split it into k equal-sized folds (e.g., 5 folds of 20% each).</li>
        <li>
          Now, you run 5 experiments:
          <ul>
            <li><strong>Run 1:</strong> Train on Folds 1–4, test on Fold 5.</li>
            <li><strong>Run 2:</strong> Train on Folds 1, 2, 3, 5; test on Fold 4.</li>
            <li><strong>Run 3:</strong> Train on Folds 1, 2, 4, 5; test on Fold 3.</li>
            <li>...and so on.</li>
          </ul>
        </li>
      </ol>
      <p>You end up with 5 different performance scores. The average is your cross-validated performance.</p>
      <p>This is like giving your student 5 different versions of the final exam and averaging their scores. Much more reliable.</p>

      <RunnableCode
        title="cv_demo.py"
        packages={["scikit-learn"]}
        code={`from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import cross_val_score
import numpy as np

X, y = load_iris(return_X_y=True)

for d in [1, 2, 3, 5, 10, None]:
    clf = DecisionTreeClassifier(max_depth=d, random_state=0)
    scores = cross_val_score(clf, X, y, cv=5)
    print(f"max_depth={str(d):<5} mean={scores.mean():.3f}  std={scores.std():.3f}")`}
      />

      <h2>Metrics That Actually Matter: Accuracy is for Amateurs</h2>
      <p>
        Okay, here's the biggest trap for beginners. You build a model, and you see:{" "}
        <code>Accuracy: 99.0%</code>. You think you're a genius.
      </p>
      <p>
        But what if you're building a model to detect a rare disease that only affects 1% of the
        population? A lazy model that just predicts "No Disease" for every single person will be 99%
        accurate. And it will be 100% useless.
      </p>
      <p>This is why accuracy can be a terrible metric, especially for imbalanced datasets. We need smarter metrics.</p>
      <p><strong>Analogy: The Fishing Net</strong></p>
      <p>
        Imagine your model is a fishing net. The fish are the positive cases you want to find (e.g.,
        "spam," "disease"). The rocks and seaweed are the negative cases.
      </p>
      <ul>
        <li>
          <strong>Precision:</strong> "Of all the stuff in your net, how much is actually fish?"
          <br />
          <code>Precision = TP / (TP + FP)</code>
          <br />
          High precision = model is trustworthy when it says "yes."
          <br />
          <strong>When it matters:</strong> Spam filtering. False positives (real email → spam) are
          much worse than false negatives.
        </li>
        <li>
          <strong>Recall (Sensitivity):</strong> "Of all the fish in the lake, how many did you
          catch?"
          <br />
          <code>Recall = TP / (TP + FN)</code>
          <br />
          High recall = model finds all the positive cases.
          <br />
          <strong>When it matters:</strong> Medical diagnosis. Missing a real disease is
          catastrophic.
        </li>
        <li>
          <strong>F1-Score:</strong> Harmonic mean of precision and recall.
          <br />
          <code>F1 = 2 × P × R / (P + R)</code>
          <br />
          Best default metric for many problems — especially imbalanced datasets.
        </li>
      </ul>

      <table>
        <thead>
          <tr><th>Metric</th><th>Question it Answers</th><th>When to Use It</th><th>Real-World Example</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Accuracy</strong></td><td>What fraction of predictions were correct?</td><td>Only for balanced datasets where FP and FN have similar costs.</td><td>Cats vs. dogs (balanced classes).</td></tr>
          <tr><td><strong>Precision</strong></td><td>When my model predicts YES, how often is it correct?</td><td>When the cost of a False Positive is high.</td><td>Spam detection, investment.</td></tr>
          <tr><td><strong>Recall</strong></td><td>Of all actual YES cases, how many did my model find?</td><td>When the cost of a False Negative is high.</td><td>Medical diagnosis, fraud.</td></tr>
          <tr><td><strong>F1-Score</strong></td><td>How can I balance Precision and Recall?</td><td>When you need balance, or for imbalanced datasets.</td><td>Most real-world classification.</td></tr>
        </tbody>
      </table>

      <p>Stop using accuracy as your only metric. Start thinking about the cost of your model's mistakes. That's how you go from building toys to building tools.</p>

      <ChallengeBox title="The Doctor and the Spammer">
        <p>You are evaluating two different machine learning models for two different jobs.</p>
        <ul>
          <li><strong>Model A:</strong> 99% Precision, 40% Recall.</li>
          <li><strong>Model B:</strong> 65% Precision, 98% Recall.</li>
        </ul>
        <p><strong>Job 1: Cancer Detection System.</strong> You need to build a model that screens patient scans for signs of cancer. Which model do you choose, A or B? Justify your answer in terms of false positives and false negatives.</p>
        <p><strong>Job 2: Email Spam Filter.</strong> You need to build a model that automatically moves spam emails to a junk folder. Which model do you choose, A or B? Justify your answer in terms of false positives and false negatives.</p>
        <p>There is a right and a wrong answer for each. Choose wisely.</p>
      </ChallengeBox>
    </ChapterShell>
  );
}
