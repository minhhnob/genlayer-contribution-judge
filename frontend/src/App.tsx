import { Clipboard, ExternalLink, ShieldCheck, Sparkles, Terminal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { buildCliCommand, localPreviewReview, type ReviewForm } from './review';
import { contractAddress, isConfigured, network } from './config';

const defaultRubric = `Score contribution evidence for a GenLayer contributor campaign.
Approve if the work is specific, useful, verifiable, and aligned with GenLayer.
Needs review if plausible but incomplete.
Reject if spammy, unrelated, or missing evidence.`;

const defaultForm: ReviewForm = {
  contributor: 'Decem',
  title: 'Guide: Building a Proof-of-Contribution Judge on GenLayer',
  evidenceUrl: 'https://github.com/yourname/genlayer-contribution-judge',
  summary:
    'I built a GenLayer Intelligent Contract demo that reviews contributor campaign submissions using AI reasoning. The app includes a deployed contract workflow, Vercel frontend, GitHub repo, blog template, and clear demo inputs for Gen Portal submission.',
  rubric: defaultRubric,
};

export function App() {
  const [form, setForm] = useState<ReviewForm>(defaultForm);
  const [copied, setCopied] = useState(false);
  const review = useMemo(() => localPreviewReview(form), [form]);
  const cliCommand = useMemo(() => buildCliCommand(form, contractAddress), [form]);
  const configured = isConfigured();

  function update<K extends keyof ReviewForm>(key: K, value: ReviewForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function copyCommand() {
    await navigator.clipboard.writeText(cliCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <main className="shell">
      <section className="hero">
        <div className="badge"><Sparkles size={16} /> GenLayer Intelligent Contract Demo</div>
        <h1>Proof-of-Contribution Judge</h1>
        <p>
          AI-native reviewer for contributor campaigns. Submit evidence, score it against a rubric,
          and route subjective decisions through a GenLayer Intelligent Contract.
        </p>
        <div className="cards three">
          <div className="mini"><strong>Network</strong><span>{network}</span></div>
          <div className="mini"><strong>Contract</strong><span>{configured ? contractAddress : 'Add contract address after Studio deploy'}</span></div>
          <div className="mini"><strong>Status</strong><span className={configured ? 'ok' : 'warn'}>{configured ? 'Ready for on-chain calls' : 'Preview mode'}</span></div>
        </div>
      </section>

      <section className="grid">
        <form className="panel" onSubmit={(e) => e.preventDefault()}>
          <h2>Review a contribution</h2>
          <label>
            Contributor
            <input value={form.contributor} onChange={(e) => update('contributor', e.target.value)} />
          </label>
          <label>
            Contribution title
            <input value={form.title} onChange={(e) => update('title', e.target.value)} />
          </label>
          <label>
            Evidence URL
            <input value={form.evidenceUrl} onChange={(e) => update('evidenceUrl', e.target.value)} />
          </label>
          <label>
            Summary
            <textarea rows={6} value={form.summary} onChange={(e) => update('summary', e.target.value)} />
          </label>
          <label>
            Rubric
            <textarea rows={7} value={form.rubric} onChange={(e) => update('rubric', e.target.value)} />
          </label>
        </form>

        <aside className="panel result">
          <div className="resultHeader">
            <ShieldCheck size={28} />
            <div>
              <h2>{review.decision}</h2>
              <p>Local preview score: {review.score}/100</p>
            </div>
          </div>
          <div className="meter"><span style={{ width: `${review.score}%` }} /></div>
          <h3>Reasoning preview</h3>
          <p>{review.reasoning}</p>
          <h3>Recommendation</h3>
          <p>{review.recommendation}</p>
          <div className="note">
            The deployed contract performs the authoritative AI review through GenLayer consensus.
            This frontend preview helps prepare demo inputs before sending an on-chain write.
          </div>
        </aside>
      </section>

      <section className="panel command">
        <div className="commandTop">
          <h2><Terminal size={20} /> GenLayer interaction command</h2>
          <button onClick={copyCommand}><Clipboard size={16} /> {copied ? 'Copied' : 'Copy'}</button>
        </div>
        <pre>{cliCommand}</pre>
        {!configured && (
          <p className="warnText">
            Deploy <code>contracts/ContributionJudge.py</code> in GenLayer Studio, then replace
            <code> VITE_GENLAYER_CONTRACT_ADDRESS </code> in Vercel/env with the real contract address.
          </p>
        )}
      </section>

      <section className="links">
        <a href="https://studio.genlayer.com/contracts" target="_blank" rel="noreferrer">
          Open GenLayer Studio <ExternalLink size={16} />
        </a>
        <a href="https://docs.genlayer.com/" target="_blank" rel="noreferrer">
          GenLayer Docs <ExternalLink size={16} />
        </a>
      </section>
    </main>
  );
}
