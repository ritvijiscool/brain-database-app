# Deduplication Strategy

This document defines how duplicate ideas are identified and handled.

---

## 1. Exact Duplicates

**Definition:** Ideas with identical normalized text (ignoring case, whitespace, and punctuation).

**Handling:**
- **Auto-Merge Candidate:** High confidence, but typically requires a "lazy" confirmation.
- **Action:** If User submits exact text of an existing idea, the system flags it: *"You already have this idea. Link to existing?"*
- **Merge:** If confirmed, the new instance is discarded, and any new context is linked to the OLD idea ID. Usage counters on the old idea are incremented.

---

## 2. Semantic Duplicates

**Definition:** Different wording, identical meaning.
- Idea A: "The sun is hot."
- Idea B: "Measurements show the sun has high temperature."

**Handling:**
- **Detector:** Similarity search or overlap heuristic.
- **Action:** Suggest **DUPLICATES** link type.
- **User Choice:**
    1.  **Merge:** Choose one "Cluster Head" (primary phrasing). The other becomes an alias or is effectively deleted (archived).
    2.  **Link:** Create a `DUPLICATES` (Equivalence) link. Both kept available but treated as synonyms.
    3.  **Separate:** User declares they are different. System records rejection.

---

## 3. Partial Overlap / Refinement

**Definition:** Ideas share significant content but one is more specific or accurate.

**Handling:**
- **Action:** Suggest **REFINES** link.
- **Flow:**
    > "Idea B seems to be a more detailed version of Idea A."
    > [Mark B as Refinement of A]

---

## Merge Mechanics

### Provenance Preservation
When Idea A and Idea B are merged into Idea A:
1.  **Content:** Idea A's text is kept.
2.  **History:** Idea B's creation date and source ID are appended to Idea A's metadata (e.g., `merged_from: [id_B]`).
3.  **Edges:** All edges connected to Idea B are re-mapped to Idea A.
4.  **Reversibility:** Merges should ideally be non-destructive (soft delete B) to allow "Undo" in the immediate session. Permanent deletion happens on explicit cleanup.

---

> **Principle:** A clean graph is better than a large graph. Aggressively suggest merges, but never force them.
