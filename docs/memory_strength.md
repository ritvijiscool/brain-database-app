# Memory Strength

This document defines the "Health" or "Strength" attribute of an idea's memory trace.

---

## Dynamics

Memory Strength is a fluid value that changes based on interaction.

### Increases Strength (+)
- **Use:** Linking the idea to others.
- **Recall:** Successfully answering a recall prompt.
- **Application:** Successfully applying the idea in context.

### Decreases Strength (-)
- **Non-Use:** Time passing without interaction (Decay).
- **Failure:** Explicitly failing a recall attempt (significant drop).

---

## Properties

- **Gradual:** Strength builds slowly. One success does not mean "Mastered".
- **Reversible:** Strength is never locked. A mastered idea can decay; a forgotten idea can be relearned.

---

## Visualizing Strength (v1)

For usability, strength is bucketed into stages:

1.  **New / Seed:** Just created. Volatile.
2.  **Sprouting:** Recalled once or twice.
3.  **Established:** Consistently used/recalled.
4.  **Deep Rooted:** Rarely needs checking.

*(Technical implementation may use a float 0.0-1.0, but UI shows these stages.)*

---

> **Note:** This replaces standard "Spaced Repetition" algorithms. We simulate organic memory health rather than optimizing for an exam date.
