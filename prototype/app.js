const scenarios = {
  suspicious: {
    account: {
      name: "Priya Shah",
      meta: "Marketing Manager · Boston · Human account",
    },
    score: 91,
    priority: "urgent",
    state: "investigation queue",
    summary:
      "New unmanaged device, first-time production repository access, secret-oriented search, temporary admin access, and critical storage download without matching business context.",
    metrics: {
      families: 5,
      contextMatches: 0,
      sensitiveAssets: 3,
      window: "50m",
    },
    events: [
      {
        time: "03:12",
        title: "New unmanaged device login",
        body: "Successful SSO login from Singapore on an unknown device and unfamiliar ASN.",
        tags: ["identity", "device", "network"],
        points: 20,
      },
      {
        time: "03:18",
        title: "First production repository access",
        body: "Opened repo-prod-deploy, a repository this account has not accessed in the prior 180 days.",
        tags: ["access", "critical repo"],
        points: 18,
      },
      {
        time: "03:26",
        title: "Secret-oriented documentation search",
        body: "Searched internal docs for deploy key and storage credentials from the same session.",
        tags: ["access", "credential intent"],
        points: 12,
      },
      {
        time: "03:41",
        title: "Temporary cloud admin grant",
        body: "Account received temporary admin permissions with no matching access ticket.",
        tags: ["privilege", "context gap"],
        points: 15,
      },
      {
        time: "04:02",
        title: "Bulk download from critical storage",
        body: "Downloaded 700 MB from a production credential storage path.",
        tags: ["data", "critical asset"],
        points: 35,
      },
    ],
    signals: [
      { name: "Identity", score: 68, note: "New device, unfamiliar source network, unusual session geography." },
      { name: "Access", score: 82, note: "First-time production engineering systems for a marketing role." },
      { name: "Privilege", score: 70, note: "Temporary admin grant without a matching request." },
      { name: "Data Movement", score: 94, note: "Large download from a critical storage path." },
      { name: "Context", score: 88, note: "No project, ticket, travel, or on-call match found." },
    ],
    baselines: [
      ["Production repository access", "0 in 180 days", "2% of marketing peers", "1 repo opened"],
      ["Cloud admin usage", "Never observed", "Rare outside platform team", "Temporary admin grant"],
      ["Sensitive storage download", "< 20 MB/week", "Not typical for role", "700 MB in 1 session"],
      ["Login geography", "Boston area", "US-based marketing group", "Singapore ASN"],
    ],
    context: [
      ["gap", "No project assignment", "No engineering or migration project includes this user."],
      ["gap", "No access ticket", "Temporary cloud admin grant has no approved request attached."],
      ["gap", "No travel record", "The source geography does not match HR or calendar travel context."],
      ["gap", "No on-call shift", "The account is not listed in production support rotations."],
    ],
    changed: [
      "First unmanaged device for the account.",
      "First production repository access in 180 days.",
      "Temporary admin grant without approval context.",
      "Critical storage download far above account and peer norms.",
    ],
    why:
      "The account crosses identity, access, privilege, and data boundaries in the same short window. The affected resources have high blast radius and no business context explains the sequence.",
    next:
      "Validate the session with the user through an approved channel, review the temporary admin grant, and rotate any credentials exposed by the storage download.",
  },
  onboarding: {
    account: {
      name: "Noah Chen",
      meta: "Backend Engineer · Seattle · Human account",
    },
    score: 38,
    priority: "watch",
    state: "transition mode",
    summary:
      "First-time repository and cloud access match a new payments project assignment and approved onboarding ticket.",
    metrics: {
      families: 3,
      contextMatches: 3,
      sensitiveAssets: 1,
      window: "2h 10m",
    },
    events: [
      {
        time: "16:04",
        title: "First payments repository access",
        body: "Opened repo-payments-api after being added to the payments project.",
        tags: ["access", "project match"],
        points: 8,
      },
      {
        time: "16:19",
        title: "Cloud console access",
        body: "Viewed staging logs in the team's cloud account.",
        tags: ["cloud", "staging"],
        points: 7,
      },
      {
        time: "17:02",
        title: "Temporary read-only elevation",
        body: "Received read-only debug role tied to approved ticket SEC-4182.",
        tags: ["privilege", "approved"],
        points: 5,
      },
      {
        time: "18:14",
        title: "Small config export",
        body: "Exported 4 MB of staging configuration for local setup.",
        tags: ["data", "low volume"],
        points: 3,
      },
    ],
    signals: [
      { name: "Identity", score: 18, note: "Known device and expected geography." },
      { name: "Access", score: 46, note: "New systems, but inside assigned project scope." },
      { name: "Privilege", score: 28, note: "Read-only grant tied to a ticket." },
      { name: "Data Movement", score: 12, note: "Low export volume from staging only." },
      { name: "Context", score: 10, note: "Project, ticket, and manager records explain the activity." },
    ],
    baselines: [
      ["Project repository access", "New account", "Common for backend peers", "1 project repo opened"],
      ["Cloud admin usage", "No history", "Read-only common during onboarding", "Read-only staging"],
      ["Sensitive storage download", "No history", "< 50 MB/day", "4 MB staging export"],
      ["Login geography", "Seattle area", "US engineering group", "Seattle office network"],
    ],
    context: [
      ["match", "Project assignment", "Payments project membership began this morning."],
      ["match", "Access ticket", "SEC-4182 approved read-only staging access."],
      ["match", "Manager approval", "Manager approval attached to onboarding workflow."],
      ["gap", "Production access", "No production access was requested or observed."],
    ],
    changed: [
      "New repository access after project assignment.",
      "Read-only staging role granted through an approved ticket.",
      "Small export volume consistent with setup work.",
    ],
    why:
      "The account is changing, but the changes are scoped to a documented onboarding workflow. The ledger stays in watch state because this is a transition period.",
    next:
      "Keep transition mode active for seven days and alert only if access leaves the payments project scope or touches production secrets.",
  },
  drift: {
    account: {
      name: "Maya Patel",
      meta: "Data Analyst · London · Human account",
    },
    score: 67,
    priority: "investigate",
    state: "analyst review",
    summary:
      "Access breadth has expanded across finance datasets over three weeks, with export volume rising and only partial project context.",
    metrics: {
      families: 4,
      contextMatches: 1,
      sensitiveAssets: 5,
      window: "21d",
    },
    events: [
      {
        time: "Day 1",
        title: "First payroll table query",
        body: "Queried a payroll table not previously used by the account.",
        tags: ["access", "finance"],
        points: 14,
      },
      {
        time: "Day 6",
        title: "New dashboard ownership",
        body: "Created dashboard joining headcount, payroll, and vendor spend data.",
        tags: ["analytics", "sensitive join"],
        points: 16,
      },
      {
        time: "Day 13",
        title: "Export volume increase",
        body: "Weekly export volume rose from 80 MB to 410 MB.",
        tags: ["data", "trend"],
        points: 18,
      },
      {
        time: "Day 21",
        title: "External share created",
        body: "Created a restricted external share for a file derived from finance data.",
        tags: ["sharing", "context partial"],
        points: 20,
      },
    ],
    signals: [
      { name: "Identity", score: 12, note: "Known device and expected location." },
      { name: "Access", score: 76, note: "Steady expansion into finance datasets." },
      { name: "Privilege", score: 34, note: "No admin grant, but data permissions broadened." },
      { name: "Data Movement", score: 72, note: "Export volume trend is above user and peer baseline." },
      { name: "Context", score: 52, note: "One analytics project matches; external sharing is not explained." },
    ],
    baselines: [
      ["Finance dataset access", "1 dataset/month", "2 datasets/month", "5 datasets in 21 days"],
      ["Export volume", "80 MB/week", "120 MB/week", "410 MB/week"],
      ["External sharing", "Never observed", "Rare for peer group", "1 restricted share"],
      ["Login geography", "London area", "UK analytics group", "London office network"],
    ],
    context: [
      ["match", "Analytics project", "Finance planning project explains some dataset access."],
      ["gap", "External share approval", "No approval found for sharing derived finance data."],
      ["gap", "Data owner review", "Payroll table owner has not approved access expansion."],
      ["gap", "Retention note", "No stated retention period for exported files."],
    ],
    changed: [
      "Finance dataset breadth expanded over three weeks.",
      "Export volume increased above account and peer norms.",
      "External share was created without approval context.",
    ],
    why:
      "This is not a takeover pattern. It is a gradual access expansion pattern with partial business context and increasing data movement.",
    next:
      "Ask the finance data owner to confirm the dataset scope, then review the external share and exported file retention.",
  },
};

let currentScenario = "suspicious";
let showWeights = true;

const riskColors = {
  urgent: "#b42318",
  investigate: "#b7791f",
  watch: "#2f6fad",
  normal: "#287a4a",
};

const elements = {
  accountName: document.querySelector("#accountName"),
  accountMeta: document.querySelector("#accountMeta"),
  priorityBadge: document.querySelector("#priorityBadge"),
  riskState: document.querySelector("#riskState"),
  riskScore: document.querySelector("#riskScore"),
  meterArc: document.querySelector("#meterArc"),
  caseSummary: document.querySelector("#caseSummary"),
  familyCount: document.querySelector("#familyCount"),
  contextMatches: document.querySelector("#contextMatches"),
  sensitiveAssets: document.querySelector("#sensitiveAssets"),
  caseWindow: document.querySelector("#caseWindow"),
  timeline: document.querySelector("#timeline"),
  eventCount: document.querySelector("#eventCount"),
  signals: document.querySelector("#signals"),
  baselineRows: document.querySelector("#baselineRows"),
  contextList: document.querySelector("#contextList"),
  changedList: document.querySelector("#changedList"),
  whyItMatters: document.querySelector("#whyItMatters"),
  nextStep: document.querySelector("#nextStep"),
  copyButton: document.querySelector("#copyButton"),
  toggleWeightsButton: document.querySelector("#toggleWeightsButton"),
  recalculateButton: document.querySelector("#recalculateButton"),
};

function renderScenario(key) {
  const scenario = scenarios[key];
  currentScenario = key;

  elements.accountName.textContent = scenario.account.name;
  elements.accountMeta.textContent = scenario.account.meta;
  elements.priorityBadge.textContent = titleCase(scenario.priority);
  elements.priorityBadge.className = `badge ${scenario.priority}`;
  elements.riskState.textContent = `State: ${scenario.state}`;
  elements.riskScore.textContent = scenario.score;
  elements.caseSummary.textContent = scenario.summary;
  elements.familyCount.textContent = scenario.metrics.families;
  elements.contextMatches.textContent = scenario.metrics.contextMatches;
  elements.sensitiveAssets.textContent = scenario.metrics.sensitiveAssets;
  elements.caseWindow.textContent = scenario.metrics.window;
  elements.eventCount.textContent = `${scenario.events.length} events`;

  updateMeter(scenario.score, scenario.priority);
  renderTimeline(scenario.events);
  renderSignals(scenario.signals);
  renderBaselines(scenario.baselines);
  renderContext(scenario.context);
  renderExplanation(scenario);
}

function updateMeter(score, priority) {
  const circumference = 301.59;
  const offset = circumference - (score / 100) * circumference;
  elements.meterArc.style.strokeDashoffset = offset;
  elements.meterArc.style.stroke = riskColors[priority] || riskColors.normal;
}

function renderTimeline(events) {
  elements.timeline.innerHTML = events
    .map(
      (event) => `
        <li class="timeline-item">
          <span class="event-time">${event.time}</span>
          <div class="event-body">
            <strong>${event.title}</strong>
            <p>${event.body}</p>
            <div class="event-tags">
              ${event.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
            </div>
          </div>
          <span class="event-points">+${event.points}</span>
        </li>
      `
    )
    .join("");
}

function renderSignals(signals) {
  elements.signals.innerHTML = signals
    .map(
      (signal) => `
        <div class="signal-row">
          <div class="signal-top">
            <span>${signal.name}</span>
            <span>${showWeights ? signal.score : labelScore(signal.score)}</span>
          </div>
          <div class="signal-bar">
            <div class="signal-fill" style="width: ${signal.score}%; background: ${signalColor(signal.score)}"></div>
          </div>
          <div class="signal-note">${signal.note}</div>
        </div>
      `
    )
    .join("");
}

function renderBaselines(rows) {
  elements.baselineRows.innerHTML = rows
    .map(
      (row) => `
        <tr>
          ${row.map((cell) => `<td>${cell}</td>`).join("")}
        </tr>
      `
    )
    .join("");
}

function renderContext(items) {
  elements.contextList.innerHTML = items
    .map(
      ([type, title, body]) => `
        <div class="context-item">
          <span class="context-icon ${type}">${type === "match" ? "✓" : "!"}</span>
          <div>
            <strong>${title}</strong>
            <p>${body}</p>
          </div>
        </div>
      `
    )
    .join("");
}

function renderExplanation(scenario) {
  elements.changedList.innerHTML = scenario.changed.map((item) => `<li>${item}</li>`).join("");
  elements.whyItMatters.textContent = scenario.why;
  elements.nextStep.textContent = scenario.next;
}

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function signalColor(score) {
  if (score >= 80) return "#b42318";
  if (score >= 55) return "#b7791f";
  if (score >= 30) return "#2f6fad";
  return "#287a4a";
}

function labelScore(score) {
  if (score >= 80) return "high";
  if (score >= 55) return "elevated";
  if (score >= 30) return "watch";
  return "low";
}

function copySummary() {
  const scenario = scenarios[currentScenario];
  const text = [
    `${scenario.account.name}: ${scenario.priority.toUpperCase()} risk (${scenario.score}/100)`,
    scenario.summary,
    `Why it matters: ${scenario.why}`,
    `Next step: ${scenario.next}`,
  ].join("\n\n");

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showToast("Summary copied"));
  } else {
    showToast("Copy unavailable in this browser");
  }
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

document.querySelectorAll(".segment").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".segment").forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-selected", "false");
    });
    button.classList.add("is-active");
    button.setAttribute("aria-selected", "true");
    renderScenario(button.dataset.scenario);
  });
});

elements.toggleWeightsButton.addEventListener("click", () => {
  showWeights = !showWeights;
  elements.toggleWeightsButton.textContent = showWeights ? "Weights" : "Labels";
  renderSignals(scenarios[currentScenario].signals);
});

elements.recalculateButton.addEventListener("click", () => {
  renderScenario(currentScenario);
  showToast("Risk recalculated");
});

elements.copyButton.addEventListener("click", copySummary);

renderScenario(currentScenario);
