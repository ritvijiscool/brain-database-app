# Retrieval Controls

This document defines the manual overrides available to the user.

---

## Relevance Tuner

A simple slider or toggle set allowing the user to adjust the "Fuzziness" of retrieval:
- **Exact:** Only show ideas with exact keyword matches.
- **Strict:** High semantic threshold.
- **Broad:** Loose associations (Brainstorming mode).

---

## Pinning

- **Action:** User pins an Idea to the "Context Sidebar".
- **Effect:** This idea is manually forced to be relevant/visible regardless of what the user types next.
- **Use Case:** Keeping a constraint or goal in mind while working.

---

## Exclusion (The "Not That" Filter)

- **Action:** User dismisses a retrieval result with "Not relevant now".
- **Effect:** Temporary suppression of that idea (and its close neighbors) for the current session.
- **Hard Exclusion:** "Never suggest this when I'm working on [Topic X]."

---

## Explicit Overrides

User settings **always** override algorithmic rankings.
- If user Pins X, X is #1.
- If user Excludes Y, Y is hidden, even if AI loves it.

---

> **Principle:** The pilot flies the plane. The autopilot just assists.
