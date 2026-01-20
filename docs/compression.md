# Compression

This document defines how multiple ideas are compressed into higher-level abstractions.

---

## Definition

**Compression** is the creation of a new, high-level Idea that summarizes a cluster of lower-level ideas.

- **Child Nodes:** [Idea A, Idea B, Idea C] (Specific facts about dogs).
- **Parent Node:** [Idea Z] (General summary of dogs).

---

## Rules

### 1. Reversibility
- The Child Nodes are **never deleted** by compression.
- They are linked to the Parent with an `IS_SUMMARIZED_BY` or `DETAILS` edge.
- User can always "Decompress" (Click Parent → See Children).

### 2. User Approval
- The AI proposes the summary: *"These 5 notes look like they describe [Concept X]. Shall I group them?"*
- User edits/approves the summary text.

### 3. Usage
- In future retrievals, the system can choose to show **only the Parent** (Compression) to save space, unless the context requires specific details.

---

> **Principle:** Lossless compression. Abstraction hides complexity, it doesn't destroy it.
