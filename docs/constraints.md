# Hard Constraints

This document defines the non-negotiable constraints that govern the design and implementation of brain-database-app.

---

## Cost

- **$0** — The application must be completely free to use with no paid tiers, subscriptions, or hidden costs.

---

## Backend

- **None** — All operations must be **local-first** and **offline-capable**.
- No server infrastructure, cloud dependencies, or external APIs required for core functionality.

---

## AI

- **Local-first** — AI processing must run entirely on the user's device when available.
- **Fallback heuristics** — If AI is unavailable (e.g., device limitations), the system must gracefully degrade to rule-based heuristics.

---

## Privacy

- **All user data belongs to the user** — No external storage, telemetry, or analytics.
- **No accounts required** — No user registration, login, or identity tracking.
- Data never leaves the user's device unless explicitly exported by the user.

---

## Accounts

- **None required** — Users can start using the application immediately without any signup or authentication.
- Zero friction to begin.

---

## Default Recall Behavior

- **Explicit questions only** — Recall is triggered by direct user-initiated queries.
- **Level-based progression**:
  1. **Recognition** — Can the user identify the information when prompted?
  2. **Reconstruction** — Can the user recall the information from memory?
  3. **Application** — Can the user apply the information in context?

---

## Default Compression Behavior

- **AI suggests only** — The AI may propose abstractions, summaries, or compressions.
- **User must approve** — No automatic compression or abstraction of user data. Every change requires explicit user consent.
