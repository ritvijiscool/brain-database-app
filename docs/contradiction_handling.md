# Contradiction Handling

This document defines how the system handles conflicting information.

---

## Definition

A **Contradiction** occurs when two ideas assert mutually exclusive truths in the same context.

- **Explicit:** Direct logical negation (A = "X is true", B = "X is false").
- **Implicit:** Factual conflict (A = "Event happened in 1999", B = "Event happened in 2001").

---

## Detection

In v1, detection is primarily **Reactive** or **User-Flagged**.
- **Keyword Logic:** "X is Y" vs "X is not Y".
- **User Flagging:** User explicitly creates a `CONTRADICTS` link between two nodes.

---

## Presentation

When a contradiction is identified (by AI or User):

**UI Alert:**
> ⚠️ **Conflict Detected**
>
> Idea A: "Coffee is healthy."
> Idea B: "Coffee is harmful."
>
> How would you like to handle this?

---

## Resolution Actions

The user **must** choose one of the following; the system never decides truth.

### 1. Keep Both (Mark as Contradiction)
- **Action:** Create `CONTRADICTS` link.
- **Meaning:** "I acknowledge these conflicting views exist in my database."
- **Use Case:** Tracking a debate, changing scientific consensus, or holding uncertain hypotheses.

### 2. Contextualize (Refine)
- **Action:** Edit one or both ideas to specify context.
- **Example:** Change to "Coffee is healthy **in moderation**" and "Coffee is harmful **if consumed in excess**."
- **Result:** Conflict resolved; link type may change to `SUPPORTS` or `REFINES`.

### 3. Resolve (Delete Falsehood)
- **Action:** Delete the incorrect idea.
- **Meaning:** "I have decided one of these is simply wrong."

### 4. Ignore (False Positive)
- **Action:** Dismiss alert. No link created.
- **Meaning:** "These do not actually contradict."

---

## System Neutrality

> **The System is Agnostic.** It does not care which idea is true. Its only goal is to ensure the **Graph Consistency** reflects the User's mind. If the User believes two contradictory things, the System faithfully records that contradiction.
