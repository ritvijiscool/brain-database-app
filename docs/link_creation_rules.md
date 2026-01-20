# Link Creation Rules

This document defines how links between ideas are suggested, confirmed, and created.

---

## Core Principle

> **No silent linking.** All connections must be explicitly confirmed by the user. The system suggests; the user decides.

---

## Trigger Mechanisms

Link suggestions are triggered during:

1.  **New Idea Entry:** When a new idea is chunked, the system scans existing ideas for potential relationships.
2.  **Explicit Search:** When the user searches or browses, the system highlights potential connections.
3.  **Review Session:** During idea review, the system may flag relations between the new ideas and the existing graph.

---

## Suggestion Presentation

Every link suggestion must explain **why** it is being suggested.

### Format
> "Idea A might be related to Idea B because [Reason]."

### Examples

- **Keyword Overlap:** "Both ideas mention 'Photosynthesis'."
- **Semantic Similarity:** "These ideas seem to describe similar concepts."
- **Structural Pattern:** "Idea A looks like an example of Idea B."

---

## User Flow

### 1. Suggestion
User provides input. System detects potential link.
```
[Link Suggestion]
From: "The sky is blue."
To:   "Light scattering causes blue sky."
Rel:  SUPPORTS?
```

### 2. Decision
User has three options:

1.  **Confirm:** Accepts the link and its type.
    - Action: Edge created in `edges.json`.
    - Feedback: "Link created."

2.  **Reject:** Denies the link.
    - Action: No edge created. "Rejection" recorded to prevent re-suggestion.
    - Feedback: "Link dismissed."

3.  **Modify:** Accepts link but changes type.
    - Action: User selects correct type from dropdown (e.g., Change "Supports" to "Refines"). Edge created.

---

## Rejected Link Handling

When a user rejects a link:

1.  **Negative Edge:** Create a "negative" or "suppressed" edge in a separate `suppressed_links.json` (or strictly internal logic) to prevent future nagging.
2.  **Anti-Pattern Learning (Future):** In v2+, this data helps tune the suggestion engine. For v1, it just stops the immediate annoyance.

---

## Automation Rules

- **Strict Ban:** The system NEVER automatically creates a link in the background.
- **Batch Processing:** Link suggestions may be batched (e.g., "3 semantic duplicates detected"), but user must still click "Confirm" or "Review".

---

> **Summary:** The user manually stitches the knowledge graph together, authorized by their understanding of truth. The AI merely hands them the needle and thread.
