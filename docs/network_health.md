# Network Health

This document defines health checks for the knowledge graph.

---

## Overview

A "Healthy" network is connected, consistent, and cleanly structured. "Unhealthy" networks have islands, loops, or conflicts.

Key Checks run periodically or on-demand:

---

## 1. Orphan Detection

**Definition:** Ideas with **0 edges** (no incoming or outgoing links).
**Status:** Warning.
**User Action:**
- Link to existing topic.
- Delete (if irrelevant).
- Mark as "Inbox/Pending" (intentional orphan).

---

## 2. Overlinking (The "Hairball")

**Definition:** Ideas with an excessive number of edges (e.g., >20).
**Status:** Warning.
**Reason:** Usually indicates a generic concept (e.g., "The") or duplicated concept.
**User Action:**
- Refine idea (make it more specific).
- Break into sub-concepts.

---

## 3. Circular Dependencies

**Definition:** A chain of `DEPENDS_ON` or `SUPPORTS` links that loops back to itself.
- A supports B → B supports C → C supports A.
**Status:** Logical Error.
**User Action:**
- Break the loop (change one link type or direction).
- Accept (if it represents a true feedback loop system).

---

## 4. Unresolved Contradictions

**Definition:** `CONTRADICTS` edges that have aged without resolution.
**Status:** Review Prompt.
**User Action:**
- Prompt user to "Resolve old conflicts".

---

## Health Dashboard (v1 Implementation)

In v1, "Health" is not a background daemon. It is a **Report** the user can run.

`[ Check Database Health ]`

**Output:**
- "37 Orphaned Ideas found."
- "1 Circular Logic detected."
- "2 Unresolved Conflicts."

(Clicking items takes user to a list view to fix them.)
