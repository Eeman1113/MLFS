import type { Metadata } from "next";
import { ChapterShell } from "@/components/chapter-shell";
import { ChallengeBox } from "@/components/challenge-box";
import { RunnableCode } from "@/components/runnable-code";
import { KNNExplorer } from "@/components/interactives/knn";

export const metadata: Metadata = {
  title: "Ch. 7 · KNN: The Neighborhood Watch",
  description:
    "K-Nearest Neighbors explained from scratch: distance metrics, choosing k, the curse of dimensionality, and why the simplest algorithm is sometimes best.",
  keywords: [
    "KNN",
    "k-nearest neighbors",
    "distance metrics",
    "lazy learning",
    "instance-based learning",
    "Euclidean distance",
    "curse of dimensionality",
    "KNN Python",
  ],
  alternates: { canonical: "/chapters/07-knn/" },
  openGraph: {
    title: "Ch. 7 · KNN: The Neighborhood Watch · MLFS",
    description:
      "K-Nearest Neighbors explained from scratch: distance metrics, choosing k, the curse of dimensionality, and why the simplest algorithm is sometimes best.",
    url: "https://mlfs.online/chapters/07-knn/",
    type: "article",
    authors: ["Eeman Majumder"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ch. 7 · KNN: The Neighborhood Watch · MLFS",
    description:
      "K-Nearest Neighbors explained from scratch: distance metrics, choosing k, the curse of dimensionality, and why the simplest algorithm is sometimes best.",
  },
};

const ARTICLE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Ch. 7 · KNN: The Neighborhood Watch",
  description:
    "K-Nearest Neighbors explained from scratch: distance metrics, choosing k, the curse of dimensionality, and why the simplest algorithm is sometimes best.",
  author: { "@type": "Person", name: "Eeman Majumder", url: "https://github.com/Eeman1113" },
  publisher: { "@type": "Person", name: "Eeman Majumder" },
  url: "https://mlfs.online/chapters/07-knn/",
  mainEntityOfPage: "https://mlfs.online/chapters/07-knn/",
  isPartOf: { "@type": "Book", name: "Machine Learning From Scratch", url: "https://mlfs.online/" },
  inLanguage: "en",
  image: "https://mlfs.online/chapters/07-knn/opengraph-image",
  proficiencyLevel: "Beginner",
  about: ["K-Nearest Neighbors", "Distance Metrics", "Lazy Learning"],
  datePublished: "2025-01-01",
  dateModified: "2026-05-25",
  timeRequired: "PT25M",
  wordCount: 2000,
  articleSection: "Core Machine Learning",
  learningResourceType: "lesson",
  educationalLevel: "Beginner",
  isAccessibleForFree: true,
  teaches: [
    "K-Nearest Neighbors algorithm",
    "Euclidean and Manhattan distance",
    "Choosing k",
    "Lazy learning",
    "The curse of dimensionality",
  ],
  keywords: [
    "KNN",
    "k-nearest neighbors",
    "distance metrics",
    "lazy learning",
    "instance-based learning",
    "Euclidean distance",
    "curse of dimensionality",
    "KNN Python",
  ],
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "h2"],
  },
  mentions: ["K-Nearest Neighbors", "Euclidean Distance", "Manhattan Distance", "Lazy Learning", "Curse of Dimensionality"],
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
      name: "KNN: The Neighborhood Watch",
      item: "https://mlfs.online/chapters/07-knn/",
    },
  ],
};

export default function Page() {
  return (
    <ChapterShell slug="07-knn">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <p>
        Alright, let's talk about the laziest, most intuitive, and possibly most relatable algorithm
        in all of machine learning: <strong>K-Nearest Neighbors (KNN)</strong>.
      </p>
      <p>
        If Decision Trees are your judgmental auntie, KNN is your chill, go-with-the-flow friend who
        makes decisions based purely on peer pressure. It has no grand theory, no complex model, no
        training phase. It operates on a single, simple principle: <strong>You are the company you
        keep.</strong>
      </p>
      <p>
        That's it. To classify a new, mysterious data point, KNN just looks at its closest neighbors
        and makes it join their clique. It's classification by social circle.
      </p>

      <h2>The Philosophy: No Training, Just Vibes</h2>
      <p>
        Seriously. KNN is a "lazy learner". This is a technical term, not an insult (mostly). Unlike
        linear regression or decision trees, KNN doesn't have a distinct "training" phase where it
        learns parameters like weights or rules.
      </p>
      <ul>
        <li><strong>Training a Linear Regression model:</strong> Find the best m and b.</li>
        <li><strong>Training a Decision Tree:</strong> Find the best questions to ask.</li>
        <li><strong>"Training" a KNN model:</strong> Store the entire training dataset in memory.</li>
      </ul>
      <p>...yep, that's the whole training process. It just memorizes every single data point. All the real work happens at prediction time, which is why it's called "lazy."</p>

      <h2>The Algorithm in 3 Simple Steps</h2>
      <p>Let's say we get a new data point and we want to classify it as a blue square or a red triangle.</p>

      <KNNExplorer />

      <p>Here's the entire KNN algorithm:</p>
      <ol>
        <li><strong>Calculate Distance:</strong> Measure the distance from our new point to every single other point in the dataset.</li>
        <li><strong>Find Neighbors:</strong> Find the k closest points. k is a number we choose.</li>
        <li><strong>Vote!</strong> Have the k neighbors vote on the class. Majority wins.</li>
      </ol>
      <p>The choice of k is crucial. It's a hyperparameter we have to tune.</p>

      <h2>From-Scratch Implementation: Let's Get Building</h2>
      <p>We're going to build this lazy beast from scratch. The core components are a distance function and a prediction function.</p>

      <h3>1. Distance Metrics: How We Travel</h3>
      <p>The concept of "closest" depends on how you measure distance. The two most common ways are <strong>Euclidean</strong> and <strong>Manhattan</strong> distance.</p>
      <ul>
        <li>
          <strong>Euclidean Distance:</strong> "As the crow flies." It's the straight-line distance
          between two points: √((x₂-x₁)² + (y₂-y₁)²). This is the default for most problems where
          features are continuous and comparable.
        </li>
        <li>
          <strong>Manhattan Distance:</strong> "The Taxicab distance." Imagine you're in a city with
          a perfect grid layout. You can't cut through buildings; you have to travel along the
          blocks. The Manhattan distance is the sum of the absolute differences along each axis:
          |x₂-x₁| + |y₂-y₁|. Better for high-dimensional data or features on different scales.
        </li>
      </ul>

      <RunnableCode
        title="distances.py"
        code={`import numpy as np

def euclidean_distance(p1, p2):
    return np.sqrt(np.sum((p1 - p2) ** 2))

def manhattan_distance(p1, p2):
    return np.sum(np.abs(p1 - p2))

a = np.array([1, 2])
b = np.array([4, 6])
print("euclidean:", euclidean_distance(a, b))
print("manhattan:", manhattan_distance(a, b))`}
      />

      <h3>2. The predict() Function</h3>
      <p>This function will orchestrate the whole process.</p>

      <RunnableCode
        title="knn_predict.py"
        code={`from collections import Counter
import numpy as np

def euclidean(p1, p2):
    return np.sqrt(np.sum((p1 - p2) ** 2))

def predict_knn(X_train, y_train, new_point, k, dist=euclidean):
    distances = [dist(new_point, x) for x in X_train]
    nearest = np.argsort(distances)[:k]
    labels = [y_train[i] for i in nearest]
    return Counter(labels).most_common(1)[0][0]

X = np.array([[1,2], [2,3], [3,3], [6,5], [7,7], [8,8]])
y = np.array(["A", "A", "A", "B", "B", "B"])
print("prediction for (4, 4):", predict_knn(X, y, np.array([4, 4]), k=3))
print("prediction for (7, 7):", predict_knn(X, y, np.array([7, 7]), k=3))`}
      />

      <p>And that's it! A fully functional KNN classifier. So simple, so elegant. What could possibly go wrong?</p>

      <h2>The Curse of Dimensionality: Lost in High-Dimensional Space</h2>
      <p>
        Here's KNN's Achilles' heel. The algorithm relies entirely on the idea of "distance." But
        what happens to distance when you have a lot of features (dimensions)?
      </p>
      <p><strong>Analogy: Finding Your Friend</strong></p>
      <ul>
        <li><strong>1 Dimension:</strong> Your friend is somewhere on a 100-meter line. You can probably find them pretty quickly.</li>
        <li><strong>2 Dimensions:</strong> Your friend is somewhere on a 100m × 100m field. It's harder, but the concept of "nearby" still makes sense.</li>
        <li><strong>3 Dimensions:</strong> Your friend is in a 100m × 100m × 100m building. Now it's getting really tough.</li>
        <li><strong>1000 Dimensions:</strong> Your friend is in a 1000-dimensional hypercube. Good luck. You'll never see them again.</li>
      </ul>
      <p>
        This is the <strong>Curse of Dimensionality</strong>. As you add more dimensions, the volume
        of the space increases exponentially. Your data points, which might have been dense in a few
        dimensions, become incredibly sparse. Everything becomes far away from everything else. The
        concept of a "nearest neighbor" becomes meaningless because even your closest neighbor might
        be astronomically far away.
      </p>
      <p>
        This isn't just a problem for KNN; it's a fundamental challenge in all of machine learning.
        It's the reason why simply adding more features to your model often makes it worse, not
        better. It increases the risk of finding random, meaningless patterns (overfitting) and
        breaks algorithms that rely on distance. This is the primary motivation for an entire
        subfield of ML dedicated to <strong>dimensionality reduction</strong>—techniques that try to
        squash high-dimensional data down to a lower-dimensional space while preserving the
        important information.
      </p>
      <p>So while KNN is simple and effective in low dimensions, it gets lost in space as your feature count grows.</p>

      <ChallengeBox title="Find the Right K">
        <p>Let's explore the most important hyperparameter in KNN: k.</p>
        <p>Grab a standard dataset like the Iris or Breast Cancer dataset from <code>sklearn.datasets</code>.</p>
        <p>Split it into a training and testing set.</p>
        <p>Using your from-scratch <code>predict_knn</code> function, write a loop that trains and evaluates the model for different values of k (from 1 to, say, 21, using only odd numbers to avoid ties).</p>
        <p>For each k, calculate the accuracy on the test set.</p>
        <p>Plot the accuracy as a function of k.</p>
        <p>Analyze the plot:</p>
        <ul>
          <li>What happens when k=1? Is the accuracy high or low? Why might this be a case of high variance (overfitting)?</li>
          <li>What happens when k is very large (e.g., the size of the entire training set)? What does the model predict every time? Why is this a case of high bias (underfitting)?</li>
        </ul>
        <p>You've just manually plotted your first bias-variance tradeoff curve, one of the most important concepts for debugging any ML model.</p>
        <RunnableCode
          title="find_k.py"
          packages={["scikit-learn"]}
          code={`from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from collections import Counter
import numpy as np

iris = load_iris()
X_tr, X_te, y_tr, y_te = train_test_split(iris.data, iris.target, test_size=0.3, random_state=42)

def euclidean(p1, p2):
    return np.sqrt(np.sum((p1 - p2) ** 2))
def predict_knn(X_train, y_train, p, k):
    d = [euclidean(p, x) for x in X_train]
    idx = np.argsort(d)[:k]
    return Counter([y_train[i] for i in idx]).most_common(1)[0][0]

for k in [1, 3, 5, 7, 9, 11, 21]:
    preds = [predict_knn(X_tr, y_tr, p, k) for p in X_te]
    acc = np.mean(np.array(preds) == y_te)
    print(f"k={k:2d}  acc={acc:.3f}")`}
        />
      </ChallengeBox>
    </ChapterShell>
  );
}
