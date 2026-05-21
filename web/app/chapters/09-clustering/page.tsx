import { ChapterShell } from "@/components/chapter-shell";
import { ChallengeBox } from "@/components/challenge-box";
import { RunnableCode } from "@/components/runnable-code";
import { KMeansExplorer } from "@/components/interactives/kmeans";
import { Highchart } from "@/components/highchart";
import { palette } from "@/lib/palette";

export const metadata = { title: "Ch. 9 · Clustering · MLFS" };

export default function Page() {
  return (
    <ChapterShell slug="09-clustering">
      <p>
        So far, we've lived in the cozy, well-lit world of supervised learning. We've always had an
        answer key. Our data was neatly labeled, and our job was to teach a model to predict those
        labels.
      </p>
      <p>Now, we're turning off the lights.</p>
      <p>
        Welcome to unsupervised learning. Here, we have no labels. No right answers. We just have a
        chaotic mess of data points, and our job is to find the natural structure within them. We're
        not predicting; we're discovering.
      </p>
      <p>
        The most fundamental task in unsupervised learning is <strong>clustering</strong>: finding
        the natural "cliques" or "groups" in your data. And the king of clustering algorithms is{" "}
        <strong>K-Means</strong>.
      </p>

      <h2>The Goal: Finding the Cliques</h2>
      <p>
        Imagine you're a high school principal looking at a map of where all your students hang out
        during lunch. You don't have pre-defined labels like "jocks" or "nerds." You just see a
        scatter plot of students. Your goal is to identify the main social groups. You'd probably
        circle the dense clumps of students, right?
      </p>
      <p>
        That's exactly what K-Means does. It's an algorithm designed to partition your data into a
        pre-defined number (k) of clusters.
      </p>

      <h2>The K-Means Algorithm: A Ghosting Story</h2>
      <p>
        The K-Means algorithm is a beautiful, iterative dance. It's like forcing your data points
        into group therapy sessions until they find where they truly belong.
      </p>
      <ul>
        <li>
          <strong>Step 1: Initialize (The Awkward Mixer).</strong> You decide you want to find k
          groups (let's say k=3). To start, you pluck k random data points from your dataset and
          call them <strong>centroids</strong>.
        </li>
        <li>
          <strong>Step 2: Assign (Find Your Clique).</strong> Go through every single data point.
          For each point, calculate its distance to all three centroids. Assign the data point to
          the group of the centroid it's closest to.
        </li>
        <li>
          <strong>Step 3: Update (The Centroid Ghosts).</strong> Now, the centroids look at the new
          group of friends they've attracted. They say, "I should be in the middle of my new friend
          group." So, each centroid calculates the <strong>mean</strong> (the average position) of
          all the data points in its cluster and moves there.
        </li>
        <li>
          <strong>Step 4: Repeat.</strong> Now that the centroids have moved, some data points
          might be closer to a different centroid. So, you repeat Step 2, then Step 3.
        </li>
      </ul>
      <p>
        You keep repeating this Assign-Update loop until the centroids stop moving. When a full loop
        happens and no data points change their cluster assignment, the algorithm has{" "}
        <strong>converged</strong>. The groups are stable. The therapy session is over.
      </p>

      <KMeansExplorer />

      <h2>From-Scratch K-Means: Let's Make Some Clusters</h2>
      <p>The core of K-Means is a loop that contains our two main steps.</p>

      <RunnableCode
        title="kmeans.py"
        code={`import numpy as np

def euclidean(p1, p2):
    return np.sqrt(np.sum((p1 - p2) ** 2))

def kmeans(X, k, max_iters=100):
    n, d = X.shape
    idx = np.random.choice(n, k, replace=False)
    centroids = X[idx].copy()

    for it in range(max_iters):
        clusters = [[] for _ in range(k)]
        for i, p in enumerate(X):
            dists = [euclidean(p, c) for c in centroids]
            clusters[int(np.argmin(dists))].append(i)

        old = centroids.copy()
        for ci in range(k):
            if clusters[ci]:
                centroids[ci] = X[clusters[ci]].mean(axis=0)
        if np.allclose(old, centroids):
            print(f"converged after {it+1} iters")
            break

    labels = np.empty(n, dtype=int)
    for ci, c in enumerate(clusters):
        labels[c] = ci
    return labels, centroids

rng = np.random.default_rng(0)
X = np.vstack([
    rng.normal([2,2], 0.6, size=(40,2)),
    rng.normal([7,2], 0.6, size=(40,2)),
    rng.normal([5,7], 0.6, size=(40,2)),
])
labels, c = kmeans(X, k=3)
print("final centroids:")
print(c)`}
      />

      <p>Visualizing this process is incredibly satisfying. You can plot the data points and watch the centroids dance around with each iteration until they settle into the heart of their clusters.</p>

      <h2>The Elbow Method: Finding the Sweet Spot (Unlike Your Ex)</h2>
      <p>There's a huge question we've been ignoring: how do you pick k? Why 3 clusters and not 2, or 10?</p>
      <p>
        This is a common problem in unsupervised learning. Since there's no "right" answer, we have
        to use a heuristic. The most popular one is the <strong>Elbow Method</strong>.
      </p>
      <p><strong>Analogy: The Law of Diminishing Returns</strong></p>
      <p>Imagine you're cleaning a messy room.</p>
      <ul>
        <li>Adding one trash can (k=1) helps a lot. Huge improvement.</li>
        <li>Adding a second trash can (k=2) for recycling also helps a lot.</li>
        <li>Adding a third (k=3) might still be useful.</li>
        <li>Adding a tenth (k=10)? At this point, you're just adding more trash cans for the sake of it.</li>
      </ul>
      <p>
        The Elbow Method does the same for clusters. We calculate a score called the{" "}
        <strong>Within-Cluster Sum of Squares (WCSS)</strong>. This is just the sum of the squared
        distances between each point and its centroid. It's a measure of how tight and compact the
        clusters are. A lower WCSS is better.
      </p>
      <p>
        We run K-Means for a range of k values and plot the WCSS for each. The graph will look like
        an arm bending downwards.
      </p>

      <Highchart
        height={320}
        options={{
          title: { text: "The Elbow Method for Optimal k" },
          xAxis: { title: { text: "k (number of clusters)" }, allowDecimals: false, min: 1 },
          yAxis: { title: { text: "WCSS" }, min: 0 },
          series: [
            {
              type: "line",
              name: "WCSS",
              color: palette.series[0],
              data: [
                [1, 100],
                [2, 40],
                [3, 20],
                [4, 15],
                [5, 12],
                [6, 10],
                [7, 9],
                [8, 8.5],
              ],
              marker: { radius: 5 },
              lineWidth: 3,
            },
            {
              type: "line",
              name: "the elbow",
              data: [[3, 0], [3, 20]] as [number, number][],
              color: "#a1a1aa",
              dashStyle: "Dash",
              marker: { enabled: false },
              showInLegend: false,
              enableMouseTracking: false,
            },
          ],
        }}
      />

      <p>
        The "elbow" of the arm is the point where the WCSS stops decreasing so rapidly. It's the
        point of diminishing returns, where adding another cluster doesn't give you much bang for
        your buck. This is our best guess for the optimal value of k.
      </p>
      <p>
        It's important to recognize that the random initialization of centroids can be a significant
        weakness. A bad start can cause the algorithm to converge to a local minimum—a solution that
        is good, but not the best possible one. This is the same "stuck in a shallow valley" problem
        we saw with gradient descent. To combat this, standard implementations of K-Means (like the
        one in sklearn) run the entire algorithm multiple times with different random starting
        points (n_init) and then pick the best final result.
      </p>

      <ChallengeBox title="Image Compression with K-Means">
        <p>Let's use clustering for something cool and visual: color quantization, a form of image compression.</p>
        <p>Load an image using a library like Pillow or OpenCV.</p>
        <p>The image is a 3D array (height, width, RGB channels). Reshape it into a 2D array where each row is a pixel and the columns are its Red, Green, and Blue values. This is your X data.</p>
        <p>Use your from-scratch K-Means algorithm to find, say, k=16 clusters in this pixel data. The final centroids will be the 16 most representative colors in the image.</p>
        <p>Create a new image by replacing each original pixel's color with the color of the centroid it was assigned to.</p>
        <p>Display the original and the new, compressed image side-by-side. You've just reduced the number of colors in the image to 16, effectively compressing it!</p>
      </ChallengeBox>
    </ChapterShell>
  );
}
