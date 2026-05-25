import type { Metadata } from "next";
import { ChapterShell } from "@/components/chapter-shell";
import { ChallengeBox } from "@/components/challenge-box";
import { RunnableCode } from "@/components/runnable-code";

export const metadata: Metadata = {
  title: "Ch. 15 · Final Boss: End-to-End ML Project",
  description:
    "Build a real end-to-end ML project — data ingestion, training, evaluation, and deployment. The final boss fight that ties every chapter of the book together.",
  keywords: [
    "end-to-end ML",
    "ML project",
    "ML deployment",
    "ML pipeline",
    "full stack ML",
    "real ML project",
    "ML capstone",
    "production machine learning",
  ],
  alternates: { canonical: "/chapters/15-final-boss/" },
  openGraph: {
    title: "Ch. 15 · Final Boss: End-to-End ML Project · MLFS",
    description:
      "Build a real end-to-end ML project — data ingestion, training, evaluation, and deployment. The final boss fight that ties every chapter of the book together.",
    url: "https://mlfs.online/chapters/15-final-boss/",
    type: "article",
    authors: ["Eeman Majumder"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ch. 15 · Final Boss: End-to-End ML Project · MLFS",
    description:
      "Build a real end-to-end ML project — data ingestion, training, evaluation, and deployment. The final boss fight that ties every chapter of the book together.",
  },
};

const ARTICLE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Ch. 15 · Final Boss: End-to-End ML Project",
  description:
    "Build a real end-to-end ML project — data ingestion, training, evaluation, and deployment. The final boss fight that ties every chapter of the book together.",
  author: { "@type": "Person", name: "Eeman Majumder", url: "https://github.com/Eeman1113" },
  publisher: { "@type": "Person", name: "Eeman Majumder" },
  url: "https://mlfs.online/chapters/15-final-boss/",
  mainEntityOfPage: "https://mlfs.online/chapters/15-final-boss/",
  isPartOf: { "@type": "Book", name: "Machine Learning From Scratch", url: "https://mlfs.online/" },
  inLanguage: "en",
  image: "https://mlfs.online/chapters/15-final-boss/opengraph-image",
  proficiencyLevel: "Intermediate",
  about: ["End-to-End ML Project", "ML Deployment", "ML Pipelines"],
  datePublished: "2025-01-01",
  dateModified: "2026-05-25",
  timeRequired: "PT1H",
  wordCount: 2800,
  articleSection: "Let's Build Things",
  learningResourceType: "tutorial",
  educationalLevel: "Intermediate",
  isAccessibleForFree: true,
  teaches: [
    "End-to-end ML project structure",
    "Data ingestion and cleaning",
    "Training and evaluation",
    "Shipping a model to the web",
    "Iterating on real datasets",
  ],
  keywords: [
    "end-to-end ML",
    "ML project",
    "ML deployment",
    "ML pipeline",
    "full stack ML",
    "real ML project",
    "ML capstone",
    "production machine learning",
  ],
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "h2"],
  },
  mentions: ["ML Pipeline", "Model Deployment", "Data Ingestion", "Evaluation Metrics", "Production ML"],
};

const HOWTO_JSONLD = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Build an End-to-End Machine Learning Project",
  description:
    "Take a project idea from raw data all the way to a shipped model — collect data, train, evaluate, and deploy.",
  totalTime: "PT1H",
  inLanguage: "en",
  supply: [
    { "@type": "HowToSupply", name: "A laptop" },
    { "@type": "HowToSupply", name: "Python 3 installation" },
    { "@type": "HowToSupply", name: "A dataset relevant to your chosen problem" },
  ],
  tool: [
    { "@type": "HowToTool", name: "Python" },
    { "@type": "HowToTool", name: "NumPy" },
    { "@type": "HowToTool", name: "scikit-learn" },
  ],
  step: [
    {
      "@type": "HowToStep",
      name: "Pick a quest",
      text: "Choose a real problem you care about. Define the input, the prediction target, and what success looks like.",
    },
    {
      "@type": "HowToStep",
      name: "Get and clean the data",
      text: "Load the dataset, handle missing values, encode categorical features, and split into train and test sets.",
    },
    {
      "@type": "HowToStep",
      name: "Train a baseline model",
      text: "Fit a simple model — linear, logistic, or a small tree — so you have a number to beat before reaching for anything fancy.",
    },
    {
      "@type": "HowToStep",
      name: "Evaluate honestly",
      text: "Look at the right metric for your task, inspect failure cases, and decide whether the model is good enough or needs more iteration.",
    },
    {
      "@type": "HowToStep",
      name: "Ship it",
      text: "Wrap the model in a small script, notebook, or web app so someone other than you can actually use it.",
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
      name: "Final Boss: End-to-End ML Project",
      item: "https://mlfs.online/chapters/15-final-boss/",
    },
  ],
};

export default function Page() {
  return (
    <ChapterShell slug="15-final-boss">
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
        Alright, you've made it. You've been through the trenches. You've debugged gradient descent,
        wrestled with recursion, and contemplated the philosophical implications of a biased
        dataset.
      </p>
      <p>Time to put it all together. This is the final boss.</p>
      <p>
        No more tutorials, no more hand-holding. This chapter is your capstone project. You will
        pick a quest, choose your weapons from the arsenal we've assembled, and build something from
        start to finish. Let's go.
      </p>

      <h2>The Mission: A Full ML Pipeline</h2>
      <p>
        A successful machine learning project is about so much more than the model itself. In the
        real world, the algorithm is often the easiest part. The real work—the stuff that separates
        the pros from the script kiddies—is in the process.
      </p>

      <h3>Step 1: Choose Your Dataset (The Quest)</h3>
      <p>The best way to learn is to work on something you're actually curious about. Go to a place like Kaggle, the UCI Machine Learning Repository, or Google Datasets and find a dataset that interests you.</p>
      <ul>
        <li>Into gaming? Grab a dataset on video game sales.</li>
        <li>A movie buff? Find one with IMDB ratings and reviews.</li>
        <li>A foodie? There are datasets on wine quality or restaurant reviews.</li>
      </ul>
      <p>Pick something that makes you want to find the answers.</p>

      <h3>Step 2: Define the Problem (The Strategy)</h3>
      <p>Before you write a line of code, answer these questions:</p>
      <ul>
        <li>What is the goal? What question are you trying to answer? (e.g., "Can I predict a movie's box office revenue?")</li>
        <li>Is this regression or classification? Is the target variable a continuous number (regression) or a discrete category (classification)?</li>
        <li>What will success look like? What is the key metric you will use to evaluate your model? Don't just say "accuracy." Think back to Chapter 12. If you're predicting customer churn, is a false positive or a false negative more costly? Choose your metric (Accuracy, Precision, Recall, F1-Score, MSE) accordingly.</li>
      </ul>

      <h3>Step 3: Exploratory Data Analysis (EDA) (Scouting the Terrain)</h3>
      <p>This is the most underrated part of any ML project. You need to understand your data before you can model it.</p>
      <ul>
        <li>Load the data using pandas.</li>
        <li>Clean it up. Are there missing values? How will you handle them (e.g., drop the rows, fill with the mean)? Are there weird outliers?</li>
        <li>Visualize it. Use matplotlib or seaborn to create plots. Histograms to see distributions. Scatter plots to see relationships between features. This is your chance to build intuition about the data.</li>
      </ul>

      <h3>Step 4: Build, Test, and Evaluate (The Battle)</h3>
      <p>Now, we use scikit-learn to do the heavy lifting.</p>
      <ul>
        <li>Split your data into a training set and a test set using <code>train_test_split</code>.</li>
        <li>Train multiple models. Don't just try one! Train a <code>LogisticRegression</code>, a <code>DecisionTreeClassifier</code>, and a <code>KNeighborsClassifier</code> (or <code>LinearRegression</code> if it's a regression problem).</li>
        <li>Use K-Fold Cross-Validation. For each model type, use <code>cross_val_score</code> to get a robust estimate of its performance on your chosen metric.</li>
        <li>Compare the models. Which one performed best on average according to your cross-validation scores? That's your champion.</li>
        <li>Final Evaluation. Train your champion model on the entire training set, and then do a final evaluation on the held-out test set. This is your final, honest score.</li>
      </ul>

      <RunnableCode
        title="capstone_skeleton.py"
        packages={["scikit-learn"]}
        code={`from sklearn.datasets import load_iris  # swap with your dataset
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import train_test_split, cross_val_score

X, y = load_iris(return_X_y=True)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)

candidates = {
    "logreg": LogisticRegression(max_iter=2000),
    "tree":   DecisionTreeClassifier(max_depth=4, random_state=0),
    "knn-3":  KNeighborsClassifier(n_neighbors=3),
}

print("--- cross-validated scores ---")
for name, clf in candidates.items():
    scores = cross_val_score(clf, X_tr, y_tr, cv=5)
    print(f"{name:>6}  cv mean {scores.mean():.3f}  std {scores.std():.3f}")

champion_name = max(candidates, key=lambda n: cross_val_score(candidates[n], X_tr, y_tr, cv=5).mean())
champion = candidates[champion_name]
champion.fit(X_tr, y_tr)
print(f"\\nchampion: {champion_name}")
print(f"final test accuracy: {champion.score(X_te, y_te):.3f}")`}
      />

      <h3>Step 5: Document It Like a Pro (The Victory Log)</h3>
      <p>If you build a model and can't explain what you did, you didn't really build it. Create a <code>README.md</code> file for your project on GitHub. It should be a simple, clear report that includes:</p>
      <ul>
        <li><strong>Problem Statement:</strong> What question were you trying to answer?</li>
        <li><strong>Data:</strong> A link to the dataset and a brief description.</li>
        <li><strong>Process:</strong> A summary of your EDA, cleaning, and modeling steps.</li>
        <li><strong>Results:</strong> A clear statement of your final model's performance on the test set, using the correct metrics.</li>
        <li><strong>Conclusions:</strong> What did you learn? Was your hypothesis correct? What would you try next?</li>
      </ul>

      <h2>Bonus Level: Deploying with Flask</h2>
      <p>Want to make your model feel real? Let's wrap it in a basic web API. This means you can send it new data over the internet and get a prediction back. We'll use Flask, a lightweight Python web framework.</p>
      <ol>
        <li><strong>Save your trained model.</strong> Use <code>joblib</code> or <code>pickle</code>.</li>
        <li><strong>Create a Flask app.</strong> A simple Python script (<code>app.py</code>).</li>
        <li><strong>Load the model</strong> in your Flask app.</li>
        <li>
          <strong>Create a <code>/predict</code> endpoint.</strong> This is a function that will:
          <ul>
            <li>Accept a POST request with new data (e.g., in JSON format).</li>
            <li>Feed that data into your loaded model's <code>.predict()</code> method.</li>
            <li>Return the prediction as a JSON response.</li>
          </ul>
        </li>
      </ol>
      <p>
        Running this script starts a local web server. You can now send requests to{" "}
        <code>http://127.0.0.1:5000/predict</code> and get live predictions from the model you built
        and trained. You've just taken your first step into the world of MLOps.
      </p>
      <p>
        The "Final Boss" isn't just one algorithm. It's the entire process. It's the discipline of
        defining a problem, the curiosity of exploring the data, the rigor of evaluating your work
        honestly, and the professionalism of communicating your results clearly. Master this loop,
        and you've mastered the core craft of machine learning.
      </p>

      <ChallengeBox title="Ship It!">
        <p>This is it. The final challenge of the book.</p>
        <ol>
          <li>Complete your end-to-end project. Don't cut corners.</li>
          <li>Push it to GitHub. Create a new public repository. Make sure it includes your code, your dataset (or a link to it), and your beautifully written <code>README.md</code> file.</li>
          <li>Share it. Post a link to your GitHub repository on LinkedIn, Twitter, or your personal blog. Write a short post summarizing what you did and what you learned.</li>
        </ol>
        <p>The final challenge isn't just to build something. It's to share it with the world. You've gone from zero to building and deploying a machine learning model. Be proud of that.</p>
        <p>Now go build something amazing.</p>
      </ChallengeBox>
    </ChapterShell>
  );
}
