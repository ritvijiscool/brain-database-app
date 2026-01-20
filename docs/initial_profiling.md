# Initial Profiling Strategy

This document defines how the system infers user preferences during the first interactions.

---

## Profiling Window

- **Monitor first 3–5 user inputs** before setting profile defaults.
- No profiling happens on single inputs; system waits for pattern detection.

---

## Inference Rules

### Preferred Detail Level

Inferred from input length and complexity:

| Input Pattern | Inferred Level |
|---------------|----------------|
| Short, concise (≤10 words avg) | `low` |
| Medium length (11–25 words avg) | `medium` |
| Long, elaborate (>25 words avg) | `high` |

**Additional signals:**
- Use of technical jargon → higher detail preference
- Bullet points or structured input → higher detail preference
- Single sentences or fragments → lower detail preference

### Abstraction Preference

| Input Pattern | Inferred Abstraction |
|---------------|---------------------|
| Raw facts, minimal context | 0–1 (raw/light) |
| Summarized statements | 2–3 (summarized/abstracted) |
| High-level concepts only | 4–5 (compressed) |

---

## Topic Familiarity Detection

Scan input for prior knowledge cues:

| Cue | Interpretation |
|-----|----------------|
| "I already know..." | Topic marked as known |
| "As we discussed..." | Topic marked as familiar |
| Domain-specific terminology used fluently | Topic likely known |
| Questions about basics | Topic likely unfamiliar |
| Definitions provided by user | Topic likely known |

**Action:** Add detected topics to `known_topics` array.

---

## Initial Confidence

- **All new ideas start at medium confidence (0.5)**
- Confidence adjusts only after recall attempts

---

## Recording to `user_profile.json`

After profiling window completes, write inferred values:

```json
{
  "preferred_detail_level": "<inferred>",
  "known_topics": ["<detected>", "..."],
  "recall_success_rate": 0.0,
  "correction_frequency": 0.0,
  "abstraction_preference": <inferred>,
  "first_interaction": "<timestamp>",
  "last_interaction": "<timestamp>"
}
```

---

## Fallback Defaults

If inference is ambiguous or insufficient data:

| Field | Fallback Value |
|-------|----------------|
| `preferred_detail_level` | `"medium"` |
| `known_topics` | `[]` (empty) |
| `recall_success_rate` | `0.0` |
| `correction_frequency` | `0.0` |
| `abstraction_preference` | `2` |

---

## Profiling Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INPUTS (1-5)                        │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   Analyze Patterns    │
              │   • Length            │
              │   • Complexity        │
              │   • Domain cues       │
              └───────────┬───────────┘
                          │
          ┌───────────────┴───────────────┐
          │                               │
          ▼                               ▼
┌─────────────────┐             ┌─────────────────┐
│  Clear Pattern  │             │ Ambiguous Data  │
│  Detected       │             │                 │
└────────┬────────┘             └────────┬────────┘
         │                               │
         ▼                               ▼
┌─────────────────┐             ┌─────────────────┐
│ Write Inferred  │             │ Write Fallback  │
│ Values          │             │ Defaults        │
└────────┬────────┘             └────────┬────────┘
         │                               │
         └───────────────┬───────────────┘
                         ▼
              ┌───────────────────────┐
              │  user_profile.json    │
              │  populated            │
              └───────────────────────┘
```

---

> **Note:** Profiling is passive and non-intrusive. User is never asked explicit preference questions unless they choose to configure manually.
