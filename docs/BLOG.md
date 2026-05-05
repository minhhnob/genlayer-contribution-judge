# Building Proof-of-Contribution Judge: A Small GenLayer App for Contributor Campaigns

## TL;DR

I built **Proof-of-Contribution Judge**, a GenLayer-powered app that uses an Intelligent Contract to review contributor campaign submissions. The app takes a contributor name, evidence URL, summary, and rubric, then returns a decision: `APPROVED`, `NEEDS_REVIEW`, or `REJECTED`.

## Why GenLayer?

Most smart contracts are deterministic. They are good at balances, transfers, and fixed rules, but they are not designed to judge messy real-world evidence like blog posts, tutorials, GitHub repos, demo links, or community work.

Contributor campaigns often require subjective decisions:

- Is the evidence real and specific?
- Does the work match the campaign rules?
- Is it useful for the ecosystem?
- Is the submission high quality or just low-effort spam?

This is where GenLayer fits well. GenLayer Intelligent Contracts can use AI reasoning and validator consensus to evaluate natural-language context and return a transparent result.

## What the App Does

Proof-of-Contribution Judge lets a user submit:

- contributor name;
- contribution title;
- evidence URL;
- summary of work;
- campaign rubric.

The Intelligent Contract reviews the submission and stores:

- decision;
- score from 0 to 100;
- reasoning;
- recommendation for improvement.

## How It Works

1. The frontend collects contribution evidence.
2. The user can preview a local score to prepare a clean demo input.
3. The GenLayer contract method `review_contribution` performs the authoritative review.
4. Inside the contract, an LLM evaluates the evidence against the rubric.
5. Validators compare stable decision fields, especially decision and score tolerance, instead of requiring identical natural-language reasoning.
6. The final review is stored and can be queried later.

## Why This Pattern Matters

This app is small, but the pattern can be reused in many Web3 workflows:

- DAO bounty reviews;
- grant milestone checks;
- hackathon judging;
- public-goods contribution scoring;
- contributor reputation;
- anti-spam campaign filtering;
- AI-agent work verification.

Instead of relying only on centralized reviewers, a GenLayer contract can make the evaluation process more transparent and programmable.

## Demo Links

- GitHub: `https://github.com/minhhnob/genlayer-contribution-judge`
- Demo: `<PASTE_VERCEL_URL>`
- Contract: `0x410E01fb3ECba47b0098eC57F5482536223c2876`

## What I Learned

Building this app helped me understand why GenLayer is different from ordinary smart-contract platforms. The most important part is not just writing contract code. It is designing the right evaluation logic: what fields should be judged, what errors should be rejected, and what validator agreement should mean.

I also learned that LLM outputs should not be compared with exact equality. Reasoning text can vary, so the contract should compare stable fields like decision and score with a tolerance.

## Next Steps

I would like to improve the app by:

- adding more sample rubrics;
- supporting multiple campaign templates;
- adding richer anti-spam checks;
- reading evidence pages directly from URLs;
- building a public leaderboard for high-quality contributors.

Proof-of-Contribution Judge is a simple demo, but it shows how GenLayer can become useful infrastructure for contributor campaigns, DAO operations, and AI-native coordination.
