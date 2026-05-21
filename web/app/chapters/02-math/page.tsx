import { ChapterShell } from "@/components/chapter-shell";
import { ChallengeBox } from "@/components/challenge-box";
import { Callout } from "@/components/callout";
import { RunnableCode } from "@/components/runnable-code";
import { M, Math, tex } from "@/components/math";
import { DotProductInteractive } from "@/components/interactives/dot-product";
import { LossCurveExplorer } from "@/components/interactives/parabola";

export const metadata = { title: "Ch. 2 · Math You Can't Ignore · MLFS" };

export default function Page() {
  return (
    <ChapterShell slug="02-math">
      <p>Okay, deep breaths. We need to talk about math.</p>
      <p>
        I know, I know. You became a developer so you could build cool things, not relive your high
        school calculus nightmares. You just want to <code>import antigravity</code> and be done with it.
      </p>
      <p>
        But here's the deal: machine learning isn't magic. It's math. You can't skip this chapter
        and expect to train a model that does anything other than set your CPU on fire. The good
        news? You don't need a PhD. You just need to understand three core concepts. We're going to
        treat this like ripping off a band-aid: quick, a little painful, but you'll feel so much
        better afterwards.
      </p>

      <h2>Vectors & Matrices: Spicy Python Lists</h2>
      <p>
        Forget everything you think you know about vectors from physics class. In machine learning, a
        vector is just a fancy list of numbers that represents... well, anything.
      </p>
      <p><strong>Analogy: The Fruit Stand</strong></p>
      <p>
        Imagine you're at a fruit stand. You want to buy 2 apples, 3 bananas, and 4 clementines. You
        can represent your shopping list as a vector:
      </p>
      <Math>{tex`\text{my\_stuff} = \begin{pmatrix} 2 \\ 3 \\ 4 \end{pmatrix}`}</Math>
      <p>
        The fruit stand has prices for each item: $1 for an apple, $2 for a banana, and $3 for a
        clementine. We can represent this as a <code>prices</code> vector:
      </p>
      <Math>{tex`\text{prices} = \begin{pmatrix} 1 \\ 2 \\ 3 \end{pmatrix}`}</Math>
      <p>
        Now, how do you calculate your total bill? You multiply the corresponding items and add them
        up:
      </p>
      <Math>{tex`(2 \text{ apples} \times \$1) + (3 \text{ bananas} \times \$2) + (4 \text{ clementines} \times \$3) = \$20`}</Math>
      <p>Congratulations, you just did a <strong>dot product</strong>.</p>

      <DotProductInteractive />

      <p>
        The dot product is how we "multiply" two vectors to get a single number. It's a measure of
        their interaction. In Python with NumPy, it's dead simple:
      </p>

      <RunnableCode
        title="dot_product.py"
        code={`import numpy as np

my_stuff = np.array([2, 3, 4])
prices = np.array([1, 2, 3])

# Calculate the dot product
total_bill = np.dot(my_stuff, prices)
print(f"Total bill: \${total_bill}")  # Total bill: $20`}
      />

      <p>
        A <strong>matrix</strong> is just a stack of vectors. It's a spreadsheet. It's a list of
        lists. If you had shopping lists for three different people, you could stack them into a
        matrix:
      </p>
      <Math>{tex`\text{all\_the\_stuff} = \begin{pmatrix} 2 & 3 & 4 \\ 1 & 1 & 5 \\ 3 & 2 & 0 \end{pmatrix}`}</Math>
      <p>
        That's it. Vectors and matrices are just containers for our data. They're spicy arrays that
        let us do math on a whole bunch of numbers at once.
      </p>

      <h2>Calculus: The Science of "How Fast Are We Screwing Up?"</h2>
      <p>
        Calculus is all about change. For us, we care about one thing: finding the slope of a curve
        at a single point. This slope is called the <strong>derivative</strong>.
      </p>
      <p><strong>Analogy: The Speedometer</strong></p>
      <p>
        Imagine you're driving. Your total trip is 60 miles and it takes you an hour. Your average
        speed is 60 mph. Boring.
      </p>
      <p>
        The derivative is your speedometer. It tells you your speed at this exact instant. Right
        now, you're going 75 mph. A second later, you hit traffic, and you're going 15 mph. The
        derivative is the instantaneous rate of change.
      </p>
      <p>
        Why do we care? Because in machine learning, our "curve" is the <strong>loss function</strong>{" "}
        (which we'll cover in the next chapter). The loss function tells us how wrong our model is.
        The derivative of the loss function tells us the slope of our error.
      </p>

      <LossCurveExplorer />

      <p>
        The derivative tells us which way is "downhill" on our error curve. If the slope is
        negative, we need to increase our parameter to go down. If it's positive, we need to
        decrease it. If it's zero, we're at the bottom—we've found the minimum error! This process
        of following the derivative downhill is called <strong>Gradient Descent</strong>, and it's
        the engine of modern machine learning.
      </p>
      <p>
        The joke goes: "The derivative of milk is cheese; the integral of milk is a cow". It's silly,
        but it captures the idea. The derivative breaks something down into its rate of change
        (milk → cheese), while the integral builds it up (cow → milk). We're in the cheese-making
        business.
      </p>

      <h2>Probability: A Guided Tour of Your Gambling Addiction</h2>
      <p>
        Probability is the language of uncertainty. And nowhere is uncertainty more expensive than
        in a casino.
      </p>

      <h3>Expected Value: The House Always Wins</h3>
      <p>
        Every casino game has a negative expected value for the player. This is the average amount
        you'd expect to win or lose per bet if you played forever.
      </p>
      <p>
        Let's say you're playing a simple dice game. You bet $1. If you roll a 6, you win $5. If you
        roll anything else, you lose your $1.
      </p>
      <ul>
        <li>Probability of winning (rolling a 6) = 1/6</li>
        <li>Probability of losing (not rolling a 6) = 5/6</li>
      </ul>
      <p>The expected value (EV) is calculated like this:</p>
      <Math>{tex`\text{EV} = (P(\text{win}) \times \text{Amount won}) - (P(\text{lose}) \times \text{Amount lost})`}</Math>
      <Math>{tex`\text{EV} = \left(\tfrac{1}{6} \times \$5\right) - \left(\tfrac{5}{6} \times \$1\right) = \tfrac{\$5}{6} - \tfrac{\$5}{6} = \$0`}</Math>
      <p>
        Huh. This is a fair game. A casino would never offer this. Let's make it more realistic.
        They pay you $4 if you win.
      </p>
      <Math>{tex`\text{EV} = \left(\tfrac{1}{6} \times \$4\right) - \left(\tfrac{5}{6} \times \$1\right) = \tfrac{\$4}{6} - \tfrac{\$5}{6} = -\tfrac{\$1}{6} \approx -\$0.17`}</Math>
      <p>
        This means that on average, every time you play, you lose 17 cents. This is the "house
        edge." A machine learning model's performance is similar. Over thousands of predictions, we
        want its average error—its expected loss—to be as close to zero as possible.
      </p>

      <h3>Bayes' Theorem: Updating Your Beliefs</h3>
      <p>
        Bayes' Theorem is a formal way to update your beliefs in the face of new evidence. Let's use
        a classic example: food allergies.
      </p>
      <p>
        Let's say the probability that any random person has a peanut allergy is low, maybe 1% (
        <M>{tex`P(\text{Allergy}) = 0.01`}</M>). This is our <strong>prior belief</strong>.
      </p>
      <p>
        Now, your friend eats a cookie and their face swells up. This is <strong>new evidence</strong>.
        We want to calculate the probability they have an allergy <em>given</em> this new evidence:{" "}
        <M>{tex`P(\text{Allergy} \mid \text{Swelling})`}</M>.
      </p>
      <p>Bayes' Theorem gives us the formula:</p>
      <Math>{tex`P(\text{Allergy} \mid \text{Swelling}) = \frac{P(\text{Swelling} \mid \text{Allergy}) \times P(\text{Allergy})}{P(\text{Swelling})}`}</Math>
      <p>
        This lets us update our initial 1% belief to something much, much higher. This is exactly
        how the Naive Bayes algorithm (Chapter 8) works: it starts with a prior belief about the
        classes and updates that belief as it sees new data.
      </p>
      <p>
        These three pillars—linear algebra for structure, calculus for optimization, and probability
        for uncertainty—are the bedrock of everything we're about to build. You survived. Now let's
        use them.
      </p>

      <ChallengeBox>
        <p>Time to put your new math skills to the test.</p>
        <ol>
          <li>
            <strong>The House Edge:</strong> A casino offers a game where you bet $10 on a coin
            flip. Heads, you win $9. Tails, you lose your $10. The coin is fair (50/50 chance).
            Write a Python function to calculate the expected value of one bet. How much money does
            the casino expect to make off you per flip?
          </li>
          <li>
            <strong>The High Roller:</strong> A different game involves betting on three different
            outcomes with different payouts.
            <ul>
              <li>
                Your bets are represented by a vector: <code>bets = [10, 0, 50]</code> (i.e., $10 on
                game 1, $0 on game 2, $50 on game 3).
              </li>
              <li>The payout multipliers are a vector: <code>payouts = [1.2, 2.5, 0.8]</code>.</li>
            </ul>
            Use numpy to calculate your total winnings using a dot product. Did you make money or
            lose it?
          </li>
        </ol>
        <p>Show me the code!</p>
        <RunnableCode
          title="challenge.py"
          code={`import numpy as np

# 1. House edge for the fair coin
def ev_coin():
    return 0.5 * 9 + 0.5 * (-10)

print("EV of one coin flip:", ev_coin())

# 2. High roller
bets = np.array([10, 0, 50])
payouts = np.array([1.2, 2.5, 0.8])
winnings = np.dot(bets, payouts)
print("Total winnings:", winnings)`}
        />
      </ChallengeBox>
    </ChapterShell>
  );
}
