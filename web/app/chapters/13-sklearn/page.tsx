import { ChapterShell } from "@/components/chapter-shell";
import { ChallengeBox } from "@/components/challenge-box";
import { RunnableCode } from "@/components/runnable-code";

export const metadata = { title: "Ch. 13 · From Scratch to Sklearn · MLFS" };

export default function Page() {
  return (
    <ChapterShell slug="13-sklearn">
      <p>
        You've done the hard work. You've implemented gradient descent by hand. You've built a
        recursive tree-splitter. You've coded up the beautiful, chaotic dance of K-Means centroids.
        You have stared into the void of backpropagation, and the void stared back.
      </p>
      <p>You have earned the shortcut.</p>
      <p>
        In this chapter, we're going to take our messy, beautiful, educational from-scratch code and
        refactor it into a few elegant lines of <strong>scikit-learn</strong>. This isn't cheating.
        This is graduating.
      </p>

      <h2>The "Why": Don't Reinvent the Wheel (Unless You're Learning How Wheels Work)</h2>
      <p>
        Let's be crystal clear. We built these algorithms from scratch for one reason: to understand
        what the hell is going on under the hood. You now know what a <code>learning_rate</code>{" "}
        actually does. You know what <code>n_neighbors</code> in a KNN model represents. You know
        that a <code>DecisionTreeClassifier</code> is just a machine for finding the best if/else
        statements.
      </p>
      <p>
        In the real world, you will almost never implement these algorithms from scratch for a
        production system. Why? Because libraries like scikit-learn are:
      </p>
      <ul>
        <li><strong>Optimized:</strong> Written in low-level languages like C and Cython for maximum speed. Your pure Python loops are charming, but slow.</li>
        <li><strong>Battle-Tested:</strong> Used and scrutinized by millions of developers. They've found and fixed bugs you haven't even dreamed of.</li>
        <li><strong>Feature-Rich:</strong> They include advanced solvers, clever initialization tricks (like k-means++), and tons of utility functions that would take you months to build.</li>
      </ul>
      <p>You built the go-kart from spare parts to learn how an engine works. Now it's time to drive the Formula 1 car.</p>

      <h2>Refactoring Our Greatest Hits</h2>
      <p>Let's see how the pros do it. We're going to take our models from Part 2 and show their sklearn equivalent. The difference will be... striking.</p>

      <h3>1. Linear Regression (Chapter 4)</h3>
      <p><strong>Our Scratch Code:</strong> ~50 lines of Python for <code>predict</code>, <code>loss</code>, <code>update</code>, and a training loop.</p>
      <p><strong>The Sklearn Way:</strong></p>

      <RunnableCode
        title="sklearn_linear.py"
        packages={["scikit-learn"]}
        code={`from sklearn.linear_model import LinearRegression
import numpy as np

X = np.array([[2], [3], [5], [6], [8]])   # sklearn expects 2D X
y = np.array([65, 70, 75, 85, 90])

model = LinearRegression()
model.fit(X, y)

print(f"Sklearn m: {model.coef_[0]:.2f}")
print(f"Sklearn b: {model.intercept_:.2f}")
print(f"Prediction for 7 hours: {model.predict([[7]])[0]:.2f}")`}
      />
      <p>Three lines. That's it. Our entire chapter's work, condensed.</p>

      <h3>2. K-Nearest Neighbors (Chapter 7)</h3>
      <p><strong>Our Scratch Code:</strong> ~20 lines for distance functions and a prediction function with loops and sorting.</p>
      <p><strong>The Sklearn Way:</strong></p>

      <RunnableCode
        title="sklearn_knn.py"
        packages={["scikit-learn"]}
        code={`from sklearn.neighbors import KNeighborsClassifier
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split

X, y = load_iris(return_X_y=True)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.3, random_state=0)

model = KNeighborsClassifier(n_neighbors=3)
model.fit(X_tr, y_tr)

print("test accuracy:", model.score(X_te, y_te))`}
      />

      <h3>3. Decision Tree (Chapter 6)</h3>
      <p><strong>Our Scratch Code:</strong> A complex recursive implementation with Gini Impurity calculations.</p>
      <p><strong>The Sklearn Way:</strong></p>

      <RunnableCode
        title="sklearn_tree.py"
        packages={["scikit-learn"]}
        code={`from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.datasets import load_iris

X, y = load_iris(return_X_y=True)

model = DecisionTreeClassifier(max_depth=3, random_state=42)
model.fit(X, y)

print("train accuracy:", model.score(X, y))
print(export_text(model, feature_names=load_iris().feature_names))`}
      />

      <h2>Comparing the Results: Why Aren't They Identical?</h2>
      <p>If you run your from-scratch model and the sklearn model on the same data, you might get slightly different results. Why?</p>
      <p>This is where your from-scratch knowledge pays off. You can reason about the differences:</p>
      <ul>
        <li><strong>Solvers:</strong> Your linear regression used basic gradient descent. sklearn's <code>LinearRegression</code> actually uses a more direct mathematical solution called Ordinary Least Squares (OLS). Other models might use more advanced optimizers like L-BFGS.</li>
        <li><strong>Initialization:</strong> Your K-Means used random point initialization. sklearn's default is <code>k-means++</code>, a smarter method that spreads out the initial centroids.</li>
        <li><strong>Hyperparameters:</strong> sklearn models have dozens of hyperparameters you can tune. The defaults are generally sensible, but they are making choices you might not have made in your simple version.</li>
      </ul>
      <p>
        This comparison is the ultimate validation. It proves you understand the core concepts well
        enough to see why the professional tools are better. You're no longer just a user of a black
        box; you're an informed operator who understands the machinery inside.
      </p>
      <p>
        This is what it means to use libraries with dignity. You use them not because you don't know
        how they work, but because you do, and you respect the engineering that has gone into making
        them so powerful and efficient.
      </p>

      <ChallengeBox title="The Sklearn Explorer">
        <p>Time to become a documentation detective.</p>
        <p>Pick one of the models we've covered (e.g., <code>LogisticRegression</code>, <code>DecisionTreeClassifier</code>, <code>KNeighborsClassifier</code>).</p>
        <p>Go to the official scikit-learn documentation page for that model.</p>
        <p>Read through the parameters. Find three hyperparameters that you can tune.</p>
        <p>For each one, answer these questions in a code comment:</p>
        <ol>
          <li>What is the name of the hyperparameter?</li>
          <li>What does it do, in plain English?</li>
          <li>How does it relate back to the concepts we learned when building the model from scratch?</li>
        </ol>
        <p>This will teach you one of the most valuable skills for a practicing ML engineer: reading the docs.</p>
      </ChallengeBox>
    </ChapterShell>
  );
}
