# Recall Failure Handling

This document defines the system's response when a user cannot recall an idea.

---

## Philosophy

- **No Penalties:** Failure is a system signal, not a user failure.
- **No Scoring:** Users are not graded. There are no "streaks" to lose.
- **No Shame:** The interface remains neutral and supportive.

---

## User States

When presented with a recall prompt ("Do you remember X?"), the user may indicate:

1.  **"Yes"** (Success)
2.  **"Sort of..."** (Partial)
3.  **"No"** (Failure)

---

## Recovery Actions

If the user answers **"No"** or **"Sort of"**, the system offers:

### 1. Reveal
Simply show the answer.
- *"Here is the idea: [Idea Text]"*

### 2. Hint / Scaffold
Show part of the idea or its neighbors.
- *"It is related to [Parent Topic]..."*
- *"It starts with 'Photo'..."*

### 3. Reframe
Present the idea in a different way (see `/docs/reframing.md`).
- *"Let's try a different angle..."*

### 4. Skip
Move on without showing the answer (if user prefers not to reinforce).

---

## Data Impact

Detailed in `/docs/memory_strength.md`, but specifically for failure:
- **Automatic Deletion:** NEVER. Failed recall does not delete ideas.
- **Memory Strength:** May decrease slightly or reset to "Needs Review".

---

> **Principle:** A failed recall is just an opportunity to re-connect.
