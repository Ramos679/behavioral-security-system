# Investigation Playbook

## Triage Questions

An alert answers four questions before an analyst opens raw logs:

1. What changed?
2. Why is that unusual for this account, peer group, or resource?
3. What happened before and after the change?
4. What business context explains or fails to explain it?

If the alert cannot answer those questions, it is probably not ready for the investigation queue.

## Review Workflow

1. Confirm the actor, session, source network, and device.
2. Read the timeline from first contributing event to latest event.
3. Compare the behavior with account, peer, resource, time, and privilege baselines.
4. Check tickets, project membership, HR changes, travel, deployment windows, and on-call schedules.
5. Review the sensitivity and owner of each affected asset.
6. Decide whether the next step is monitoring, owner confirmation, user verification, or containment.
7. Close the alert with a feedback label and a short reason.

## Alert Explanation

A strong alert includes:

- a one-paragraph case summary
- the top risk contributors and their weights
- baseline comparisons with time windows
- a timeline of supporting events
- affected resources and sensitivity labels
- context matches and context gaps
- recommended next action

Example:

```text
This account moved into an unusual engineering access pattern within 50 minutes of a new-device login. The user opened a production deployment repository for the first time, searched internal docs for deployment credentials, then downloaded 700 MB from a critical storage path. No matching project assignment, access ticket, travel record, or on-call shift was found.
```

## Response Actions

Response matches the risk and confidence:

- Monitor the ledger for more evidence.
- Ask the resource owner whether the access was expected.
- Request user verification through an approved channel.
- Revoke temporary elevation.
- Invalidate active sessions.
- Rotate exposed credentials.
- Isolate an unmanaged or unhealthy device.
- Open an incident response case.

High-impact containment stays human-approved unless the organization has already documented an automation policy.

## Feedback Labels

Analysts close alerts with one of these labels:

- true positive
- benign authorized change
- expected but undocumented
- noisy detection
- duplicate
- insufficient evidence

The label alone is not enough. A short reason is valuable because it teaches the system which context source, threshold, or signal family needs adjustment.

## Quality Review

Every month, review:

- the highest-volume alert reasons
- teams with unusual false-positive rates
- detections closed as expected but undocumented
- assets with missing sensitivity labels
- alerts where analysts ignored the recommendation
- confirmed incidents that the model scored too low

This keeps the system honest. A behavioral detector that is never reviewed will slowly become either noisy or blind.
