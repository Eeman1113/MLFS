import type { Metadata } from "next";
import { ChapterShell } from "@/components/chapter-shell";
import { ChallengeBox } from "@/components/challenge-box";
import { RunnableCode } from "@/components/runnable-code";

export const metadata: Metadata = {
  title: "Ch. 11 · ML Playground: Code Like You Mean It",
  description:
    "Hands-on machine learning coding patterns, project structure, and the muscle memory you need to actually ship ML code — taking from-scratch models for a real spin.",
  keywords: [
    "ML coding",
    "python ML",
    "scikit-learn basics",
    "ML project structure",
    "ML practice",
    "ML workflow",
    "applied machine learning",
  ],
  alternates: { canonical: "/chapters/11-playground/" },
  openGraph: {
    title: "Ch. 11 · ML Playground: Code Like You Mean It · MLFS",
    description:
      "Hands-on machine learning coding patterns, project structure, and the muscle memory you need to actually ship ML code — taking from-scratch models for a real spin.",
    url: "https://mlfs.online/chapters/11-playground/",
    type: "article",
    authors: ["Eeman Majumder"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ch. 11 · ML Playground: Code Like You Mean It · MLFS",
    description:
      "Hands-on machine learning coding patterns, project structure, and the muscle memory you need to actually ship ML code — taking from-scratch models for a real spin.",
  },
};

const ARTICLE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Ch. 11 · ML Playground: Code Like You Mean It",
  description:
    "Hands-on machine learning coding patterns, project structure, and the muscle memory you need to actually ship ML code — taking from-scratch models for a real spin.",
  author: { "@type": "Person", name: "Eeman Majumder", url: "https://github.com/Eeman1113" },
  publisher: { "@type": "Person", name: "Eeman Majumder" },
  url: "https://mlfs.online/chapters/11-playground/",
  isPartOf: { "@type": "Book", name: "Machine Learning From Scratch", url: "https://mlfs.online/" },
  inLanguage: "en",
  image: "https://mlfs.online/opengraph-image",
  proficiencyLevel: "Beginner",
  about: ["Applied Machine Learning", "ML Project Structure", "Python ML Workflow"],
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
      name: "ML Playground: Code Like You Mean It",
      item: "https://mlfs.online/chapters/11-playground/",
    },
  ],
};

export default function Page() {
  return (
    <ChapterShell slug="11-playground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <p>
        Alright, enough theory. You've built the engines, you understand the mechanics, you've
        stared into the mathematical abyss and didn't blink. Theory's over. Time to build cool shit.
      </p>
      <p>
        In this chapter, we're taking our beautiful, hand-crafted, from-scratch models out for a
        spin. We're going to point them at real-world (and slightly ridiculous) problems and make
        them do something. This is where the rubber meets the road. Or, more accurately, where the{" "}
        <code>predict()</code> function meets the CSV file.
      </p>
      <p>
        We'll walk through a few mini-projects, covering the essential pipeline: loading data, a bit
        of cleaning, training our DIY models, and trying to make sense of the results.
      </p>

      <h2>Project 1: Predicting Spotify Song Popularity</h2>
      <ul>
        <li><strong>The Goal:</strong> Can we predict how popular a song will be?</li>
        <li><strong>The Dataset:</strong> We'll use a Spotify dataset from Kaggle with audio features for thousands of songs — danceability, energy, loudness, and a popularity score from 0–100.</li>
        <li><strong>Our Weapon of Choice:</strong> Popularity is continuous → classic regression. Use the DIY Linear Regression from Chapter 4.</li>
        <li>
          <strong>The Workflow:</strong>
          <ol>
            <li><strong>Load Data:</strong> pandas to load <code>spotify_songs.csv</code>.</li>
            <li><strong>Feature Selection:</strong> Pick intuitive features like <code>danceability</code> and <code>energy</code>. X = these, y = <code>popularity</code>.</li>
            <li><strong>Train the Model:</strong> Feed X and y into the gradient-descent loop. It finds the best weights and bias.</li>
            <li>
              <strong>Interpret the Results:</strong> Our trained model gives an equation like
              <code> popularity = w₁·dance + w₂·energy + b</code>. If <code>w₁</code> is large and
              positive, the model has learned that more danceability correlates with more
              popularity.
            </li>
          </ol>
        </li>
      </ul>

      <h2>Project 2: Is This Tweet Trash or Fire? (Sentiment Analysis)</h2>
      <ul>
        <li><strong>The Goal:</strong> Classify a tweet's sentiment as 'positive' or 'negative'.</li>
        <li><strong>The Dataset:</strong> A simple Twitter sentiment dataset.</li>
        <li><strong>Our Weapon of Choice:</strong> Text classification → DIY Naive Bayes from Chapter 8.</li>
        <li>
          <strong>The Workflow:</strong>
          <ol>
            <li><strong>Load Data:</strong> CSV of tweets and labels.</li>
            <li>
              <strong>Text Preprocessing:</strong>
              <ul>
                <li>Convert all text to lowercase.</li>
                <li>Remove punctuation and URLs.</li>
                <li>Tokenize (split into words).</li>
              </ul>
            </li>
            <li><strong>Train the Model:</strong> Count word frequencies per class, compute priors, likelihoods. Just like the spam filter.</li>
            <li><strong>Test It Out:</strong> "this movie was absolutely incredible" → should predict positive. "I would rather watch paint dry" → negative.</li>
          </ol>
        </li>
      </ul>

      <h2>Project 3: Recommending Snacks Based on Mood (No, Seriously)</h2>
      <ul>
        <li><strong>The Goal:</strong> Highly scientific snack recommendation for your current mood.</li>
        <li><strong>The Dataset:</strong> We invent this one. ML works on anything.</li>
      </ul>
      <table>
        <thead>
          <tr><th>Mood</th><th>Weather</th><th>Time of Day</th><th>Snack</th></tr>
        </thead>
        <tbody>
          <tr><td>Stressed</td><td>Rainy</td><td>Evening</td><td>Chocolate</td></tr>
          <tr><td>Bored</td><td>Sunny</td><td>Afternoon</td><td>Chips</td></tr>
          <tr><td>Happy</td><td>Sunny</td><td>Morning</td><td>Fruit</td></tr>
          <tr><td>Stressed</td><td>Sunny</td><td>Afternoon</td><td>Chocolate</td></tr>
          <tr><td>Tired</td><td>Rainy</td><td>Evening</td><td>Ice Cream</td></tr>
          <tr><td>Bored</td><td>Cloudy</td><td>Evening</td><td>Popcorn</td></tr>
        </tbody>
      </table>
      <ul>
        <li><strong>Our Weapon of Choice:</strong> Multi-class classification with categorical features → DIY KNN from Chapter 7.</li>
        <li>
          <strong>The Workflow:</strong>
          <ol>
            <li><strong>Data Prep:</strong> Encode categories to numbers (stressed=0, bored=1, …).</li>
            <li><strong>"Train" the Model:</strong> KNN just memorizes the dataset.</li>
            <li><strong>Make a Prediction:</strong> Mood=stressed, weather=cloudy, time=evening → numbers → k=1 → closest is (Stressed, Rainy, Evening) → recommend Chocolate. Science!</li>
          </ol>
        </li>
      </ul>

      <h2>Building Your First ML Pipeline</h2>
      <p>As we do these projects, we'll notice a repeating pattern. We'll formalize it by creating a simple Python class that represents our first ML pipeline:</p>

      <RunnableCode
        title="pipeline.py"
        code={`class SimpleMLPipeline:
    def __init__(self, model):
        self.model = model

    def load_data(self, filepath):
        # pandas logic to load CSV
        pass

    def clean_data(self, data):
        # logic to handle missing values, etc.
        pass

    def train(self, X, y):
        self.model.fit(X, y)   # assuming models have a .fit() method

    def evaluate(self, X_test, y_test):
        # logic to calculate accuracy / loss
        pass

print("This is the bones of every ML codebase you'll ever write.")`}
      />

      <p>
        This exercise demonstrates a crucial real-world concept: the choice of algorithm is driven
        by the problem you're trying to solve and the kind of data you have. There is no single
        "best" algorithm. A linear model is great for continuous outputs, Naive Bayes excels at
        text, and KNN can be surprisingly effective for simple, low-dimensional classification.
        Moving from knowing how an algorithm works to knowing when to use it is the leap from being
        a student to being a practitioner.
      </p>

      <ChallengeBox title="Choose Your Own Adventure">
        <p>Your turn to be the data scientist.</p>
        <ol>
          <li>Go to Kaggle or another dataset repository and find a dataset that looks fun to you. Some ideas: "Wine Quality Prediction," "Video Game Sales," "IMDB TV Show Reviews."</li>
          <li><strong>Define the problem:</strong> What are you trying to predict? Is it a regression or classification task?</li>
          <li><strong>Choose your weapon:</strong> Pick one of our from-scratch models (Linear Regression, Logistic Regression, KNN, Naive Bayes, or Decision Tree) that you think is best suited for the job.</li>
          <li>Write a simple Python script to load the data, train your chosen model, and make a few predictions.</li>
          <li><strong>Justify your choice:</strong> In a code comment, write a few sentences explaining why you chose that specific model for that specific problem.</li>
        </ol>
      </ChallengeBox>
    </ChapterShell>
  );
}
