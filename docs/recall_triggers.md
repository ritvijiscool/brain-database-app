# Recall Triggers

This document defines when and how recall sessions are triggered.

---

## Allowed Triggers

Recall is never random. It is always **Contextual** or **User-Initiated**.

### 1. During Related Work
**Trigger:** User is viewing or editing Idea A.
**Action:** System identifies Idea B (linked to A) that hasn't been recalled recently.
**Prompt:** "Since you're looking at [Idea A], do you remember [Idea B]?"

### 2. Post-Resolution
**Trigger:** User resolves a contradiction or creates a new link.
**Action:** System triggers a lightweight check on the affected nodes to solidify the new structure.
**Prompt:** "Now that you've connected these, how does [Idea X] relate to [Idea Y]?"

### 3. Periodic Lightweight Checks
**Trigger:** User opens the app after a significant break (e.g., >24 hours).
**Action:** System presents a "Daily Review" queue (optional).
**Constraint:** Must be explicitly opened by the user (e.g., clicking a "Review Due" button). **never** a modal popup on launch.

---

## Forbidden Triggers

To prevent annoyance and interruption:

- **No Random Popups:** Recall never interrupts active typing or editing.
- **No Push Notifications:** The app does not demand attention when closed.
- **No "Spaced Repetition" Grind:** The goal is not to clear a queue, but to maintain a healthy graph.

---

> **Principle:** Recall is a service to the user, not a chore. It appears when relevant, not when the algorithm demands it.
