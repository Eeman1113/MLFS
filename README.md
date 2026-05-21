# MLFS — Machine Learning From Scratch

> _For those who have the urge to learn everything._

A 69-page seduction into machine learning. **Now an interactive, runnable book.**

- 🌐 **Live site:** https://eeman1113.github.io/MLFS/
- 📚 The book is in `Draft.tex` (LaTeX source) and `MLFS.pdf`
- 🎬 The original flipbook reader is preserved as `backup_index.html`
- 🛠️ The interactive web version lives in `web/` (Next.js + shadcn + Highcharts + Pyodide)

## What's interactive?

Every algorithm in the book is also a live cell on the page — real Python (numpy works!)
executing in your browser via Pyodide, with charts that respond to your every keystroke:

- Ch. 4 — Watch gradient descent fit a line, live.
- Ch. 5 — Drag a logistic decision boundary across two classes.
- Ch. 6 — Move a split threshold, watch Gini drop.
- Ch. 7 — Click anywhere on a 2D plot, see KNN vote with k neighbors.
- Ch. 9 — Play / pause / step k-means clustering in real time.
- Ch. 10 — Train a tiny neural net on XOR and watch the decision surface emerge.
- Ch. 12 — Crank the polynomial degree until your model overfits the data into a pretzel.

## Running locally

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000

## Building

```bash
cd web
NEXT_PUBLIC_BASE_PATH=/MLFS npx next build
# static export lands in web/out
```

A GitHub Actions workflow at `.github/workflows/deploy.yml` builds and deploys to GitHub Pages
on every push to `main`.

## Credits

Book and interactive web version by **Eeman Majumder**.

License: MIT (see `LICENSE`).
