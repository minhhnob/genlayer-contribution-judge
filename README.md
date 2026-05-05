# Proof-of-Contribution Judge — GenLayer App

A GenLayer Intelligent Contract demo for reviewing contributor campaign submissions. Users submit evidence links, summaries, and a campaign rubric; the contract uses AI reasoning under GenLayer consensus to return `APPROVED`, `NEEDS_REVIEW`, or `REJECTED` with a score and recommendation.

## Why this is GenLayer-native

Traditional smart contracts cannot reliably judge subjective contribution quality, inspect natural-language evidence, or reason over campaign rules. GenLayer is a good fit because Intelligent Contracts can use LLM reasoning and validator consensus for subjective decisions.

## Project structure

- `contracts/ContributionJudge.py` — GenLayer Intelligent Contract.
- `frontend/` — Vite + React demo UI.
- `docs/BLOG.md` — ready-to-publish blog draft.
- `submission/GEN_PORTAL_DESCRIPTION.md` — Gen Portal submission copy.
- `docs/DEPLOYMENT.md` — manual deployment guide for GenLayer Studio and Vercel.

## Contract methods

- `get_campaign()` — returns campaign metadata.
- `get_submission_count()` — returns total reviewed submissions.
- `get_submission_id(index)` — returns a submission id.
- `get_submission(submission_id)` — returns saved review details.
- `review_contribution(contributor, title, evidence_url, summary, rubric)` — write method that asks GenLayer validators to review the contribution.

## Quick frontend start

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open the local URL printed by Vite.

## Build check

```bash
cd frontend
npm run build
```

## Deploy contract

Manual path:

1. Open https://studio.genlayer.com/contracts
2. Connect wallet.
3. Faucet GEN if the selected network requires it.
4. Upload or paste `contracts/ContributionJudge.py`.
5. Constructor parameter:
   - `campaign_name`: `GenLayer Contributor Campaign`
6. Click Deploy.
7. Copy the contract address.

Then update:

```bash
frontend/.env
VITE_GENLAYER_CONTRACT_ADDRESS=<CONTRACT_ADDRESS>
```

## Demo scenario

Use these fields in the frontend and on-chain command:

- Contributor: `Decem`
- Title: `Guide: Building a Proof-of-Contribution Judge on GenLayer`
- Evidence URL: your GitHub/blog/demo URL
- Summary: explain that the app reviews campaign submissions using GenLayer Intelligent Contracts and AI consensus.
- Rubric: approve useful, verifiable, GenLayer-aligned contributions; needs review for incomplete work; reject spam/unrelated work.

## Submission package

After deploy and Vercel publish, submit:

- Contract address: `0x410E01fb3ECba47b0098eC57F5482536223c2876`
- Demo: `<Vercel URL>`
- GitHub: `<GitHub URL>`
- Blog: `docs/BLOG.md` published on Mirror/Medium/Substack/X article

## Notes

The frontend includes a local preview scorer so the demo works before contract deployment. The authoritative review is the GenLayer write transaction executed by `review_contribution`.
