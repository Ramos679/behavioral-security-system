# Architecture

## Overview

The system treats account risk as a case-building problem. Raw logs are noisy, context is incomplete, and a single event rarely proves intent. The architecture therefore keeps three things close together: normalized telemetry, baseline comparisons, and business context.

The main write path is:

1. Collect events from identity, endpoint, cloud, SaaS, data, and collaboration systems.
2. Normalize them into a shared event contract.
3. Enrich them with device, asset, identity, and business metadata.
4. Update baselines and short-lived sequence state.
5. Write changes into an account risk ledger.
6. Open an alert only when the ledger crosses an investigation threshold.

## Event Sources

Useful sources include:

- SSO and identity providers
- MFA, password reset, and session logs
- VPN or zero trust access gateways
- endpoint and EDR telemetry
- cloud audit logs
- SaaS audit logs
- source control audit logs
- file storage and warehouse access logs
- HR, ticketing, project, calendar, and on-call systems

High-velocity sources such as identity and cloud audit logs stream into the platform. Slower business-context sources can arrive in batches as long as the scoring layer records when context was last refreshed.

## Normalized Event Contract

Every source is mapped into a compact record:

```text
event_id
timestamp
actor_id
actor_type
action
resource_id
resource_type
source_system
device_id
session_id
network_context
geo_context
privilege_context
data_volume
asset_sensitivity
business_context_refs
raw_event_ref
```

The normalized record keeps enough detail for correlation without forcing every downstream model to understand each vendor's log format.

## Enrichment

Enrichment adds the details analysts usually look up by hand:

- resource owner and sensitivity label
- production versus non-production status
- whether the device is managed and healthy
- whether the actor is a human, admin, contractor, executive, or service account
- whether the account recently changed team, manager, title, or location
- whether an access ticket, incident ticket, deployment window, travel record, or on-call shift matches the event

Context matches and context gaps are both useful. A missing ticket is not proof of abuse, but it matters when paired with sensitive access and unusual timing.

## Baseline Services

The system maintains separate baselines because each one catches a different failure mode:

- Account baseline: what this user normally does.
- Peer baseline: what similar users normally do.
- Resource baseline: who normally touches this asset and how.
- Time baseline: when this account or peer group normally works.
- Privilege baseline: how often elevated actions happen and from where.

Baselines are versioned. Every alert links back to the baseline snapshot that existed when the score was produced.

## Context Resolver

The context resolver looks for legitimate explanations, but it does not erase risk by itself.

Examples:

- A project assignment can explain first-time repository access.
- An on-call shift can explain late-night production activity.
- A travel record can explain a new geography.
- A temporary access ticket can explain privilege elevation.

Those same explanations may not cover secret searches, mailbox rule creation, external sharing, or unrelated data exports. The resolver attaches scope to every explanation so scoring can tell what the context actually covers.

## Correlation Path

The correlator combines events across three horizons:

- Session horizon: minutes to hours, useful for account takeover.
- Workstream horizon: one to seven days, useful for access expansion.
- Drift horizon: several weeks, useful for slow insider-risk patterns.

Sequence state is explicit. For example, "new device" is low priority by itself, but it becomes much more important when followed by first-time production access and a large download.

## Account Risk Ledger

The ledger is the system of record for current suspicion:

```text
account_id
risk_state
active_anomalies
supporting_events
baseline_comparisons
context_matches
context_gaps
last_score_update
risk_decay_timer
analyst_feedback
```

Risk decays when behavior returns to normal. It increases when new evidence reinforces the same transition.

## Investigator Workbench

The analyst view opens with the case, not the math:

- what changed
- why it is unusual for this account
- whether peers do this
- which sensitive assets were involved
- what context was found
- what context was missing
- which events contributed most to the score
- what action is recommended next

The raw events stay one click away. The first screen, though, explains the transition in ordinary security language.

## Feedback Loop

Analyst labels feed back into thresholds, context mappings, and noisy-signal suppression:

- true positive
- benign authorized change
- expected but undocumented
- noisy detection
- duplicate
- insufficient evidence

Confirmed benign activity can update baselines after a delay. Suspicious activity is not learned immediately, otherwise an attacker can train the system to accept the new pattern.
