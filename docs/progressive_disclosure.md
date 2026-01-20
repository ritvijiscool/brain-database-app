# Progressive Disclosure

This document defines how information density is managed via UI.

---

## Default State: Minimal

By default, retrieval results take up minimal space.
- **Headline Mode:** Show only the first line or strict summary of an idea.
- **Count Mode:** "3 Related Ideas Found [Expand]"

---

## Expansion Levels

The user controls the "Zoom Level" of the retrieval interface:

1.  **Level 0 (Hidden):** Subtle indicator icon only.
2.  **Level 1 (Glance):** Titles / First sentences. Good for reminders.
3.  **Level 2 (Full):** Full text of top 3 ideas.
4.  **Level 3 (Deep):** Full list with children/linked nodes interactively explorable.

---

## Overload Prevention

- **Lazy Loading:** Details are only fetched when the user scrolls or clicks "More".
- **Visual Hierarchy:** Use typography (bolding, size) to guide the eye to the most relevant segment.

---

> **Principle:** The user pulls details; the system pushes only summaries.
