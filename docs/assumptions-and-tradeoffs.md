# Assumptions and Tradeoffs

## Operating Assumptions

This design assumes the security team already has access to identity, SaaS, cloud, and endpoint logs. It also assumes some business context is available, even if it is incomplete: ticket IDs, project membership, HR role changes, travel records, or on-call schedules.

The system does not require perfect context. It does require context freshness to be visible. A ticket feed that last synced three days ago is different from one that synced five minutes ago, and the alert needs to show that difference.

## What The First Prototype Does

The first useful prototype can stay narrow:

- ingest SSO, cloud audit, source control, and ticket data
- build account and peer baselines for access frequency
- detect first-time sensitive resource access
- correlate new-device login with privilege and data movement
- generate one investigator-facing alert format
- collect analyst feedback on closed alerts

That prototype is enough to test whether the explanations help analysts make better decisions. It does not need a complex machine learning stack on day one.

## What It Does Not Do

The design avoids a few traps:

- It does not score every employee with a permanent "trust number."
- It does not treat unusual behavior as malicious by default.
- It does not auto-contain accounts unless the organization explicitly approves that response.
- It does not learn new behavior immediately after a suspicious sequence.
- It does not hide uncertainty from the analyst.

The system is meant to prioritize investigation, not replace judgment.

## Tradeoffs

### Personal Baselines Versus Peer Baselines

Personal baselines are precise when a user has enough history. They are weak for new hires, contractors, and recently transferred employees.

Peer baselines are less personal but more stable. They work well as a fallback, especially when the peer group is specific enough: "backend engineer on payments" is better than "engineer."

The design uses both because either one alone creates blind spots.

### Context Suppression Versus Context Credit

Suppressing alerts whenever a ticket exists is tempting, but risky. Real incidents often happen around real work because attackers use the access that already exists.

The safer pattern is scoped context credit:

- A ticket for repository access explains repository access.
- It does not explain production database exports.
- It does not explain OAuth grants to an unknown app.
- It does not explain mailbox forwarding.

This keeps legitimate work from flooding the queue while preserving evidence that falls outside the approved scope.

### Early Detection Versus False Positives

Earlier detection means less evidence. Lower noise means waiting for more evidence. The system balances this by using alert states:

- `watch`: unusual but not ready for human review
- `investigate`: enough cross-signal evidence for triage
- `urgent`: sensitive asset exposure or active privilege misuse

The watch state is important. It lets the system remember weak evidence without turning every odd event into a ticket.

## Data Quality Risks

The model is only as good as its metadata. Known risks include:

- stale sensitivity labels
- missing resource owners
- incomplete ticket integrations
- shared admin accounts
- noisy VPN geolocation
- service accounts mixed with human accounts
- teams with unusual work schedules

These issues need their own dashboard. If analysts keep closing alerts as "expected but undocumented," the system has a context problem, not an analyst problem.

## Privacy Boundaries

Behavioral monitoring can become invasive if the scope is unclear. This design focuses on work-system activity and security-relevant context. It does not need private message content, personal browsing content, or broad productivity surveillance.

The alert explains risky access patterns. It does not attempt to infer personal intent beyond the evidence available in enterprise systems.

## Review Cadence

Review the system monthly during the prototype phase:

- top alert reasons
- top suppressed reasons
- false-positive rate by team
- true-positive examples
- stale data sources
- missed incidents or near misses
- analyst comments on explanation quality

The model changes when the business changes. New projects, acquisitions, migrations, and reorganizations all affect what normal access looks like.
