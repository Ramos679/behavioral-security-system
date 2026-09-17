# Detection Model

## Baseline Strategy

Behavior should be modeled at multiple levels because no single baseline is reliable enough on its own.

### Personal Baseline

Tracks what is normal for an individual account:

- login times
- locations and networks
- devices
- applications
- repositories
- file shares
- database tables
- cloud accounts
- privilege usage
- data movement volume

### Peer Baseline

Compares the account with similar users:

- role
- team
- geography
- seniority
- employment type
- project membership

Peer baselines help when an account is new or has sparse history.

### Resource Baseline

Tracks normal access to the target asset:

- common users
- common teams
- expected actions
- normal access volume
- sensitivity class
- production or non-production status

### Temporal Baseline

Separates expected work patterns:

- weekday versus weekend
- working hours versus off-hours
- local time zone
- travel period
- deployment window
- on-call shift

## Feature Categories

Features should be grouped into independent signal families:

- identity
- device
- network
- resource access
- privilege
- data movement
- collaboration graph
- business context

Independent signal families are important because a suspicious transition is more convincing when different kinds of evidence agree.

## Scoring

A simple scoring model can start with:

```text
event_risk =
  signal_severity
  * rarity_against_user
  * rarity_against_peers
  * asset_sensitivity
  * confidence

account_risk =
  decayed_prior_risk
  + event_risk
  + sequence_risk
  - legitimate_context_credit
```

The model should avoid treating context as a complete override. A role change may explain access to a new project repository, but it may not explain unrelated production database exports.

## Sequence Correlation

The correlator should look for chains such as:

- password reset, new device, sensitive resource access
- MFA fatigue, successful login, mailbox rule creation
- first-time repository access, secret search, cloud role assignment
- unusual database reads, compressed files, external upload
- contractor nearing end date, access expansion, bulk download

Sequences should receive higher priority when they include multiple independent signal families.

## Transition Mode

When the system detects legitimate change, it can place the account in transition mode.

Transition mode adjusts expectations for a limited period while still preserving guardrails:

- allow access consistent with the new role or project
- keep sensitivity-based thresholds active
- watch for unrelated resource access
- prevent immediate baseline poisoning
- require confirmation before permanently updating long-term baselines

## False-Positive Controls

Recommended controls:

- combine personal, peer, and resource baselines
- require multiple weak signals before escalation
- decay stale anomalies
- suppress planned maintenance windows
- treat approved access differently from unexplained access
- maintain role-specific thresholds
- separate human and service account models
- audit noisy detections regularly
- collect analyst feedback

## High-Value Alert Criteria

An alert should be prioritized when it has:

- sensitive asset exposure
- strong deviation from personal history
- strong deviation from peer behavior
- multiple independent signal families
- rapid behavior change
- privilege expansion
- missing legitimate context
- similarity to confirmed incidents

This keeps the queue focused on activity that is both unusual and important.
