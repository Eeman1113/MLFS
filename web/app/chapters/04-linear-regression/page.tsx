import type { Metadata } from "next";
import { ChapterShell } from "@/components/chapter-shell";
import { ChallengeBox } from "@/components/challenge-box";
import { RunnableCode } from "@/components/runnable-code";
import { LinearRegressionTrainer } from "@/components/interactives/linear-regression";
import { Math, tex } from "@/components/math";
import { Highchart } from "@/components/highchart";
import { palette } from "@/lib/palette";

export const metadata: Metadata = {
  title: "Ch. 4 · DIY Linear Regression",
  description:
    "Build linear regression from scratch in Python and NumPy — the gateway drug to all of supervised ML. Interactive demo with gradient descent included.",
  keywords: [
    "linear regression",
    "regression from scratch",
    "supervised learning",
    "least squares",
    "ML tutorial",
    "gradient descent",
    "linear regression Python",
    "regression NumPy",
  ],
  alternates: { canonical: "/chapters/04-linear-regression/" },
  openGraph: {
    title: "Ch. 4 · DIY Linear Regression · MLFS",
    description:
      "Build linear regression from scratch in Python and NumPy — the gateway drug to all of supervised ML. Interactive demo with gradient descent included.",
    url: "https://mlfs.online/chapters/04-linear-regression/",
    type: "article",
    authors: ["Eeman Majumder"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ch. 4 · DIY Linear Regression · MLFS",
    description:
      "Build linear regression from scratch in Python and NumPy — the gateway drug to all of supervised ML. Interactive demo with gradient descent included.",
  },
};

const ARTICLE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Ch. 4 · DIY Linear Regression",
  description:
    "Build linear regression from scratch in Python and NumPy — the gateway drug to all of supervised ML. Interactive demo with gradient descent included.",
  author: { "@type": "Person", name: "Eeman Majumder", url: "https://github.com/Eeman1113" },
  publisher: { "@type": "Person", name: "Eeman Majumder" },
  url: "https://mlfs.online/chapters/04-linear-regression/",
  isPartOf: { "@type": "Book", name: "Machine Learning From Scratch", url: "https://mlfs.online/" },
  inLanguage: "en",
  image: "https://mlfs.online/opengraph-image",
  proficiencyLevel: "Beginner",
  about: ["Linear Regression", "Supervised Learning", "Gradient Descent"],
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
      name: "DIY Linear Regression",
      item: "https://mlfs.online/chapters/04-linear-regression/",
    },
  ],
};

const studyHours = [
  [2, 65],
  [3, 70],
  [5, 75],
  [6, 85],
  [8, 90],
];

export default function Page() {
  return (
    <ChapterShell slug="04-linear-regression">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <p>
        Alright, buckle up. The theory is over. The hand-holding is done. It's time to write some
        code and build our very first model from scratch. No <code>sklearn</code>, no <code>Keras</code>,
        no magic black boxes. We're opening up the machine and building the engine ourselves with
        nothing but Python and NumPy.
      </p>
      <p>Why? Because once you've built a car engine with your own hands, you'll never be afraid to look under the hood again.</p>
      <p>
        Our mission is to build a <strong>Linear Regression</strong> model. It's the "Hello, World!"
        of machine learning. The goal is simple: predict a continuous value (like a house price or
        an exam score) by fitting a straight line to the data.
      </p>

      <h2>The Goal: Predicting Stuff with a Straight Line</h2>
      <p>
        Let's imagine a simple problem. We want to predict a student's final exam score based on the
        number of hours they studied. We have some data:
      </p>
      <table>
        <thead>
          <tr>
            <th>Hours Studied (x)</th>
            <th>Exam Score (y)</th>
          </tr>
        </thead>
        <tbody>
          {studyHours.map(([x, y]) => (
            <tr key={x}>
              <td>{x}</td>
              <td>{y}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Highchart
        height={300}
        options={{
          title: { text: "Exam score vs. hours studied" },
          xAxis: { title: { text: "Hours" }, min: 0, max: 10 },
          yAxis: { title: { text: "Score" }, min: 50, max: 100 },
          series: [
            { type: "scatter", name: "data", data: studyHours, color: palette.series[0], marker: { radius: 6 } },
            {
              type: "line",
              name: "best-fit (preview)",
              color: palette.series[1],
              data: [
                [1, 60],
                [9, 95],
              ] as [number, number][],
              dashStyle: "Dash",
              marker: { enabled: false },
            },
          ],
        }}
      />

      <p>
        You can see a clear trend: more hours studied generally leads to a higher score. A straight
        line seems like a reasonable way to model this relationship. And what's the equation for a
        straight line? You know this from middle school.
      </p>
      <Math>{tex`y = mx + b`}</Math>
      <ul>
        <li><strong>y:</strong> The value we want to predict (Exam Score).</li>
        <li><strong>x:</strong> Our input feature (Hours Studied).</li>
        <li><strong>m:</strong> The slope of the line. How much the score increases for each extra hour of study.</li>
        <li><strong>b:</strong> The y-intercept (or bias). The score someone would get with 0 hours of study (maybe they're just a genius).</li>
      </ul>
      <p>
        In machine learning, we often call <strong>m</strong> the <strong>weight</strong> and{" "}
        <strong>b</strong> the <strong>bias</strong>. The "learning" part of linear regression is
        just finding the best possible values for <strong>m</strong> and <strong>b</strong> that
        make our line fit the data as closely as possible.
      </p>

      <h2>Code-First Implementation: Let's Get Our Hands Dirty</h2>
      <p>Let's fire up our editor and build this thing piece by piece.</p>

      <h3>Step 1: The predict() Function</h3>
      <p>
        First, we need a function that, given an input <code>x</code> and our line's parameters{" "}
        <code>m</code> and <code>b</code>, can predict what <code>y</code> should be. This is just
        the line equation.
      </p>

      <RunnableCode
        title="step1_predict.py"
        code={`import numpy as np

# Let's start with some random guesses for our parameters
m = 0.5
b = 20

# Our data
X = np.array([2, 3, 5, 6, 8])
y_true = np.array([65, 70, 75, 85, 90])

def predict(X, m, b):
    # y = mx + b
    return m * X + b

y_pred = predict(X, m, b)
print(y_pred)`}
      />

      <h3>Step 2: The loss() Function (Mean Squared Error)</h3>
      <p>
        Our model is terrible. But how terrible? We need to quantify the error. We'll use the most
        common loss function for regression: <strong>Mean Squared Error (MSE)</strong>.
      </p>
      <p>The logic is simple:</p>
      <ol>
        <li>For each data point, calculate the difference between the true score and our predicted score. This is the <strong>error</strong>.</li>
        <li>
          <strong>Square</strong> the error. This makes all errors positive and punishes big errors
          way more than small ones. An error of 4 becomes 16, while an error of 2 only becomes 4.
        </li>
        <li>Calculate the <strong>average</strong> of all these squared errors.</li>
      </ol>
      <Math>{tex`\text{MSE} = \frac{1}{n} \sum_{i=1}^{n} (y_{\text{true}, i} - y_{\text{pred}, i})^2`}</Math>

      <RunnableCode
        title="step2_loss.py"
        code={`import numpy as np

m, b = 0.5, 20
X = np.array([2, 3, 5, 6, 8])
y_true = np.array([65, 70, 75, 85, 90])

def predict(X, m, b):
    return m * X + b

def loss(y_true, y_pred):
    return np.mean((y_true - y_pred)**2)

y_pred = predict(X, m, b)
print("Initial Loss:", loss(y_true, y_pred))`}
      />

      <h3>Step 3: The update() Function (Gradient Descent)</h3>
      <p>
        This is the heart of the machine. How do we find better values for <code>m</code> and{" "}
        <code>b</code>? We use the "blindfolded hiker" method: Gradient Descent.
      </p>
      <p>
        We need to calculate the gradient of our loss function. The gradient is just a vector of
        partial derivatives—one for <code>m</code> and one for <code>b</code>. These derivatives
        tell us the slope of the loss with respect to each parameter.
      </p>
      <p>I'll spare you the full calculus derivation. The partial derivatives of our MSE loss function are:</p>
      <ul>
        <li>Derivative w.r.t. m: <Math>{tex`\frac{\partial L}{\partial m} = -2 \cdot \text{mean}\left(X \cdot (y_{\text{true}} - y_{\text{pred}})\right)`}</Math></li>
        <li>Derivative w.r.t. b: <Math>{tex`\frac{\partial L}{\partial b} = -2 \cdot \text{mean}\left(y_{\text{true}} - y_{\text{pred}}\right)`}</Math></li>
      </ul>
      <p>To descend the hill, we just need to take a small step in the <em>opposite</em> direction of the gradient.</p>

      <RunnableCode
        title="step3_update.py"
        code={`import numpy as np

learning_rate = 0.01

def update(X, y_true, y_pred, m, b, lr):
    dm = -2 * np.mean(X * (y_true - y_pred))
    db = -2 * np.mean(y_true - y_pred)
    return m - lr * dm, b - lr * db

X = np.array([2, 3, 5, 6, 8])
y_true = np.array([65, 70, 75, 85, 90])
m, b = 0.0, 0.0
for i in range(5):
    y_pred = m * X + b
    m, b = update(X, y_true, y_pred, m, b, learning_rate)
    print(f"after step {i+1}: m={m:.3f} b={b:.3f}")`}
      />

      <h2>Putting It All Together: The Training Loop</h2>
      <p>
        Now we just need to put these pieces into a loop. We'll repeat the process of predicting,
        calculating loss, and updating our parameters for a set number of times (called{" "}
        <strong>epochs</strong>).
      </p>

      <RunnableCode
        title="train.py"
        code={`import numpy as np

X = np.array([2, 3, 5, 6, 8])
y_true = np.array([65, 70, 75, 85, 90])

m, b = 0.0, 0.0
epochs = 1000
lr = 0.01
loss_history = []

for i in range(epochs):
    y_pred = m * X + b
    cur_loss = np.mean((y_true - y_pred) ** 2)
    loss_history.append(cur_loss)
    if i % 100 == 0:
        print(f"epoch {i:4d} | loss {cur_loss:7.2f} | m {m:5.2f} | b {b:5.2f}")
    dm = -2 * np.mean(X * (y_true - y_pred))
    db = -2 * np.mean(y_true - y_pred)
    m -= lr * dm
    b -= lr * db

print()
print(f"final loss : {loss_history[-1]:.2f}")
print(f"final m,b  : {m:.2f}, {b:.2f}")`}
      />

      <h2>Visualizing the Heartbeat</h2>
      <p>The most satisfying part is watching the loss curve. It's like a heartbeat monitor for your model's learning process. Hit train and watch it descend in real time:</p>

      <LinearRegressionTrainer />

      <p>
        This is it. This <code>predict → loss → update</code> loop is the fundamental engine of
        nearly all supervised learning, from this simple line-fitter to massive neural networks like
        GPT. The models get more complex, the <code>predict</code> function becomes a monstrous
        beast, and the <code>update</code> step uses more advanced calculus (hello, backpropagation),
        but the core logic you just built remains the same. You didn't just build a linear
        regression model. You built the blueprint.
      </p>

      <ChallengeBox>
        <p>You've built a working model. Now it's time to break it.</p>
        <p>Take the training loop code we just wrote. Run it three times with three different <code>learning_rate</code> values:</p>
        <ul>
          <li>A "good" one: 0.01</li>
          <li>A "too low" one: 0.0001</li>
          <li>A "too high" one: 0.1</li>
        </ul>
        <p>For each run, plot the <code>loss_history</code>.</p>
        <p>Analyze the results:</p>
        <ul>
          <li>What happens to the loss curve when the learning rate is too low?</li>
          <li>What happens when it's too high? (You might see NaN or ridiculously large numbers. This is called <strong>divergence</strong>, and it's hilarious.)</li>
          <li>Explain why this happens, using the "blindfolded hiker" analogy.</li>
        </ul>
        <p>
          This is your first taste of a critical ML skill: <strong>hyperparameter tuning</strong>.
          Welcome to the club.
        </p>
      </ChallengeBox>
    </ChapterShell>
  );
}
