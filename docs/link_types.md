# Link Types

This document defines the allowed link types in brain-database-app.

---

## Allowed Types (v1)

> **No other link types are allowed in v1.** All connections between ideas must be classified into one of the following six types.

---

### 1. Supports

**Direction:** A → B (Idea A supports Idea B)

| Aspect | Definition |
|--------|------------|
| **Semantic Meaning** | Idea A provides evidence, reasoning, or justification for Idea B. If A is true, B is more likely to be true. |
| **Allowed When** | A is a premise, proof, data point, or necessary condition for B. |
| **Forbidden When** | A is merely related to B without logical support. |

**Example:**
> "The ground is wet" (A) **SUPPORTS** "It rained recently" (B).

---

### 2. Depends On

**Direction:** A → B (Idea A depends on Idea B)

| Aspect | Definition |
|--------|------------|
| **Semantic Meaning** | Idea A requires Idea B to be true or to exist. If B fails, A fails or becomes invalid. |
| **Allowed When** | A is a conclusion, effect, or downstream concept of B. |
| **Forbidden When** | The relationship is merely sequential (A happens after B) without dependency. |

**Example:**
> "Engine operations" (A) **DEPENDS ON** "Availability of fuel" (B).

---

### 3. Is An Example Of

**Direction:** A → B (Idea A is an example of Idea B)

| Aspect | Definition |
|--------|------------|
| **Semantic Meaning** | Idea A is a specific instance or subclass of the general concept Idea B. |
| **Allowed When** | A is concrete/specific and B is abstract/general. |
| **Forbidden When** | A and B are peers (both examples of a third concept). |

**Example:**
> "Golden Retriever" (A) **IS AN EXAMPLE OF** "Dog" (B).

---

### 4. Contradicts

**Direction:** A ↔ B (Bidirectional / Mutual)

| Aspect | Definition |
|--------|------------|
| **Semantic Meaning** | Idea A and Idea B cannot both be true in the same context. They assert conflicting information. |
| **Allowed When** | Direct logical or factual conflict exists. |
| **Forbidden When** | Ideas are merely different perspectives or orthogonal (unrelated). |

**Example:**
> "The door is open" (A) **CONTRADICTS** "The door is closed" (B).

---

### 5. Refines

**Direction:** A → B (Idea A refines Idea B)

| Aspect | Definition |
|--------|------------|
| **Semantic Meaning** | Idea A adds detail, clarity, or precision to Idea B without changing its core truth. A is a "better" version of B. |
| **Allowed When** | A adds constraints, specificity, or updated data to B. |
| **Forbidden When** | A changes the fundamental meaning or topic of B. |

**Example:**
> "Water boils at 100°C at 1 atm" (A) **REFINES** "Water boils at 100°C" (B).

---

### 6. Duplicates

**Direction:** A ↔ B (Bidirectional / Equivalence)

| Aspect | Definition |
|--------|------------|
| **Semantic Meaning** | Idea A and Idea B represent the exact same semantic concept, even if worded differently. |
| **Allowed When** | The intended meaning is identical. |
| **Forbidden When** | There is any subtle nuance or difference in scope (use Refines instead). |

**Example:**
> "H2O" (A) **DUPLICATES** "Water molecule" (B).

---

## Technical Representation

Links are stored as weighted edges in the `edge.json` format:

```json
{
  "from_id": "idea_123",
  "to_id": "idea_456",
  "relation_type": "supports",
  "weight": 1.0,
  "contradiction_flag": false
}
```

- For bidirectional types (Contradicts, Duplicates), two edges are typically created (A→B and B→A) or treated as undirected by the graph engine.
