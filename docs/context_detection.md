# Context Detection

This document defines how the system detects and interprets user context.

---

## Allowed Signals

Context must be inferred **only** from explicit user actions within the application.

### 1. Active Input
**Signal:** The text currently being typed or reviewed.
**Inference:** Keywords and topics in the active buffer suggest current intent.
**Example:** User types "recipe", context = `Cooking`.

### 2. Recent Access
**Signal:** Ideas viewed or edited in the last X minutes.
**Inference:** The "Working Memory" trace defines the active session topic.

### 3. Explicit Declaration
**Signal:** User sets a "Focus Mode" or manually selects a topic tag.
**Inference:** Used as a hard filter.
**Example:** User selects "Project X" mode.

---

## Forbidden Signals (Privacy)

- **No OS Surveillance:** The app cannot read other windows, clipboard (unless pasted), or background processes.
- **No Location/Audio:** No sensors are used.
- **No Hidden Profiling:** The system does not build a psychological profile beyond explicitly stated preferences.

---

## Explainability

Every context inference must be explainable.
- *System:* "I'm showing cooking ideas because you typed 'spatula'."
- *User:* "Bad inference." -> *System:* "Understood. Ignoring 'spatula' for context."

---

> **Principle:** The system looks only where the user points it.
