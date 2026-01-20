# Confidence Model

This document defines the Confidence attribute for Ideas.

---

## Concept

**Confidence** is a metadata field (0.0 to 1.0, or Enum) representing the **User's trust** in the accuracy or utility of a specific Idea.

It does **NOT** represent:
- System certainty (how sure the AI is of the text).
- Importance (how critical the idea is).

It represents **Truth Value** or **Retention Strength**.

---

## Allowed States (v1)

In v1, Confidence is simplified to an Enum for usability:

| Level | Value | Meaning |
|-------|-------|---------|
| **Unknown** | `null` / `0` | Default. Untested, unverified, or new. |
| **Low** | `1` | Dubious, needs verification, or often forgotten. |
| **Medium** | `2` | Generally trusted, standard fact. |
| **High** | `3` | Absolute truth, axiom, deeply internalized. |

---

## Setting Confidence

### 1. Manual
User can manually toggle confidence on any idea card:
`[ Confidence: Unknown ▼ ]`

### 2. Recall-Based (Influence)
- **Successful Recall:** gently **increases** confidence (e.g., Unknown → Medium).
- **Failed Recall:** keeps confidence steady or lowers it (High → Medium).

*Note: In v1, automatic updates are conservative. We prioritize manual setting.*

---

## Influence on System

Confidence scores lightly influence behavior:

1.  **Suggestions:** High-confidence ideas are more likely to be suggested as logical premises or "Parent" nodes in links.
2.  **Display:** Low-confidence ideas may be visually flagged (e.g., "Verify this").
3.  **Contradictions:** If High-Conf A contradicts Low-Conf B, the system might suggest "Review B" (The low-confidence idea is the suspect).

---

## Default State

**All new ideas start as `Unknown`.**
The user must "earn" or "assign" truth value.
