# Non-Recall Safeguards

This document defines rules to prevent user fatigue and system annoyance.

---

## Rules

### 1. Maximum Frequency Cap
- **Rule:** No individual idea can be recalled more than once every X hours (default: 24h).
- **Rule:** No more than Y recall prompts per session (default: 5).
- **Exception:** User explicitly requests "Review All".

### 2. User Pause Button
- **Feature:** A global toggle or setting: `[Pause All Recalls]`
- **Effect:** System stops generating prompts until re-enabled. No memory decay penalties accrue during pause.

### 3. Fatigue Detection
- **Trigger:** User dismisses/skips 3 prompts in a row.
- **Action:** System auto-snoozes recall features for the rest of the session.
- **Message:** "Looks like you're busy. I'll hold off on questions for now."

---

## Anti-Pattern Prevention

- **No "Backlog Guilt":** Users should never open the app to see "100 cards due". If the backlog is huge, the system samples the most important ones and hides the rest.

---

> **Principle:** The system respects the user's attention.
