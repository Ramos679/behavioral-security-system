# Prototype

This folder contains a dependency-free browser prototype for the behavioral security system.

## Run

Open `index.html` directly in a browser, or run a small local server from the repository root:

```powershell
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000/prototype/
```

## What It Demonstrates

- Scenario switching between suspicious activity, legitimate onboarding, and slow drift.
- Account risk scoring with visible signal-family contributions.
- Event timeline correlation.
- Baseline comparison across user, peer, and current behavior.
- Context resolver output showing matches and gaps.
- Investigator-facing alert explanation and recommended next step.
