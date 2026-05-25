import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { DocsSidebar } from "@/components/docs-sidebar";
import { OnThisPage } from "@/components/on-this-page";
import { withBase } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Introduction – Get addicted to ML",
  description:
    "A 69-page book that gets you addicted to machine learning. Read the introduction by Eeman Majumder — irreverent, beginner-friendly, free.",
  keywords: [
    "machine learning book",
    "ml from scratch",
    "learn machine learning",
    "ML for beginners",
    "Eeman Majumder",
    "MLFS",
    "free ML book",
    "interactive ML",
    "python machine learning",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "MLFS – Machine Learning From Scratch",
    description: "A 69-page book that gets you addicted to machine learning.",
    url: "https://mlfs.online/",
    type: "article",
    authors: ["Eeman Majumder"],
  },
  twitter: {
    card: "summary_large_image",
    title: "MLFS – Machine Learning From Scratch",
    description: "A 69-page book that gets you addicted to machine learning.",
  },
};

const CHAPTER_PARTS = [
  { slug: "01-flowcharts", name: "How to Think in Flowcharts" },
  { slug: "02-math", name: "Math You Can't Ignore (Sorry, Bestie)" },
  { slug: "03-algorithm", name: "The Algorithm is a Lazy Genius" },
  { slug: "04-linear-regression", name: "DIY Linear Regression" },
  { slug: "05-classification", name: "Classification: The Yes or No Saga" },
  { slug: "06-decision-trees", name: "Decision Trees: The Judgmental Algorithm" },
  { slug: "07-knn", name: "KNN: The Neighborhood Watch" },
  { slug: "08-naive-bayes", name: "Naive Bayes: Trust Issues but Make It Statistical" },
  { slug: "09-clustering", name: "Clustering: Group Therapy for Data" },
  { slug: "10-neural-networks", name: "Intro to Neural Networks: Baby's First Brain" },
  { slug: "11-playground", name: "ML Playground: Code Like You Mean It" },
  { slug: "12-screwups", name: "When Your Model Screws Up" },
  { slug: "13-sklearn", name: "From Scratch to Sklearn" },
  { slug: "14-ethics", name: "Ethics, Bias & Bullshit Detectors" },
  { slug: "15-final-boss", name: "Final Boss: End-to-End ML Project" },
  { slug: "16-llms", name: "LLMs and All Their Fun Magic" },
];

const TEACHES_SKILLS = [
  "Algorithmic Thinking",
  "Linear Algebra for Machine Learning",
  "Probability and Statistics",
  "Gradient Descent",
  "Linear Regression",
  "Logistic Regression",
  "Decision Trees",
  "K-Nearest Neighbors",
  "Naive Bayes",
  "K-Means Clustering",
  "Neural Networks",
  "Backpropagation",
  "Bias-Variance Tradeoff",
  "scikit-learn",
  "ML Ethics and Fairness",
  "End-to-End ML Projects",
  "Large Language Models",
  "Transformer Architecture",
  "Attention Mechanism",
];

const BOOK_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Book",
  name: "Machine Learning From Scratch",
  alternateName: "MLFS",
  url: "https://mlfs.online/",
  author: {
    "@type": "Person",
    name: "Eeman Majumder",
    url: "https://github.com/Eeman1113",
    sameAs: ["https://github.com/Eeman1113"],
  },
  inLanguage: "en",
  bookFormat: "https://schema.org/EBook",
  bookEdition: "First Edition",
  numberOfPages: 69,
  isAccessibleForFree: true,
  genre: ["Technology", "Education", "Machine Learning"],
  description:
    "A hands-on, no-fluff introduction to ML in just 69 pages. Interactive demos for linear regression, decision trees, KNN, naive Bayes, clustering, neural networks, ethics, end-to-end projects, and LLMs.",
  abstract:
    "Machine Learning From Scratch is an irreverent, beginner-friendly book and interactive website that gets you from zero to building real ML models — fast.",
  image: "https://mlfs.online/opengraph-image",
  publisher: { "@type": "Person", name: "Eeman Majumder" },
  datePublished: "2025-01-01",
  dateModified: "2026-05-25",
  copyrightYear: 2025,
  copyrightHolder: {
    "@type": "Person",
    name: "Eeman Majumder",
    url: "https://github.com/Eeman1113",
  },
  learningResourceType: "Book",
  educationalLevel: "Beginner",
  audience: {
    "@type": "Audience",
    audienceType: "students, self-learners, software engineers",
  },
  teaches: TEACHES_SKILLS,
  timeRequired: "PT10H",
  hasPart: CHAPTER_PARTS.map((c) => ({
    "@type": "Chapter",
    name: c.name,
    url: `https://mlfs.online/chapters/${c.slug}/`,
  })),
};

const COURSE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Machine Learning From Scratch",
  description:
    "A free, self-paced course that teaches machine learning from first principles — vectors, gradient descent, linear and logistic regression, decision trees, KNN, naive Bayes, clustering, neural networks, ethics, end-to-end projects, and LLMs — through 16 interactive chapters.",
  url: "https://mlfs.online/",
  provider: {
    "@type": "Person",
    name: "Eeman Majumder",
    url: "https://github.com/Eeman1113",
    sameAs: ["https://github.com/Eeman1113"],
  },
  inLanguage: "en",
  isAccessibleForFree: true,
  educationalCredentialAwarded: "Self-paced completion",
  coursePrerequisites: "Basic Python familiarity",
  teaches: TEACHES_SKILLS,
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "online",
    courseWorkload: "PT10H",
    inLanguage: "en",
    isAccessibleForFree: true,
  },
};

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is MLFS free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Machine Learning From Scratch is completely free to read online at mlfs.online, with a free PDF and a GitHub repository as well.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need a math background to read MLFS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No advanced math is required. Chapter 2 covers the only math you actually need — vectors, basic calculus, and probability — explained intuitively without gatekeeping.",
      },
    },
    {
      "@type": "Question",
      name: "What programming language does MLFS use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "MLFS uses Python with NumPy for from-scratch implementations, then introduces scikit-learn later. Basic Python familiarity is the only prerequisite.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to read MLFS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The book is 69 pages across 16 chapters. Most readers finish it in roughly 8 to 12 hours, including time spent playing with the interactive demos.",
      },
    },
    {
      "@type": "Question",
      name: "Is MLFS for complete beginners?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. MLFS is written for beginners who have never touched machine learning before. It starts from flowchart thinking and builds up to neural networks and LLMs.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need a GPU to follow along?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No GPU is required. Every model in MLFS is small enough to train on a regular laptop CPU. The book focuses on understanding, not scale.",
      },
    },
    {
      "@type": "Question",
      name: "Can I read MLFS offline?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. A downloadable PDF is available from the homepage, and the full source code lives on GitHub at github.com/Eeman1113/MLFS.",
      },
    },
    {
      "@type": "Question",
      name: "Who wrote MLFS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "MLFS was written by Eeman Majumder, an independent author and engineer who builds the book to make machine learning approachable for self-learners.",
      },
    },
  ],
};

const BREADCRUMB_JSONLD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://mlfs.online/",
    },
  ],
};

export default function Home() {
  return (
    <div className="mx-auto max-w-screen-2xl md:grid md:grid-cols-[16rem_minmax(0,1fr)]">
      <DocsSidebar />
      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_14rem] xl:gap-8">
        <article
          aria-label="Introduction"
          className="mx-auto w-full min-w-0 max-w-[760px] px-6 md:px-10 py-10"
        >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(BOOK_JSONLD) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(COURSE_JSONLD) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSONLD) }}
          />
          <Image
            src={withBase("/logo.png")}
            alt="MLFS"
            width={88}
            height={88}
            className="size-[88px] mb-8 dark:invert"
            priority
          />
          <p className="text-[14px] leading-5 text-muted-foreground mb-1.5">
            Machine Learning From Scratch
          </p>
          <h1
            className="font-display"
            style={{ fontSize: 30, lineHeight: "36px", fontWeight: 600, letterSpacing: "-0.75px" }}
          >
            Introduction
          </h1>
          <div className="prose-book max-w-none mt-10">
            <p>Dear Reader,</p>
            <p>So — this book is for people who haven't quite figured it out yet.</p>
            <p>Like, yeah, you love coding. You've made projects. You've got the GitHub commits.</p>
            <p>But... it still doesn't give you that umph, that passion. You feel like something's missing.</p>
            <p>This book isn't great at teaching you ML —</p>
            <p>It's here to make you interested in ML.</p>
            <p>To make you aroused about ML.</p>
            <p>To make you feel more sure about it.</p>
            <p>You know that topic you always wanted to learn for years?</p>
            <p>The one that lowkey scared you because it felt like such a big, brain-melting undertaking?</p>
            <p>Yeah. This is that book.</p>
            <p>And it's only 69 pages.</p>
            <p>It's here to make you curious.</p>
            <p>To push you.</p>
            <p>To say: "You got this, bro. ML isn't that deep. Yet."</p>
            <p>I hope you have fun reading through the book.</p>
            <p>And most of all — I hope you leave it wanting to explore even more.</p>
            <p>
              I hope this helps you break out of procrastination and gives you a much-needed push
              toward finally saying:
            </p>
            <p>"Screw it. Let's just do this."</p>
            <p>Thank you for being here.</p>
            <p>Now let's build some smart stuff together.</p>
            <Image
              src={withBase("/signature.png")}
              alt="Eeman Majumder's signature"
              width={160}
              height={160}
              sizes="(min-width: 640px) 160px, 128px"
              className="mt-2 -mb-12 sm:-mb-14 -ml-2 sm:-ml-3 w-32 sm:w-40 h-auto dark:invert"
              style={{ height: "auto" }}
            />
            <p className="font-display font-semibold">— Eeman Majumder</p>

            <p className="mt-10">
              <Link
                href="/chapters/01-flowcharts"
                className="underline underline-offset-4 hover:no-underline"
              >
                Start at chapter one →
              </Link>
            </p>

            <h2 id="dedication">Dedication</h2>
            <p className="italic">
              To mumma and papa for being such amazing parents, love you both.
            </p>
          </div>

          <footer className="mt-20 pt-6 border-t flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <a href="https://drive.google.com/file/d/1AKPArWSJqyYRjcUFYKzgzcgQ3A20FA4M/view" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
              PDF
            </a>
            <Link href="/authors-note" className="hover:text-foreground transition-colors">
              Author's Note
            </Link>
            <a href="./backup_index.html" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">
              Flipbook
            </a>
            <a
              href="https://github.com/Eeman1113/MLFS"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <span className="ml-auto">© {new Date().getFullYear()} Eeman Majumder · MIT</span>
          </footer>
        </article>
        <OnThisPage />
      </div>
    </div>
  );
}
