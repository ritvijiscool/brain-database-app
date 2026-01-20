# User Profile Fields

This document defines all user profile data points and their influence on system behavior.

---

## Fields Overview

| Field | Type | Description |
|-------|------|-------------|
| `preferred_detail_level` | enum | User's preferred level of detail |
| `known_topics` | array | Topics the user has mastered |
| `recall_success_rate` | float | Ratio of successful recalls |
| `correction_frequency` | float | How often user modifies AI output |
| `abstraction_preference` | integer | Preferred abstraction level |
| `first_interaction` | timestamp | When user first used the app |
| `last_interaction` | timestamp | Most recent interaction |
| `usage_history` | object | Per-idea usage statistics |

---

## Field Definitions

### `preferred_detail_level`

**Type:** `enum` — `"low"` | `"medium"` | `"high"`

**Description:**  
The user's preferred granularity when receiving explanations, hints, or recall prompts.

**System Influence:**
| Level | Chunking | Recall | Compression |
|-------|----------|--------|-------------|
| `low` | Larger chunks, fewer atomic ideas | Fewer hints, direct prompts | Aggressive suggestions |
| `medium` | Balanced chunking | Moderate scaffolding | Balanced suggestions |
| `high` | Highly granular, many atomic ideas | Detailed hints, step-by-step | Conservative suggestions |

---

### `known_topics`

**Type:** `array<string>`

**Description:**  
A list of topics the user has already mastered or is familiar with. Populated through successful recalls and explicit user marking.

**System Influence:**
- **Chunking:** Known topics may be referenced without full explanation.
- **Recall:** Known topics are recalled less frequently or at higher difficulty levels.
- **Compression:** Ideas in known topics are more likely to be suggested for abstraction.

---

### `recall_success_rate`

**Type:** `float` (0.0–1.0)

**Description:**  
The ratio of successful recalls to total recall attempts across all ideas.

**Calculation:**
```
recall_success_rate = successful_recalls / total_recall_attempts
```

**System Influence:**
- **Recall Scheduling:** Low success rate → more frequent recall prompts, lower difficulty.
- **Hints:** Users with lower rates receive more scaffolded hints.
- **Confidence:** Informs the confidence score of individual ideas.

---

### `correction_frequency`

**Type:** `float` (0.0–1.0)

**Description:**  
How often the user modifies AI-generated output, suggestions, or existing ideas.

**Calculation:**
```
correction_frequency = modifications / total_ai_suggestions
```

**System Influence:**
- **Compression:** High correction frequency → fewer automatic suggestions, more conservative AI behavior.
- **Trust Calibration:** System learns to present suggestions as drafts rather than final output.
- **Chunking:** May indicate user prefers different granularity than detected.

---

### `abstraction_preference`

**Type:** `integer` (0–5)

**Description:**  
The user's preferred level of idea abstraction.

| Level | Description |
|-------|-------------|
| 0 | Raw, unprocessed ideas |
| 1 | Lightly edited |
| 2 | Summarized |
| 3 | Abstracted concepts |
| 4 | Highly compressed |
| 5 | Single-word/symbol representations |

**System Influence:**
- **Compression:** Higher preference → more frequent compression suggestions.
- **Display:** Ideas displayed at preferred abstraction level when possible.
- **Storage:** Raw ideas always preserved; abstraction is a view layer.

---

### `first_interaction`

**Type:** `timestamp` (ISO 8601)

**Description:**  
The timestamp of the user's first interaction with the application.

**System Influence:**
- **Onboarding:** New users (< 7 days) may receive additional guidance.
- **Analytics:** Used to calculate engagement duration and retention.

---

### `last_interaction`

**Type:** `timestamp` (ISO 8601)

**Description:**  
The timestamp of the user's most recent interaction.

**System Influence:**
- **Recall Scheduling:** Long gaps since last interaction may trigger easier recall prompts.
- **Re-engagement:** If user returns after extended absence, system may offer a review session.

---

### `usage_history`

**Type:** `object` (per-idea statistics)

**Description:**  
Tracks usage patterns for each individual idea.

**Structure:**
```json
{
  "idea_id": {
    "created_at": "2026-01-20T15:00:00Z",
    "last_accessed": "2026-01-20T15:21:00Z",
    "access_count": 12,
    "recall_attempts": 5,
    "recall_successes": 4,
    "modifications": 2
  }
}
```

**System Influence:**
- **Recall Scheduling:** Frequently accessed ideas may be deprioritized; rarely accessed ideas prioritized.
- **Confidence:** High success rate → higher confidence score.
- **Compression:** Stable ideas (low modifications) are better candidates for abstraction.

---

## Behavior Summary

```
┌─────────────────────────┐
│     User Profile        │
└───────────┬─────────────┘
            │
    ┌───────┴───────┬───────────────┬────────────────┐
    ▼               ▼               ▼                ▼
┌───────┐     ┌─────────┐     ┌───────────┐    ┌─────────┐
│Chunking│    │ Recall  │     │Compression│    │ Display │
│ Logic │    │Scheduler│     │ Suggester │    │  Layer  │
└───────┘    └─────────┘     └───────────┘    └─────────┘
```

> **Note:** All profile data is stored locally. No external sync or accounts required.
