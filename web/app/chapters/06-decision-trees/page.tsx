import { ChapterShell } from "@/components/chapter-shell";
import { ChallengeBox } from "@/components/challenge-box";
import { RunnableCode } from "@/components/runnable-code";
import { Math } from "@/components/math";
import { GiniSplitExplorer, PrettyTree } from "@/components/interactives/decision-tree";

export const metadata = { title: "Ch. 6 · Decision Trees · MLFS" };

export default function Page() {
  return (
    <ChapterShell slug="06-decision-trees">
      <p>
        So far, the models we've built have been a bit... abstract. They find the best-fit line or
        the best-separating plane by fiddling with weights and biases. They give us an answer, but
        the reasoning is hidden inside a mathematical formula.
      </p>
      <p>Now, let's build a model you can argue with. A model that's as transparent as it is judgmental.</p>
      <p>Meet the <strong>Decision Tree</strong>.</p>
      <p>
        Imagine an algorithm that makes decisions like a paranoid, hyper-specific auntie asking 20
        questions before letting you borrow her car. "Is the weather nice? Are you going on the
        highway? Did you check the tire pressure? Is your friend Chad going with you? I don't like
        Chad."
      </p>
      <p>
        That's a Decision Tree. It's basically a flowchart on steroids, and it's one of the most
        intuitive and interpretable models in all of machine learning.
      </p>

      <h2>A Flowchart That Learns</h2>
      <p>
        Remember Chapter 1? We said a Decision Tree is just a flowchart that an algorithm learns
        from data. That's literally it.
      </p>

      <PrettyTree />

      <p>Each internal node is a question about a feature (e.g., "Is age &lt; 30?").</p>
      <p>Each branch is an answer to that question (e.g., "Yes" or "No").</p>
      <p>Each leaf node is a final decision or prediction (e.g., "Class = 'Buys the Product'").</p>
      <p>The genius of the algorithm is that it figures out the best questions to ask, and in what order, to make the most accurate predictions.</p>

      <h2>The Big Question: What's the Best Question?</h2>
      <p>
        How does the tree decide to ask "Is age &lt; 30?" instead of "Is income &gt; $50k?" It needs
        a way to measure how "good" a question is. A good question is one that splits a mixed group
        of data into purer, more organized subgroups.
      </p>
      <p>We measure this purity (or lack thereof) with metrics like <strong>Gini Impurity</strong> or <strong>Entropy</strong>.</p>
      <p><strong>Analogy: The Fruit Basket of Chaos</strong></p>
      <p>Imagine you have a basket of 10 fruits.</p>
      <ul>
        <li>
          <strong>Scenario 1: Perfect Purity.</strong> The basket has 10 apples. If you reach in,
          you're 100% certain you'll grab an apple. The chaos is zero.
          <ul>
            <li>Gini Impurity = 0</li>
            <li>Entropy = 0</li>
          </ul>
        </li>
        <li>
          <strong>Scenario 2: Maximum Impurity.</strong> The basket has 5 apples and 5 oranges. It's
          a 50/50 shot. The chaos is at its maximum. You have no idea what you'll get.
          <ul>
            <li>Gini Impurity = 0.5 (for a two-class problem)</li>
            <li>Entropy = 1.0</li>
          </ul>
        </li>
      </ul>
      <p>
        The Decision Tree algorithm works by trying out every possible split on every feature. For
        each split, it calculates the impurity of the resulting child nodes. It then chooses the
        split that results in the biggest decrease in impurity. This decrease is called{" "}
        <strong>Information Gain</strong>. The tree is greedy; it always picks the split that gives
        it the most information right now.
      </p>

      <GiniSplitExplorer />

      <ul>
        <li>
          <strong>Gini Impurity:</strong> The probability of incorrectly classifying a randomly
          chosen element if it were randomly labeled according to the distribution of labels in the
          subset. It's computationally faster than Entropy because it doesn't involve a logarithm.
          <Math>{`G = 1 - \\sum_{i=1}^{C} (p_i)^2`}</Math>
        </li>
        <li>
          <strong>Entropy:</strong> A concept from information theory measuring the level of
          uncertainty or randomness.
          <Math>{`H = -\\sum_{i=1}^{C} p_i \\log_2(p_i)`}</Math>
        </li>
      </ul>
      <p>
        In practice, they both do a very similar job. Gini is the default for many libraries (like
        scikit-learn's CART algorithm) because it's a bit quicker to compute.
      </p>

      <h2>From-Scratch Implementation: Building the Tree Recursively</h2>
      <p>Building a decision tree is a classic example of a recursive algorithm.</p>
      <ul>
        <li>
          <strong>find_best_split():</strong> This is the workhorse function. It needs to:
          <ol>
            <li>Loop through every column (feature) in the data.</li>
            <li>Loop through every unique value in that column (as a potential split point).</li>
            <li>For each potential split, divide the data into two groups (left and right).</li>
            <li>Calculate the Gini Impurity of the split (a weighted average of the impurity of the two child nodes).</li>
            <li>Keep track of the split that produced the lowest Gini Impurity so far.</li>
          </ol>
          Return the best feature and split value.
        </li>
        <li>
          <strong>build_tree():</strong> This is the recursive function.
          <ul>
            <li>It takes a dataset (a node) as input.</li>
            <li>It calls <code>find_best_split()</code> on that data.</li>
            <li>
              <strong>Base Case (Stopping Condition):</strong> If a stopping condition is met, it
              becomes a leaf node and returns a prediction (e.g., the majority class of the data
              points at that node). Stopping conditions could be:
              <ul>
                <li>The node is perfectly pure (Gini = 0).</li>
                <li>The tree has reached a <code>max_depth</code> we defined.</li>
                <li>The number of samples in the node is below a <code>min_samples_leaf</code> threshold.</li>
              </ul>
            </li>
            <li>
              <strong>Recursive Step:</strong> If no stopping condition is met, it creates a new
              internal node based on the best split. It then calls <code>build_tree()</code> on the
              left group and the right group, assigning the results to the left and right branches
              of the current node.
            </li>
          </ul>
        </li>
      </ul>

      <RunnableCode
        title="tree_pseudo.py"
        code={`# Super simplified pseudo-code
def build_tree(data):
    if is_pure(data) or reached_max_depth(data):
        return create_leaf_node(data)        # majority class

    best_feature, best_value = find_best_split(data)
    left_data, right_data = split(data, best_feature, best_value)

    left_subtree = build_tree(left_data)
    right_subtree = build_tree(right_data)

    return Node(
        question=(best_feature, best_value),
        left_branch=left_subtree,
        right_branch=right_subtree,
    )

# Real demo: a one-split tree on a toy dataset
import numpy as np
X = np.array([1, 1.5, 2, 3, 4, 5, 6])
y = np.array([0, 0, 0, 1, 1, 1, 1])
def gini(labels):
    if len(labels) == 0: return 0
    p1 = labels.mean()
    return 1 - p1**2 - (1-p1)**2

best_t, best_g = None, 1.0
for t in np.linspace(1, 6, 20):
    L = y[X <= t]; R = y[X > t]
    g = (len(L) * gini(L) + len(R) * gini(R)) / len(y)
    if g < best_g:
        best_g, best_t = g, t
print(f"best threshold ≈ {best_t:.2f}, weighted gini {best_g:.3f}")`}
      />

      <h2>Overfitting: When the Tree Becomes a Forest Fire</h2>
      <p>
        What happens if you don't set any stopping conditions? The tree will keep splitting and
        splitting until every single leaf node is perfectly pure. It might even create a leaf node
        for a single, noisy data point.
      </p>
      <p>This is <strong>overfitting</strong>, and decision trees are notoriously prone to it.</p>
      <p><strong>Analogy: The Over-Specific Student</strong></p>
      <p>Imagine a student studying for a history exam.</p>
      <ul>
        <li>A <strong>good student</strong> learns the general patterns: "Revolutions are often caused by economic inequality and new political ideas."</li>
        <li>An <strong>overfit student</strong> memorizes hyper-specific, useless facts: "On October 5th, 1789, a man named Dave in Paris complained about the price of bread while wearing a blue hat."</li>
      </ul>
      <p>The overfit student gets 100% on the practice questions that cover Dave, but when the real exam asks a general question about the causes of the French Revolution, they have no idea what to say.</p>
      <p>
        An overfit decision tree is the same. It learns the noise and quirks of the training data
        perfectly, resulting in a ridiculously complex tree that looks like a spider web. It
        performs great on the data it has seen, but it fails spectacularly on new, unseen data.
      </p>
      <p>The solution is <strong>pruning</strong>. This can be:</p>
      <ul>
        <li><strong>Pre-pruning (Early Stopping):</strong> Don't let the tree grow too deep in the first place. This is what our <code>max_depth</code> and <code>min_samples_leaf</code> hyperparameters do.</li>
        <li><strong>Post-pruning:</strong> Grow the full tree first, then go back and remove branches that don't provide much information gain.</li>
      </ul>
      <p>
        By limiting the tree's complexity, we force it to learn the general patterns, not the noise.
        This is a crucial step in building a tree that actually works in the real world. The tree's
        greatest strength—its ability to create specific rules—is also its greatest weakness. Its
        interpretability is a direct window into its fragility; a small change in the input data can
        lead to a completely different set of learned rules. This sensitivity is exactly why more
        robust methods, like Random Forests (which we'll hint at later), were invented—they build an
        entire committee of these unstable trees and let them vote, turning a collection of shaky
        experts into a wise crowd.
      </p>

      <ChallengeBox title="Visualize Your Judgment">
        <p>You've built a tree from scratch. Now let's make it talk.</p>
        <p>Write a <code>print_tree()</code> function that takes your trained tree (the root node) and prints out the rules in a human-readable, indented format.</p>
        <RunnableCode
          title="print_tree.py"
          code={`# Example output target
example = '''
if (petal_width_cm <= 0.8):
--> predicts: setosa
else:
--> if (petal_length_cm <= 4.95):
    --> predicts: versicolor
    --> else:
        --> predicts: virginica
'''
print(example)

# Try this: build a tiny tree using sklearn (Pyodide ships it!)
# and then walk it to print the rules.
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.datasets import load_iris

iris = load_iris()
clf = DecisionTreeClassifier(max_depth=3, random_state=0).fit(iris.data, iris.target)
print(export_text(clf, feature_names=iris.feature_names))`}
          packages={["scikit-learn"]}
        />
        <p>Train your tree on a simple, classic dataset like the Iris dataset.</p>
        <p>Use your new function to print the learned rules. Do they make intuitive sense? Can you follow the logic from the root to a leaf?</p>
        <p>This is the superpower of decision trees. You're not just getting a prediction; you're getting an explanation.</p>
      </ChallengeBox>
    </ChapterShell>
  );
}
