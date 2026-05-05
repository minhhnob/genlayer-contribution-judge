# Deployment Guide

## 1. Validate the contract locally if tooling is available

```bash
pip install -r requirements.txt
genvm-lint check contracts/ContributionJudge.py
```

If `genvm-lint` reports an SDK/toolchain issue, still use GenLayer Studio as the final source of truth and paste the Studio error back into the coding agent for fixes.

## 2. Deploy on GenLayer Studio

1. Go to https://studio.genlayer.com/contracts
2. Connect wallet.
3. Claim faucet GEN if prompted by the network.
4. Create/load a contract and paste/upload `contracts/ContributionJudge.py`.
5. Set constructor input:

```json
{
  "campaign_name": "GenLayer Contributor Campaign"
}
```

6. Click **Deploy**.
7. Copy the contract address shown after success.

## 3. Configure frontend

In `frontend/.env`:

```bash
VITE_GENLAYER_CONTRACT_ADDRESS=<PASTE_CONTRACT_ADDRESS>
VITE_GENLAYER_NETWORK=studionet
```

For Vercel, set the same variables in Project Settings → Environment Variables.

## 4. Run and build frontend

```bash
cd frontend
npm install
npm run build
npm run dev
```

## 5. Publish to GitHub

```bash
git init
git add .
git commit -m "feat: add GenLayer contribution judge demo"
gh repo create genlayer-contribution-judge --public --source=. --remote=origin --push
```

If `gh` is not logged in, create the repo manually on GitHub and push using the instructions shown by GitHub.

## 6. Deploy to Vercel

Option A — Vercel dashboard:

1. Import the GitHub repo.
2. Framework preset: Vite.
3. Root directory: `frontend`.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Add env vars from step 3.
7. Deploy.

Option B — CLI:

```bash
cd frontend
npx vercel --prod
```

## 7. Final verification

- Vercel opens without console errors.
- Contract address is visible in the hero card.
- Frontend generates a `genlayer write ... review_contribution` command.
- Blog and Gen Portal description include GitHub, Vercel, and contract address links.
