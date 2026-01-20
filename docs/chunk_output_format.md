# Chunk Output Format

This document specifies the required fields for each atomic idea after chunking.

---

## Required Fields

Each chunked idea must contain the following fields:

```json
{
  "idea_id": "idea_001",
  "idea_text": "Water boils at 100°C at sea level.",
  "idea_type": "fact",
  "source_raw_input_id": "raw_001",
  "confidence": "unknown",
  "linked": false
}
```

---

## Field Definitions

| Field | Type | Description |
|-------|------|-------------|
| `idea_id` | string | Unique identifier for this idea |
| `idea_text` | string | The atomic idea content |
| `idea_type` | enum | One of: `fact`, `definition`, `cause`, `example`, `procedure`, `question` |
| `source_raw_input_id` | string | Reference to the original raw input |
| `confidence` | string | Default: `"unknown"` — updated after recalls |
| `linked` | boolean | Default: `false` — true when connected to other ideas |

---

## Field Details

### `idea_id`

- Format: `idea_` + unique identifier
- Generated: Automatically at chunking time
- Immutable: Never changes after creation

### `idea_text`

- Content: The extracted atomic idea
- Length: Typically 5–20 words
- Encoding: UTF-8

### `idea_type`

Allowed values:

| Value | Meaning |
|-------|---------|
| `fact` | Verifiable information |
| `definition` | What something means |
| `cause` | Why/how something happens |
| `example` | Specific illustration |
| `procedure` | Steps to accomplish something |
| `question` | Open inquiry |

### `source_raw_input_id`

- Purpose: Trace back to original user input
- Format: `raw_` + identifier
- Use: Debugging, auditing, context retrieval

### `confidence`

| Value | Meaning |
|-------|---------|
| `"unknown"` | Never recalled, no data |
| `"low"` | <50% recall success |
| `"medium"` | 50–80% recall success |
| `"high"` | >80% recall success |

**Note:** Confidence is updated only after recall attempts, not at chunking.

### `linked`

| Value | Meaning |
|-------|---------|
| `false` | Standalone idea, no edges |
| `true` | Connected to at least one other idea |

**Note:** Updated when edges are created, not at chunking.

---

## What Chunking Does NOT Do

> **Chunking is extraction, not evaluation.**

| Action | Chunking Responsibility |
|--------|------------------------|
| Assign `idea_id` | ✅ Yes |
| Extract `idea_text` | ✅ Yes |
| Classify `idea_type` | ✅ Yes |
| Link to source | ✅ Yes |
| Assess importance | ❌ No |
| Assign meaning | ❌ No |
| Determine confidence | ❌ No |
| Create edges/links | ❌ No |

---

## Example Output

### Input

```json
{
  "id": "raw_001",
  "text": "Water boils at 100°C. This is because heat provides energy for molecules to escape."
}
```

### Output

```json
[
  {
    "idea_id": "idea_001",
    "idea_text": "Water boils at 100°C.",
    "idea_type": "fact",
    "source_raw_input_id": "raw_001",
    "confidence": "unknown",
    "linked": false
  },
  {
    "idea_id": "idea_002",
    "idea_text": "Heat provides energy for water molecules to escape during boiling.",
    "idea_type": "cause",
    "source_raw_input_id": "raw_001",
    "confidence": "unknown",
    "linked": false
  }
]
```

---

> **Principle:** Chunking produces clean, neutral data. All value judgments come later.
