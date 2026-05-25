import type { Metadata } from "next";
import { ChapterShell } from "@/components/chapter-shell";
import { ChallengeBox } from "@/components/challenge-box";
import { Callout } from "@/components/callout";

export const metadata: Metadata = {
  title: "Ch. 14 · Ethics, Bias & Bullshit Detectors",
  description:
    "Bias, fairness, dataset audits, and how to spot bullshit in ML claims — practical ethics and responsible AI guardrails for machine learning practitioners.",
  keywords: [
    "ML ethics",
    "bias in AI",
    "fairness",
    "dataset audit",
    "responsible AI",
    "AI bullshit",
    "algorithmic fairness",
    "AI accountability",
  ],
  alternates: { canonical: "/chapters/14-ethics/" },
  openGraph: {
    title: "Ch. 14 · Ethics, Bias & Bullshit Detectors · MLFS",
    description:
      "Bias, fairness, dataset audits, and how to spot bullshit in ML claims — practical ethics and responsible AI guardrails for machine learning practitioners.",
    url: "https://mlfs.online/chapters/14-ethics/",
    type: "article",
    authors: ["Eeman Majumder"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ch. 14 · Ethics, Bias & Bullshit Detectors · MLFS",
    description:
      "Bias, fairness, dataset audits, and how to spot bullshit in ML claims — practical ethics and responsible AI guardrails for machine learning practitioners.",
  },
};

const ARTICLE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Ch. 14 · Ethics, Bias & Bullshit Detectors",
  description:
    "Bias, fairness, dataset audits, and how to spot bullshit in ML claims — practical ethics and responsible AI guardrails for machine learning practitioners.",
  author: { "@type": "Person", name: "Eeman Majumder", url: "https://github.com/Eeman1113" },
  publisher: { "@type": "Person", name: "Eeman Majumder" },
  url: "https://mlfs.online/chapters/14-ethics/",
  mainEntityOfPage: "https://mlfs.online/chapters/14-ethics/",
  isPartOf: { "@type": "Book", name: "Machine Learning From Scratch", url: "https://mlfs.online/" },
  inLanguage: "en",
  image: "https://mlfs.online/chapters/14-ethics/opengraph-image",
  proficiencyLevel: "Beginner",
  about: ["AI Ethics", "Algorithmic Bias", "Responsible Machine Learning"],
  datePublished: "2025-01-01",
  dateModified: "2026-05-25",
  timeRequired: "PT20M",
  wordCount: 1800,
  articleSection: "Let's Build Things",
  learningResourceType: "lesson",
  educationalLevel: "Beginner",
  isAccessibleForFree: true,
  teaches: [
    "Sources of bias in ML systems",
    "Fairness considerations",
    "Auditing datasets",
    "Spotting hype and bullshit",
    "Responsible model deployment",
  ],
  keywords: [
    "ML ethics",
    "bias in AI",
    "fairness",
    "dataset audit",
    "responsible AI",
    "AI bullshit",
    "algorithmic fairness",
    "AI accountability",
  ],
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "h2"],
  },
  mentions: ["Algorithmic Bias", "Fairness", "Responsible AI", "Dataset Audit", "Model Accountability"],
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
      name: "Ethics, Bias & Bullshit Detectors",
      item: "https://mlfs.online/chapters/14-ethics/",
    },
  ],
};

export default function Page() {
  return (
    <ChapterShell slug="14-ethics">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSONLD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
      />
      <p>
        You now have the power to build models that can predict, classify, and cluster. With great
        power comes great responsibility... and the very real possibility of accidentally building a
        racist, sexist, or otherwise terrible AI.
      </p>
      <p>
        Let's be blunt: your model is a reflection of its data. And data is created by humans. And
        humans, bless our hearts, are a walking collection of biases, blind spots, and historical
        baggage. If you are not actively looking for and mitigating bias in your work, you are not
        doing your job.
      </p>
      <p>
        This isn't a "soft skill" lecture. This is core technical risk management. Building a biased
        model can get your company sued, ruin lives, and land you on the front page of the news for
        all the wrong reasons. Let's learn how not to be "that" engineer.
      </p>

      <h2>Your Model Is Not "Neutral"</h2>
      <p>
        The most dangerous myth in our field is that algorithms are objective. They are not. An
        algorithm is a tool for automating a process and scaling a set of rules. If those rules are
        based on biased data, the algorithm becomes a tool for automating and scaling bias.
      </p>
      <p>
        A model trained on the past will predict a future that looks like the past. If the past was
        inequitable, your model will become an engine for perpetuating that inequity.
      </p>

      <h2>How Data Lies: Real-World Disasters</h2>
      <p>This isn't theoretical. This happens all the time.</p>

      <Callout title="Amazon's Sexist Recruiting Tool">
        <ul>
          <li><strong>The Story:</strong> In the mid-2010s, Amazon tried to build an AI to screen resumes. They trained it on 10 years of their own hiring data.</li>
          <li><strong>The Bias:</strong> That historical data reflected the tech industry's male-dominated culture. The model learned that male candidates were preferred.</li>
          <li><strong>The Result:</strong> The AI started penalizing resumes that contained the word "women's" (as in, "captain of the women's chess club") and downgraded graduates from two all-women's colleges.</li>
          <li><strong>The Lesson:</strong> The model didn't invent sexism. It just learned it perfectly from the data it was given. This is a textbook case of historical bias.</li>
        </ul>
      </Callout>

      <Callout title="Google's High-Paying Job Ads">
        <ul>
          <li><strong>The Story:</strong> Researchers found that Google's advertising system was far more likely to show ads for high-paying executive jobs to men than to women.</li>
          <li><strong>The Bias:</strong> The algorithm learned that men were historically more likely to be in, and click on ads for, these high-paying jobs.</li>
          <li><strong>The Result:</strong> The system created a feedback loop. It showed ads to the group most likely to click, which reinforced the initial bias, which made it show even more ads to that group. It amplified existing societal inequality.</li>
        </ul>
      </Callout>

      <Callout title="HireVue's Ableist Interview Platform">
        <ul>
          <li><strong>The Story:</strong> A deaf candidate with a non-standard accent applied for a job using an AI-powered video interview platform.</li>
          <li><strong>The Bias:</strong> The platform's automated speech recognition was trained on a narrow definition of "standard" English speech.</li>
          <li><strong>The Result:</strong> The system failed to understand or correctly transcribe the candidate's responses, leading to a poor evaluation and rejection. The model effectively discriminated against a candidate with a disability because they were an "outlier" from the training data.</li>
        </ul>
      </Callout>

      <h2>How Not to Be "That" Engineer: A Checklist</h2>
      <p>
        Building ethical AI isn't about having good intentions. It's about having a rigorous
        engineering process. Here's your starter checklist:
      </p>
      <ol>
        <li>
          <strong>Interrogate Your Data.</strong> This is the most important step.
          <ul>
            <li><strong>Source:</strong> Where did this data come from? Who collected it? For what purpose?</li>
            <li><strong>Representation:</strong> Who is represented? Who is missing? A medical AI trained on data from one wealthy hospital won't generalize.</li>
            <li><strong>Labels:</strong> Who applied the labels? A diverse panel, or one person with implicit biases?</li>
          </ul>
        </li>
        <li>
          <strong>Audit Your Features.</strong>
          <ul>
            <li>Be extremely wary of features that could be proxies for protected classes. For example, using zip code in a loan application model is incredibly risky. Zip codes are highly correlated with race and wealth. Your model might not be using "race" directly, but it could be learning the exact same biases through the zip code feature.</li>
          </ul>
        </li>
        <li>
          <strong>Test for Fairness.</strong>
          <ul>
            <li>Don't just look at overall accuracy. Segment your test results. How does your model perform for different demographic groups (race, gender, age)? Is the error rate significantly higher for one group than another? If your facial recognition system is 99% accurate on white men but only 65% accurate on Black women, it is a biased and broken system.</li>
          </ul>
        </li>
        <li>
          <strong>Demand Transparency and Interpretability.</strong>
          <ul>
            <li>If you can't explain why your model made a particular decision (especially a high-stakes one), you have a problem. This is why "white box" models like Decision Trees and Logistic Regression are often preferred in regulated industries over "black box" models like complex neural networks.</li>
          </ul>
        </li>
      </ol>
      <p>
        Framing fairness as a core engineering metric, just like F1-score or latency, is the key.
        It's not a fuzzy, philosophical issue; it's a concrete, measurable component of model
        validation. The failure of Amazon's recruiting tool wasn't a failure of philosophy; it was a
        failure of data validation. The engineers didn't properly account for the skew in their
        training set. This is a technical problem with a technical solution: better data, better
        metrics, and a more rigorous validation process.
      </p>

      <ChallengeBox title="The Bias Audit">
        <p>Let's put on our ethics hat.</p>
        <p>Imagine you've been tasked with building a model to predict whether a person will default on a loan. Your dataset contains the following features for each applicant:</p>
        <ul>
          <li><code>income</code></li>
          <li><code>credit_score</code></li>
          <li><code>zip_code</code></li>
          <li><code>years_at_current_job</code></li>
          <li><code>age</code></li>
        </ul>
        <ol>
          <li>Which of these features carries the most risk for introducing societal bias into your model? Why?</li>
          <li>Explain how the <code>zip_code</code> feature could act as a harmful proxy for a protected class like race, even if race itself is not in the dataset.</li>
          <li>Beyond just looking at overall accuracy, what is one specific test you would run to audit this model for fairness before even thinking about deploying it?</li>
        </ol>
      </ChallengeBox>
    </ChapterShell>
  );
}
