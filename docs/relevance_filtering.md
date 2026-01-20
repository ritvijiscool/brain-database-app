# Relevance Filtering

This document defines how ideas are selected for retrieval.

---

## Selection Logic

When retrieval is triggered, thousands of ideas must be filtered down to a handful.

### 1. Hard Filters (Strict)
- **Topic:** Must match current Focus (if set).
- **Status:** Must not be "Archived" or "Trash".

### 2. Scoring Signal (Ranking)
Ideas are scored on:
- **Semantic Match:** Keyword / Vector similarity to Active Input. (Highest Weight)
- **Link Connectivity:** Is it directly linked to the current topic?
- **Recency:** Recently modified ideas get a slight boost (Context dependent).
- **Confidence:** High confidence ideas are preferred for foundational answers.

---

## Volume Limits

To prevent cognitive overload, the system enforces hard limits:
- **Max Items:** Default 3-5 items per suggestion block.
- **Max Length:** Total word count limit for retrieved text.

> **Rule:** Never dump the whole database. A blank screen is better than a noisy one.

---

## Tuning

Parameters (Weights for Semantic vs. Recency) should be exposed in settings for advanced users ("Discovery Mode" vs. "Focus Mode").

---

> **Principle:** Signal over noise.
