# Default Behaviors

This document defines the **locked default behaviors** for brain-database-app. All future modules must reference and adhere to these specifications.

---

## Recall

### Trigger Mode
- **Explicit questions only** — Recall is never automatic or background-triggered.
- User must initiate each recall session.

### Level-Based Progression

Recall follows a structured difficulty progression:

| Level | Name | Description |
|-------|------|-------------|
| 1 | **Recognition** | User identifies if they've seen the idea before |
| 2 | **Reconstruction** | User retrieves the idea from memory |
| 3 | **Application** | User applies the idea in a new context |

### Failure Handling

- **No penalties** — Failed or partial recall does not negatively impact scores or access.
- **Scaffolded hints** — On failure, the system provides progressive hints:
  1. Contextual cue (related topic)
  2. Partial reveal (first few words)
  3. Full reveal with explanation
- Encourages learning over punishment.

---

## Compression

### AI Role
- **AI suggests only** — The AI proposes abstractions, summaries, or groupings.
- AI never acts autonomously on user data.

### User Approval Required
- **Every abstraction requires explicit user approval.**
- User can:
  - Approve as-is
  - Edit before approving
  - Dismiss entirely

### Data Integrity
- **No automatic deletion** — Ideas are never removed without user action.
- **No automatic merging** — Similar ideas remain separate unless user approves compression.

---

## Chunking

### Atomic Ideas
- Maximum length: **~20 words** per atomic idea.
- Each idea should represent a single, self-contained concept.

### Idea Types

| Type | Description | Example |
|------|-------------|---------|
| `fact` | A verifiable piece of information | "Water boils at 100°C at sea level" |
| `definition` | Explains what something is | "Entropy is a measure of disorder" |
| `cause` | Explains why something happens | "Ice floats because water expands when frozen" |
| `example` | Illustrates a concept | "An apple falling is an example of gravity" |

---

## Graph Storage

### Storage Mode
- **Local only** — All data stored on user's device.
- **Offline-capable** — No network required for any operation.
- **No backend** — Zero server dependencies.

### Node Metadata

Each idea node stores:

| Field | Type | Description |
|-------|------|-------------|
| `confidence` | float | User's confidence in this idea (0.0–1.0) |
| `last_used` | timestamp | When the idea was last recalled or referenced |
| `usage_count` | integer | Total number of times the idea has been used |
| `abstraction_level` | integer | Depth of abstraction (0 = raw, higher = more abstract) |

### Edge Metadata

Each relationship edge stores:

| Field | Type | Description |
|-------|------|-------------|
| `relation_type` | string | Type of relationship (e.g., "supports", "contradicts", "example_of") |
| `weight` | float | Strength of the connection (0.0–1.0) |
| `contradiction_flag` | boolean | True if this edge represents a contradiction |

---

## Reference

> **All modules must import and respect these defaults.**
> 
> Any deviation from these behaviors requires explicit user consent and must be documented as a configuration override, not a silent change.
