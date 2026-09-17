# Architecture

## Overview

The behavioral security system is organized around one principle: events become useful only after they are compared with baseline behavior and business context.

The platform has six major layers:

1. Event ingestion
2. Normalization and enrichment
3. Baseline modeling
4. Context resolution
5. Deviation and sequence scoring
6. Investigator explanation and feedback

## Event Ingestion

The system consumes security, identity, collaboration, and business records from sources such as:

- SSO and identity providers
- VPN and zero trust access gateways
- Endpoint and EDR platforms
- Cloud audit logs
- SaaS audit logs
- Source control platforms
- File storage and data warehouses
- HR systems
- Ticketing and project management tools

Events should be streamed when possible, but batch ingestion is acceptable for lower-urgency context sources.

## Normalization

Raw events are converted into a shared schema:

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
network_context
geo_context
privilege_context
data_volume
asset_sensitivity
business_context_refs
```

Normalization allows the system to correlate activity across tools that use different terminology.

## Enrichment

Enrichment attaches useful meaning to otherwise flat events:

- Is the resource sensitive?
- Is the device managed?
- Is the actor a human, admin, contractor, or service account?
- Is the account in a role transition?
- Is there an approved access request?
- Is this during an on-call or deployment window?
- Does this action match peer behavior?

## Baseline Services

The system maintains several baselines:

- User baseline: normal behavior for the account.
- Peer baseline: normal behavior for similar users.
- Resource baseline: normal access patterns for the asset.
- Time baseline: normal activity by time of day, day of week, and working pattern.
- Privilege baseline: normal administrative and elevated behavior.

Baselines should be versioned so investigators can see what the system believed at alert time.

## Context Resolver

The context resolver looks for legitimate explanations before risk is escalated. Examples include:

- project assignment
- ticket approval
- manager approval
- role or team change
- scheduled deployment
- approved travel
- incident response work
- on-call rotation

Context can reduce risk, explain an alert, or place an account in transition mode. It should not automatically suppress risky behavior.

## Scoring and Correlation

The scoring layer evaluates individual deviations, then combines them across time:

- short window: minutes to hours
- medium window: one to seven days
- long window: several weeks

This allows the system to detect both rapid account takeover and slow insider-risk patterns.

## Investigator Workbench

The workbench should present:

- alert summary
- event timeline
- risk contributors
- baseline comparison
- peer comparison
- asset sensitivity
- known business context
- recommended investigation steps
- analyst feedback controls

The interface should make the alert explainable without requiring analysts to manually reconstruct the sequence from raw logs.

## Feedback Loop

Analyst feedback improves the system over time:

- true positive
- benign authorized change
- expected but undocumented
- noisy detection
- duplicate
- insufficient evidence

Feedback should tune thresholds and context mappings. It should not immediately teach suspicious activity into the normal baseline.
