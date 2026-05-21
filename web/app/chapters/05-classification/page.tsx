import { ChapterShell } from "@/components/chapter-shell";
import { ChallengeBox } from "@/components/challenge-box";
import { RunnableCode } from "@/components/runnable-code";
import { Math } from "@/components/math";
import { SigmoidExplorer } from "@/components/interactives/sigmoid";
import { DecisionBoundaryExplorer } from "@/components/interactives/logistic";

export const metadata = { title: "Ch. 5 · Classification · MLFS" };

export default function Page() {
  return (
    <ChapterShell slug="05-classification">
      <p>
        Great, you've taught a machine to draw a straight line. Impressive. You can now predict
        house prices, exam scores, and other things that live on a continuous number line.
      </p>
      <p>But what about the questions that really matter?</p>
      <ul>
        <li>Is this email spam? (Yes/No)</li>
        <li>Is this credit card transaction fraudulent? (Yes/No)</li>
        <li>Is this a picture of a hot dog? (Hot Dog/Not Hot Dog)</li>
      </ul>
      <p>
        These are classification problems. We don't want a number; we want a decision. A simple
        "yes" or "no." Let's teach our model how to make a choice.
      </p>

      <h2>Why Linear Regression Fails for Classification</h2>
      <p>
        Your first instinct might be to just use the linear regression model we just built. Let's
        say "No" is class 0 and "Yes" is class 1. Why can't we just fit a line to that?
      </p>
      <p>
        Let's try it. Imagine we're predicting whether a tumor is malignant (1) or benign (0) based
        on its size. See the problem? Our beautiful line shoots off to infinity in both directions.
        It can predict a value of 1.8, or -0.4. What does a "malignancy probability" of 180% even
        mean? Or -40%? It's nonsense. It breaks our 0-or-1 world.
      </p>
      <p>
        We need a new tool. We need something that takes the output of our linear equation and
        squishes it into a sensible range: between 0 and 1.
      </p>

      <h2>Enter the Sigmoid Function: The OG 'Squishinator'</h2>
      <p>
        Meet your new best friend: the <strong>Sigmoid function</strong>. It's a beautiful, elegant,
        S-shaped curve that is the absolute hero of binary classification.
      </p>
      <p>The formula is:</p>
      <Math>{`\\sigma(z) = \\frac{1}{1 + e^{-z}}`}</Math>
      <p>
        Where <span><Math>{`z`}</Math></span> is just the output of our old friend, the linear equation:{" "}
        <Math>{`z = mx + b`}</Math>.
      </p>

      <SigmoidExplorer />

      <p>Look at its properties:</p>
      <ul>
        <li>It takes any real number, from negative infinity to positive infinity.</li>
        <li>It squishes that number into a range between 0 and 1.</li>
        <li>A very large positive input for <code>z</code> gets mapped close to 1.</li>
        <li>A very large negative input for <code>z</code> gets mapped close to 0.</li>
        <li>An input of <code>z=0</code> gets mapped to exactly 0.5.</li>
      </ul>
      <p>
        This is exactly what we need! We can now interpret the output of the sigmoid function as a{" "}
        <strong>probability</strong>.
      </p>
      <ul>
        <li>If our model outputs 0.98, it's 98% sure the answer is "Yes" (Class 1).</li>
        <li>If it outputs 0.05, it's 95% sure the answer is "No" (or 5% sure it's "Yes").</li>
        <li>If it outputs 0.5, it's completely uncertain. Flip a coin.</li>
      </ul>
      <p>
        The sigmoid is like a translator that turns the raw, unbounded "score" from our linear model
        into a calibrated, understandable probability.
      </p>

      <h2>DIY Logistic Regression: It's a Trap!</h2>
      <p>
        Now we're going to build a <strong>Logistic Regression</strong> model from scratch. And
        here's the secret that confuses everyone: despite its name, Logistic Regression is for{" "}
        <strong>CLASSIFICATION</strong>, not regression. The name is a historical accident designed
        to trip up beginners. Don't fall for it.
      </p>
      <p>You're about to have a "wait a minute..." moment, because the code is going to look suspiciously familiar.</p>

      <h3>Step 1: The predict() function</h3>
      <p>This is almost the same as before, but we just wrap our linear equation in our new sigmoid function.</p>

      <RunnableCode
        title="step1_predict.py"
        code={`import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def predict_proba(X, m, b):
    z = m * X + b
    return sigmoid(z)

X = np.array([1, 2, 3, 6, 7, 8])
print(predict_proba(X, m=1.5, b=-7))`}
      />

      <h3>Step 2: The loss() function (Binary Cross-Entropy)</h3>
      <p>
        We can't use Mean Squared Error anymore. For classification, we need a loss function that
        punishes the model when it's confidently wrong. We use <strong>Binary Cross-Entropy</strong>{" "}
        (or Log Loss).
      </p>
      <Math>{`\\text{Loss} = -\\frac{1}{n} \\sum_{i=1}^{n} \\big[ y_i \\log(\\hat{y}_i) + (1-y_i) \\log(1-\\hat{y}_i) \\big]`}</Math>
      <ul>
        <li>If the true label is 1, the loss is <Math>{`-\\log(\\hat{y}_i)`}</Math>. Predict 0.99 → loss tiny. Predict 0.01 → loss huge.</li>
        <li>If the true label is 0, the loss is <Math>{`-\\log(1-\\hat{y}_i)`}</Math>. Same logic in reverse.</li>
      </ul>

      <RunnableCode
        title="step2_loss.py"
        code={`import numpy as np

def loss(y_true, y_pred):
    eps = 1e-15
    y_pred = np.clip(y_pred, eps, 1 - eps)
    return -np.mean(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred))

y_true = np.array([0, 0, 0, 1, 1, 1])
y_pred_confident_right = np.array([0.02, 0.05, 0.1, 0.9, 0.95, 0.98])
y_pred_confident_wrong = np.array([0.9, 0.95, 0.99, 0.05, 0.05, 0.01])

print("Confidently right:", loss(y_true, y_pred_confident_right))
print("Confidently wrong:", loss(y_true, y_pred_confident_wrong))`}
      />

      <p>This loss function brutally punishes the model for being cocky and wrong, which is exactly what we want.</p>

      <h3>Step 3: The update() function (Still Gradient Descent!)</h3>
      <p>
        Guess what? The update mechanism is still Gradient Descent. The derivative of the Binary
        Cross-Entropy loss with respect to our parameters <code>m</code> and <code>b</code> turns
        out to be surprisingly simple.
      </p>
      <ul>
        <li><Math>{`\\frac{\\partial L}{\\partial m} = \\text{mean}((\\hat{y} - y) \\cdot X)`}</Math></li>
        <li><Math>{`\\frac{\\partial L}{\\partial b} = \\text{mean}(\\hat{y} - y)`}</Math></li>
      </ul>
      <p>
        The update loop looks identical to the one in linear regression. We just swapped out the
        engine parts (<code>predict</code> and <code>loss</code> functions), but the chassis is the
        same.
      </p>
      <p>
        This reveals a fundamental concept in ML: algorithms are often just clever combinations of
        simpler pieces. We didn't learn a totally new algorithm; we learned a "plugin" (the sigmoid
        function and a new loss) that adapted our linear model for a new task.
      </p>

      <h2>Decision Boundaries: Drawing the Line (Literally)</h2>
      <p>So what does our trained logistic regression model actually do? It learns a <strong>decision boundary</strong>. For a 2D problem, this is a line.</p>

      <DecisionBoundaryExplorer />

      <p>
        The model has learned a line that best separates the 'O's from the 'X's. Any new point that
        falls on one side of the line is classified as 'X', and any point on the other is classified
        as 'O'. This is how the model makes its decision. It's not just predicting probabilities;
        it's literally drawing a line in the sand.
      </p>

      <ChallengeBox title="The XOR Problem">
        <p>You've built a powerful classifier. It can separate data with a straight line. But what happens when a straight line isn't enough?</p>
        <p>Create the classic XOR dataset:</p>
        <ul>
          <li>Inputs: <code>[[0, 0], [0, 1], [1, 0], [1, 1]]</code></li>
          <li>Outputs: <code>[0, 1, 1, 0]</code></li>
        </ul>
        <p>Try to train your from-scratch Logistic Regression model on this data.</p>
        <p>Plot the loss curve. What happens? Does it converge?</p>
        <p>
          Explain why it fails. Can you draw a single straight line that can separate the XOR data
          points if you plot them?
        </p>
        <p>
          This failure is not a bug in your code. It's a fundamental limitation of linear models.
          And it's the perfect motivation for why we're going to need something much more powerful:
          Neural Networks.
        </p>
        <RunnableCode
          title="xor_challenge.py"
          code={`import numpy as np

X = np.array([[0,0],[0,1],[1,0],[1,1]])
y = np.array([0, 1, 1, 0])

# Logistic regression with 2 features
w = np.zeros(2)
b = 0.0
lr = 0.5
for i in range(2000):
    z = X @ w + b
    p = 1 / (1 + np.exp(-z))
    err = p - y
    w -= lr * X.T @ err / len(y)
    b -= lr * err.mean()

print("weights:", w)
print("bias   :", b)
print("preds  :", (1/(1+np.exp(-(X @ w + b)))).round(2))
print("truth  :", y)`}
        />
      </ChallengeBox>
    </ChapterShell>
  );
}
