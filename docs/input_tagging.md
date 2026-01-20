# Input Tagging

This document defines how raw inputs are tagged for processing status.

---

## Tagging Strategy

### Initial State

All raw inputs receive initial tag:

```json
{
  "id": "raw_001",
  "text": "User input...",
  "timestamp": "2026-01-20T16:30:00Z",
  "processed": false
}
```

| Field | Initial Value | Description |
|-------|---------------|-------------|
| `processed` | `false` | Not yet chunked into ideas |

---

## State Transitions

### Processing Lifecycle

```
┌─────────────────┐
│  User Submit    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ processed:false │ ◀── Raw input saved
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Chunking Engine │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ processed:true  │ ◀── Ideas extracted
└─────────────────┘
```

### Tag Update

After chunking completes successfully:

```json
{
  "id": "raw_001",
  "text": "User input...",
  "timestamp": "2026-01-20T16:30:00Z",
  "processed": true,
  "processed_at": "2026-01-20T16:30:05Z",
  "idea_ids": ["idea_001", "idea_002"]
}
```

---

## Storage Separation

Keep unprocessed and processed items separate:

### File Structure

```
/data/
├── raw_input.json          ← Unprocessed items (processed: false)
├── processed_input.json    ← Completed items (processed: true)
└── ideas.json              ← Extracted ideas
```

### Separation Rules

| Status | Location |
|--------|----------|
| `processed: false` | `raw_input.json` |
| `processed: true` | Move to `processed_input.json` |

---

## Atomic Updates

Prevent partial tagging with atomic operations:

### Update Sequence

```
1. Begin transaction
2. Update processed flag in raw_input.json
3. Move entry to processed_input.json
4. Commit transaction (atomic rename)
5. If failure at any step, rollback to original state
```

### Implementation

```
┌─────────────────┐
│ Chunking Done   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Write temp file │
│ with processed  │
│ = true          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Validate JSON   │──▶  │ Rollback        │
└────────┬────────┘     └─────────────────┘
         │ ✓
         ▼
┌─────────────────┐
│ Atomic rename   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Tag complete    │
└─────────────────┘
```

---

## Failure Handling

| Scenario | Recovery |
|----------|----------|
| Crash during tagging | Item remains `processed: false`, retry on restart |
| Partial write | Temp file discarded, original intact |
| Chunking failure | Item stays unprocessed, error logged |

---

## Querying by Status

### Unprocessed Items

```javascript
const unprocessed = inputs.filter(i => i.processed === false);
```

### Processed Items

```javascript
const processed = inputs.filter(i => i.processed === true);
```

---

## Logging

| Event | Log Level | Message |
|-------|-----------|---------|
| Tag created | DEBUG | `[TAG] Created: {id}, processed: false` |
| Tag updated | INFO | `[TAG] Updated: {id}, processed: true` |
| Tag failure | ERROR | `[TAG] Failed to update: {id}` |
| Rollback | WARN | `[TAG] Rollback: {id}` |

---

> **Principle:** No data is lost between states. Tagging is all-or-nothing.
