# Investigation Playbook

## Alert Triage

Analysts should begin with four questions:

1. What changed?
2. Why is it unusual?
3. Why now?
4. What legitimate context exists?

The system should answer these questions directly in the alert so the analyst does not need to reconstruct the case from raw logs.

## Review Workflow

1. Confirm the actor, device, source network, and session.
2. Review the timeline of contributing events.
3. Compare behavior with personal, peer, and resource baselines.
4. Check business context such as tickets, project membership, travel, and role changes.
5. Evaluate asset sensitivity and possible blast radius.
6. Decide whether containment, owner confirmation, or continued monitoring is appropriate.
7. Record feedback for model tuning.

## Explanation Requirements

Each alert should include:

- plain-language summary
- ranked risk contributors
- baseline comparisons
- timeline of supporting events
- affected resources
- sensitivity labels
- relevant context found
- context missing
- recommended next actions

## Example Analyst Summary

```text
This account became suspicious because it accessed three sensitive engineering resources for the first time within 24 hours, shortly after a login from a new unmanaged device. The user has no project assignment, access ticket, or role change explaining the activity. Two of the accessed resources contain production credentials.
```

## Suggested Response Actions

Possible actions should be proportional to risk:

- monitor account
- contact manager or resource owner
- request user verification
- revoke temporary elevation
- invalidate sessions
- rotate exposed credentials
- isolate unmanaged device
- open incident response case

The system should recommend actions, but high-impact containment should remain human-approved unless the organization has explicit automation policies.

## Feedback Labels

Analyst feedback labels:

- true positive
- benign authorized change
- expected but undocumented
- noisy detection
- duplicate
- insufficient evidence

Feedback should improve scoring, context resolution, and alert explanations over time.
