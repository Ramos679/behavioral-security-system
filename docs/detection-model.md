# Detection Model

## Modeling Choice

The model is built around behavioral transitions, not one-off anomalies. A single unfamiliar event often means nothing. A sequence of unfamiliar events that crosses identity, privilege, resource, and data boundaries is worth an analyst's time.

The first version can be rules plus statistics. A later version can replace parts of the scoring layer with ML, but the alert still needs to expose the same evidence: what changed, compared with what baseline, under what context.

## Baselines

### Account Baseline

The account baseline tracks the user's own habits:

- usual login hours and source networks
- known devices and managed-device rate
- common applications and repositories
- normal file shares, tables, buckets, and dashboards
- typical data export volume
- usual privilege elevation frequency

### Peer Baseline

The peer baseline gives the system a fallback when personal history is thin. Peers are grouped by role, team, geography, seniority, employment type, and project membership.

This matters for new hires and transferred employees. A new engineer is not judged only against an empty personal history; their activity is also compared with other engineers on the same project.

### Resource Baseline

The resource baseline focuses on the asset:

- normal user population
- normal teams and service accounts
- expected action types
- normal read and export volume
- sensitivity class
- production status

This catches cases where a user action is common for the user but strange for the resource, such as a marketing account reading a production deployment repository.

### Time Baseline

The time baseline separates:

- local working hours
- weekends and holidays
- on-call periods
- deployment windows
- travel periods

Time is rarely enough to raise an alert by itself. It is useful as a multiplier when the account is also touching new or sensitive assets.

## Features

Features are grouped into signal families so one noisy source cannot dominate the case:

- identity: login, MFA, password reset, OAuth grant
- device: new device, unmanaged device, posture change
- network: new ASN, impossible travel, risky IP
- access: first-time system, unusual resource class, broad fan-out
- privilege: group change, temporary elevation, admin console action
- data: bulk export, large read, external share, mailbox rule
- context: ticket, project, travel, role change, on-call

The scorer rewards agreement across families. Three identity quirks are weaker than one identity signal plus one privilege signal plus one sensitive data movement signal.

## Scoring

A transparent scoring model is enough for a first implementation:

```text
event_risk =
  signal_severity
  * user_rarity
  * peer_rarity
  * resource_rarity
  * asset_sensitivity
  * confidence

account_risk =
  decayed_prior_risk
  + event_risk
  + sequence_bonus
  - scoped_context_credit
```

The important detail is scoped context credit. Context reduces only the part of the risk it actually explains.

Example:

- Project assignment explains first-time repository access.
- It does not explain a bulk download from an unrelated production bucket.
- It does not explain mailbox forwarding to an external address.

## Sequence Patterns

High-value patterns include:

- password reset, new device, sensitive access
- MFA fatigue, successful login, mailbox rule creation
- first-time repository access, secret search, cloud role assignment
- unusual warehouse reads, compressed archive, external upload
- contractor end date approaching, access expansion, bulk download

Each pattern stores the events that matched it. Analysts need to see the chain, not just the final score.

## Transition Mode

Legitimate change happens. People join projects, move teams, travel, and take on-call shifts. When context indicates a real transition, the model can enter transition mode for a bounded period.

Transition mode changes the guardrails:

- access inside the new project scope becomes less surprising
- unrelated sensitive systems remain protected by normal thresholds
- data movement thresholds stay active
- new behavior is not immediately absorbed into the long-term baseline
- analyst or manager confirmation can shorten the transition period

This prevents the model from punishing normal job changes while still catching dangerous side effects.

## False-Positive Controls

The system controls noise through:

- peer comparison for sparse-history users
- resource comparison for sensitive assets
- sequence thresholds for weak signals
- decay for stale anomalies
- planned maintenance and deployment calendars
- scoped business context
- separate models for humans, admins, executives, contractors, and service accounts
- recurring review of closed noisy alerts

Noise is measured by team and role. A detection that works for finance may be useless for platform engineering.

## Alert Priority

Prioritize an alert when it has several of these traits:

- sensitive or regulated asset exposure
- strong deviation from account history
- strong deviation from peer behavior
- multiple signal families involved
- privilege expansion
- rapid behavior change
- missing or mismatched business context
- similarity to a confirmed incident pattern

The desired outcome is a smaller queue with better evidence, not a bigger queue with more mathematical confidence.

## Known Failure Modes

The design needs guardrails for:

- baseline poisoning by slow attackers
- incomplete HR or ticketing context
- shared accounts and service accounts
- users with seasonal work patterns
- teams that operate mostly outside standard hours
- sensitivity labels that are missing or stale

These are not edge cases. Track them as model-quality issues from the first prototype.
