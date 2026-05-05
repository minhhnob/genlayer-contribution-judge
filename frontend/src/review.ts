export type ReviewForm = {
  contributor: string;
  title: string;
  evidenceUrl: string;
  summary: string;
  rubric: string;
};

export type LocalReview = {
  decision: 'APPROVED' | 'NEEDS_REVIEW' | 'REJECTED';
  score: number;
  reasoning: string;
  recommendation: string;
};

export function localPreviewReview(form: ReviewForm): LocalReview {
  const text = `${form.title} ${form.evidenceUrl} ${form.summary}`.toLowerCase();
  let score = 35;

  if (form.evidenceUrl.startsWith('https://')) score += 12;
  if (form.summary.length > 180) score += 18;
  if (form.summary.length > 400) score += 10;
  if (/github|medium|mirror|x\.com|twitter|notion|substack|youtube|docs/.test(text)) score += 12;
  if (/genlayer|intelligent contract|studio|contract|vercel|github|blog|tutorial|demo/.test(text)) score += 14;
  if (/spam|airdrop only|gm|test/.test(text)) score -= 20;
  score = Math.max(0, Math.min(100, score));

  const decision = score >= 72 ? 'APPROVED' : score >= 45 ? 'NEEDS_REVIEW' : 'REJECTED';
  return {
    decision,
    score,
    reasoning:
      decision === 'APPROVED'
        ? 'The submission looks specific, verifiable, and aligned with a GenLayer contributor campaign. The evidence URL and summary provide enough context for a reviewer.'
        : decision === 'NEEDS_REVIEW'
          ? 'The submission may be valid, but the evidence or impact details are not strong enough for an automatic approval. A human reviewer should inspect the link.'
          : 'The submission is too shallow, unrelated, or lacks credible evidence for a campaign contribution.',
    recommendation:
      'Add concrete work details, proof links, screenshots, and explain how the contribution helps GenLayer users or builders.',
  };
}

export function buildCliCommand(form: ReviewForm, contractAddress: string): string {
  const q = (s: string) => JSON.stringify(s);
  return `genlayer write ${contractAddress} review_contribution --args ${q(form.contributor)} ${q(form.title)} ${q(form.evidenceUrl)} ${q(form.summary)} ${q(form.rubric)}`;
}
