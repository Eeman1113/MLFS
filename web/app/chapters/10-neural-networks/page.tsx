import type { Metadata } from "next";
import { ChapterShell } from "@/components/chapter-shell";
import { ChallengeBox } from "@/components/challenge-box";
import { RunnableCode } from "@/components/runnable-code";
import { Math, tex } from "@/components/math";
import { SigmoidExplorer } from "@/components/interactives/sigmoid";
import { XORTrainer } from "@/components/interactives/neural-net";

export const metadata: Metadata = {
  title: "Ch. 10 · Intro to Neural Networks: Baby's First Brain",
  description:
    "Build neural networks from scratch — perceptrons, activations, forward pass and backpropagation, with an interactive XOR trainer and sigmoid explorer.",
  keywords: [
    "neural networks",
    "perceptron",
    "backpropagation",
    "deep learning intro",
    "activation functions",
    "MLP",
    "sigmoid",
    "XOR problem",
  ],
  alternates: { canonical: "/chapters/10-neural-networks/" },
  openGraph: {
    title: "Ch. 10 · Intro to Neural Networks: Baby's First Brain · MLFS",
    description:
      "Build neural networks from scratch — perceptrons, activations, forward pass and backpropagation, with an interactive XOR trainer and sigmoid explorer.",
    url: "https://mlfs.online/chapters/10-neural-networks/",
    type: "article",
    authors: ["Eeman Majumder"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ch. 10 · Intro to Neural Networks: Baby's First Brain · MLFS",
    description:
      "Build neural networks from scratch — perceptrons, activations, forward pass and backpropagation, with an interactive XOR trainer and sigmoid explorer.",
  },
};

const ARTICLE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Ch. 10 · Intro to Neural Networks: Baby's First Brain",
  description:
    "Build neural networks from scratch — perceptrons, activations, forward pass and backpropagation, with an interactive XOR trainer and sigmoid explorer.",
  author: { "@type": "Person", name: "Eeman Majumder", url: "https://github.com/Eeman1113" },
  publisher: { "@type": "Person", name: "Eeman Majumder" },
  url: "https://mlfs.online/chapters/10-neural-networks/",
  isPartOf: { "@type": "Book", name: "Machine Learning From Scratch", url: "https://mlfs.online/" },
  inLanguage: "en",
  image: "https://mlfs.online/opengraph-image",
  proficiencyLevel: "Beginner",
  about: ["Neural Networks", "Backpropagation", "Multi-Layer Perceptron"],
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
      name: "Intro to Neural Networks: Baby's First Brain",
      item: "https://mlfs.online/chapters/10-neural-networks/",
    },
  ],
};

export default function Page() {
  return (
    <ChapterShell slug="10-neural-networks">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <p>
        Alright, we've built models that can draw lines, ask questions, and find cliques. We've been
        building with Lego bricks. Now it's time to build the Death Star.
      </p>
      <p>Welcome to <strong>Neural Networks</strong>.</p>
      <p>
        These are the models that power everything from self-driving cars to generating art to
        translating languages. They look terrifyingly complex from the outside, like a diagram of
        the entire internet. But here's the secret: a neural network is just layers upon layers of
        the simple things we've already learned.
      </p>
      <p>Let's demystify the beast and build our own tiny brain.</p>

      <h2>The Neuron (Perceptron): Not Actually Brain Surgery</h2>
      <p>
        The basic building block of a neural network is a <strong>neuron</strong>, also known as a{" "}
        <strong>perceptron</strong>. And a single neuron is going to look incredibly familiar. It's
        basically just a logistic regression unit.
      </p>
      <p>Here's what a neuron does:</p>
      <ol>
        <li>It takes one or more inputs (x₁, x₂, ...).</li>
        <li>It calculates a weighted sum of those inputs and adds a bias: <Math>{tex`z = w_1 x_1 + w_2 x_2 + \ldots + b`}</Math> (Sound familiar? It's the linear regression equation.)</li>
        <li>It passes this result, z, through an <strong>activation function</strong>. (Sound familiar? It's what we did in logistic regression.)</li>
      </ol>
      <p>That's it. A single neuron is just a simple linear model followed by a non-linear activation.</p>

      <h2>Activation Functions: The Neuron's Mood Ring</h2>
      <p>
        The activation function is what gives the network its power. It decides whether the neuron
        "fires" and what signal it sends to the next layer. Without it, a neural network would just
        be a massive, useless linear regression model.
      </p>
      <ul>
        <li>
          <strong>Sigmoid:</strong> The OG. Squishes any number into a (0, 1) range. Great for the
          final output layer in binary classification. Problem: vanishing gradients.
        </li>
        <li>
          <strong>Tanh (Hyperbolic Tangent):</strong> Sigmoid's cooler, zero-centered sibling.
          Squishes numbers into (-1, 1). Better for hidden layers but still has vanishing gradients.
        </li>
        <li>
          <strong>ReLU (Rectified Linear Unit):</strong> The undisputed king of modern deep learning.
          <Math>{tex`f(x) = \max(0, x)`}</Math>
          If positive → pass through; if negative → zero. Fast and gradient stays alive for positive values.
        </li>
      </ul>

      <SigmoidExplorer />

      <h2>The Network: Stacking Layers of Neurons</h2>
      <p>A single neuron is dumb. But what happens when we connect them? We get a network.</p>
      <ul>
        <li><strong>Input Layer:</strong> Receives the raw data.</li>
        <li><strong>Hidden Layers:</strong> Intermediate layers where the real "thinking" happens.</li>
        <li><strong>Output Layer:</strong> Produces the final prediction.</li>
      </ul>
      <p>
        This layering is what allows the network to learn hierarchical patterns. The first layer
        might learn to recognize simple edges. The next layer might combine those edges to recognize
        shapes like eyes and noses. The final layer might combine those shapes to recognize a face.
      </p>

      <h2>Forward & Backpropagation: The Matrix Moment</h2>
      <p>How does a network actually learn? It's a two-step dance.</p>

      <h3>1. Forward Propagation (The Easy Part)</h3>
      <p>
        This is just the process of making a prediction. You feed your input data into the first
        layer. The neurons do their thing (weighted sum + activation) and pass their outputs to the
        next layer. This continues layer by layer until you get a final output. It's one giant,
        nested function call.
      </p>

      <h3>2. Backpropagation (The "Magic")</h3>
      <p>
        After the forward pass, you have a prediction. You compare it to the true label using a loss
        function (like MSE or Binary Cross-Entropy) to get a single error number.
      </p>
      <p>
        Now, we need to figure out which of the thousands (or millions) of weights in the network
        was responsible for the error. <strong>Backpropagation</strong> is the algorithm that does
        this. It's just the <strong>chain rule</strong> from calculus, applied cleverly and
        efficiently.
      </p>
      <ol>
        <li>It starts at the end, with the loss. It calculates the gradient of the loss with respect to the weights in the last layer.</li>
        <li>Then, it moves one layer back. It uses the gradients it just calculated to figure out the gradients for the weights in the second-to-last layer.</li>
        <li>It continues this process, propagating the error signal backwards through the network, layer by layer, until it has calculated the gradient (the "blame") for every single weight and bias.</li>
      </ol>
      <p>Once you have all the gradients, you just use our old friend Gradient Descent to update every weight and bias:</p>
      <Math>{tex`\text{weight} = \text{weight} - \text{learning\_rate} \times \text{gradient}`}</Math>
      <p>
        That's the entire training loop: Forward Pass → Calculate Loss → Backward Pass
        (Backpropagation) → Update Weights. Repeat 10,000 times.
      </p>

      <h2>From-Scratch XOR Solver: The "Aha!" Moment</h2>
      <p>
        Remember the XOR problem from Chapter 5 that our linear logistic regression model couldn't
        solve? A single straight line can't separate the XOR data.
      </p>
      <p>
        But a neural network can. By using a hidden layer, the network can learn to draw more
        complex, non-linear decision boundaries. The first layer might learn two different lines,
        and the output layer can learn to combine the results of those lines in a non-linear way
        (like an AND or OR operation) to create a boundary that perfectly solves XOR.
      </p>
      <p>
        This is the superpower of neural networks. They are <strong>universal function
        approximators</strong>, which is a fancy way of saying that a network with at least one
        hidden layer and enough neurons can, in theory, learn to approximate any continuous
        function. This is why they are so powerful and versatile.
      </p>
      <p>Let's prove it. We'll build a tiny neural network from scratch to finally conquer the XOR problem.</p>

      <XORTrainer />

      <RunnableCode
        title="xor_nn.py"
        code={`import numpy as np
rng = np.random.default_rng(0)

# 2 -> 4 (ReLU) -> 1 (sigmoid)
W1 = rng.normal(0, 1, (2, 4))
b1 = np.zeros(4)
W2 = rng.normal(0, 1, (4, 1))
b2 = 0.0

X = np.array([[0,0],[0,1],[1,0],[1,1]], dtype=float)
y = np.array([0, 1, 1, 0], dtype=float).reshape(-1, 1)

def sigmoid(x): return 1 / (1 + np.exp(-x))
def relu(x): return np.maximum(0, x)
def relu_d(x): return (x > 0).astype(float)

lr = 0.5
for epoch in range(8000):
    # forward
    z1 = X @ W1 + b1
    a1 = relu(z1)
    z2 = a1 @ W2 + b2
    a2 = sigmoid(z2)

    # loss (BCE)
    eps = 1e-9
    loss = -np.mean(y * np.log(a2 + eps) + (1 - y) * np.log(1 - a2 + eps))

    # backward
    dz2 = (a2 - y) / len(y)
    dW2 = a1.T @ dz2
    db2 = dz2.sum()
    dz1 = (dz2 @ W2.T) * relu_d(z1)
    dW1 = X.T @ dz1
    db1 = dz1.sum(axis=0)

    W1 -= lr * dW1; b1 -= lr * db1
    W2 -= lr * dW2; b2 -= lr * db2

    if epoch % 1000 == 0:
        print(f"epoch {epoch:5d}  loss {loss:.4f}")

print("\\nfinal predictions:")
for xi, yi in zip(X, y):
    p = sigmoid(relu(xi @ W1 + b1) @ W2 + b2)
    print(f"  {xi.tolist()} -> {float(p):.3f}  (truth {int(yi)})")`}
      />

      <p>
        When you run this code, you'll see the loss drop and the model learn to correctly classify
        all four XOR points. It's the moment you realize that by stacking simple components, you can
        create something with truly powerful capabilities.
      </p>

      <ChallengeBox title="The Activation Function Gauntlet">
        <p>Let's see the impact of our activation functions firsthand.</p>
        <p>Take the from-scratch XOR solver we just built.</p>
        <p>Train it three times, each time using a different activation function for the hidden layer:</p>
        <ul>
          <li>Sigmoid</li>
          <li>Tanh</li>
          <li>ReLU</li>
        </ul>
        <p>For each run, keep track of the loss at every epoch.</p>
        <p>Plot the three loss curves on the same graph.</p>
        <p>
          Analyze the results: Which activation function allowed the network to learn the fastest
          (i.e., its loss dropped most quickly)? Which one performed the best overall? You'll see
          with your own eyes why ReLU is the default choice for hidden layers in almost every modern
          neural network.
        </p>
      </ChallengeBox>
    </ChapterShell>
  );
}
