# { "Depends": "py-genlayer:test" }

from genlayer import *
import json

ERROR_EXPECTED = "[EXPECTED]"
ERROR_LLM = "[LLM_ERROR]"


class ContributionJudge(gl.Contract):
    """AI-native Proof-of-Contribution reviewer for GenLayer campaigns.

    Users submit contribution evidence and rubric text. The contract asks an LLM
    to score the submission, then validators rerun the same review and compare
    only stable decision fields. The reasoning text may differ across validators.
    """

    owner: Address
    campaign_name: str
    total_submissions: u256
    submissions: TreeMap[str, str]
    submission_ids: DynArray[str]

    def __init__(self, campaign_name: str):
        self.owner = gl.message.sender_address
        self.campaign_name = campaign_name
        self.total_submissions = 0

    @gl.public.view
    def get_campaign(self) -> dict:
        return {
            "name": self.campaign_name,
            "owner": str(self.owner),
            "total_submissions": int(self.total_submissions),
        }

    @gl.public.view
    def get_submission_count(self) -> int:
        return int(self.total_submissions)

    @gl.public.view
    def get_submission_id(self, index: int) -> str:
        if index < 0 or index >= int(self.total_submissions):
            raise gl.vm.UserError(f"{ERROR_EXPECTED} Submission index out of range")
        return self.submission_ids[index]

    @gl.public.view
    def get_submission(self, submission_id: str) -> dict:
        raw = self.submissions[submission_id]
        if raw == "":
            raise gl.vm.UserError(f"{ERROR_EXPECTED} Submission not found")
        return json.loads(raw)

    @gl.public.write
    def review_contribution(
        self,
        contributor: str,
        title: str,
        evidence_url: str,
        summary: str,
        rubric: str,
    ) -> str:
        self._validate_input(contributor, title, evidence_url, summary, rubric)

        review = self._review_with_consensus(contributor, title, evidence_url, summary, rubric)
        submission_id = "submission-" + str(int(self.total_submissions) + 1)

        record = {
            "id": submission_id,
            "contributor": contributor,
            "title": title,
            "evidence_url": evidence_url,
            "summary": summary,
            "rubric": rubric,
            "decision": review["decision"],
            "score": review["score"],
            "reasoning": review["reasoning"],
            "recommendation": review["recommendation"],
        }

        self.submissions[submission_id] = json.dumps(record, sort_keys=True)
        self.submission_ids.append(submission_id)
        self.total_submissions += 1
        return submission_id

    def _validate_input(self, contributor: str, title: str, evidence_url: str, summary: str, rubric: str) -> None:
        if len(contributor.strip()) < 2:
            raise gl.vm.UserError(f"{ERROR_EXPECTED} Contributor name is required")
        if len(title.strip()) < 4:
            raise gl.vm.UserError(f"{ERROR_EXPECTED} Title is too short")
        if not evidence_url.startswith("http://") and not evidence_url.startswith("https://"):
            raise gl.vm.UserError(f"{ERROR_EXPECTED} Evidence URL must start with http:// or https://")
        if len(summary.strip()) < 40:
            raise gl.vm.UserError(f"{ERROR_EXPECTED} Summary must be at least 40 characters")
        if len(rubric.strip()) < 30:
            raise gl.vm.UserError(f"{ERROR_EXPECTED} Rubric must be at least 30 characters")

    def _review_with_consensus(
        self,
        contributor: str,
        title: str,
        evidence_url: str,
        summary: str,
        rubric: str,
    ) -> dict:
        def leader_fn() -> dict:
            prompt = f"""
You are a strict but fair GenLayer contribution reviewer.

Review this contributor submission using the rubric.
Return JSON only with these keys:
- decision: one of APPROVED, NEEDS_REVIEW, REJECTED
- score: integer from 0 to 100
- reasoning: concise explanation, max 900 chars
- recommendation: one concrete improvement, max 240 chars

Rubric:
{rubric}

Submission:
Contributor: {contributor}
Title: {title}
Evidence URL: {evidence_url}
Summary: {summary}

Decision rules:
- APPROVED if it is specific, verifiable, useful for the campaign, and appears complete.
- NEEDS_REVIEW if evidence is plausible but incomplete, unclear, or needs human checking.
- REJECTED if spammy, unrelated, missing evidence, or too shallow.
- Penalize generic AI slop and summaries that do not explain concrete work.
"""
            raw = gl.nondet.exec_prompt(prompt, response_format="json")
            if not isinstance(raw, dict):
                raise gl.vm.UserError(f"{ERROR_LLM} LLM returned non-object response")

            decision = str(raw.get("decision", "NEEDS_REVIEW")).strip().upper()
            if decision not in ["APPROVED", "NEEDS_REVIEW", "REJECTED"]:
                decision = "NEEDS_REVIEW"

            score_raw = raw.get("score", 50)
            try:
                score = int(float(str(score_raw).strip()))
            except Exception:
                raise gl.vm.UserError(f"{ERROR_LLM} LLM score is not numeric")
            if score < 0:
                score = 0
            if score > 100:
                score = 100

            reasoning = str(raw.get("reasoning", "No reasoning provided."))[:900]
            recommendation = str(raw.get("recommendation", "Add clearer evidence and more specific impact details."))[:240]
            return {
                "decision": decision,
                "score": score,
                "reasoning": reasoning,
                "recommendation": recommendation,
            }

        def validator_fn(leaders_res: gl.vm.Result) -> bool:
            if not isinstance(leaders_res, gl.vm.Return):
                return False

            validator_result = leader_fn()
            leader_result = leaders_res.calldata

            leader_decision = str(leader_result.get("decision", "")).upper()
            validator_decision = str(validator_result.get("decision", "")).upper()
            if leader_decision != validator_decision:
                return False

            leader_score = int(leader_result.get("score", 0))
            validator_score = int(validator_result.get("score", 0))
            return abs(leader_score - validator_score) <= 15

        return gl.vm.run_nondet_unsafe(leader_fn, validator_fn)
