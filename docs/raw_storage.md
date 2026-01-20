# Raw Storage System

This document defines how raw user input is temporarily stored before processing.

---

## Temporary Storage

All user input is saved as a temporary object before chunking:

### File: `raw_input.json`

```json
{
  "inputs": [
    {
      "id": "raw_001",
      "text": "User's raw input text...",
      "timestamp": "2026-01-20T16:30:00Z",
      "processed": false
    }
  ]
}
```

---

## Field Definitions

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier for the raw input |
| `text` | string | The raw user input text |
| `timestamp` | ISO 8601 | When the input was submitted |
| `processed` | boolean | `false` until chunking completes |

---

## Storage Rules

### Temporary Nature

- Raw inputs are **not** permanent storage
- They exist only until idea chunking completes
- Once processed, raw input can be deleted or archived

### No Permanent Storage Until Chunking

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  User Submit    │────▶│  raw_input.json │────▶│  Chunking       │
│                 │     │  (temporary)    │     │  Engine         │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
                                                         ▼
                                                ┌─────────────────┐
                                                │  ideas.json     │
                                                │  (permanent)    │
                                                └─────────────────┘
```

---

## Concurrent Submissions

Handle multiple submissions without data loss:

### Strategy

```json
{
  "inputs": [
    { "id": "raw_001", "text": "First input...", "processed": false },
    { "id": "raw_002", "text": "Second input...", "processed": false },
    { "id": "raw_003", "text": "Third input...", "processed": false }
  ]
}
```

### Rules

| Rule | Implementation |
|------|----------------|
| Unique IDs | UUID or timestamp-based |
| Order preserved | Append to array |
| Atomic writes | Write-temp-rename pattern |
| No overwrites | New submissions append, never replace |

---

## Logging

Provide clear logging for debugging:

### Log Events

| Event | Log Level | Message |
|-------|-----------|---------|
| Input received | INFO | `[RAW] Input received: {id}` |
| Write success | DEBUG | `[RAW] Saved to raw_input.json: {id}` |
| Write failure | ERROR | `[RAW] Failed to save: {id}, error: {msg}` |
| Processing start | INFO | `[RAW] Processing started: {id}` |
| Processing complete | INFO | `[RAW] Processing complete: {id}` |

### Log Format

```
2026-01-20T16:30:00Z [INFO] [RAW] Input received: raw_001
2026-01-20T16:30:01Z [DEBUG] [RAW] Saved to raw_input.json: raw_001
2026-01-20T16:30:02Z [INFO] [RAW] Processing started: raw_001
2026-01-20T16:30:05Z [INFO] [RAW] Processing complete: raw_001
```

---

## Cleanup

| Scenario | Action |
|----------|--------|
| Processing complete | Mark `processed: true`, optionally delete |
| App restart | Check for unprocessed inputs, resume processing |
| User cancellation | Remove raw input, no permanent storage |

---

> **Principle:** Raw inputs are transient. Nothing is permanent until the user approves the chunked ideas.
