# Chunking Failure Modes

This document describes common chunking failures and how to handle them safely.

---

## Overview

Chunking can fail in three primary ways:

| Failure Mode | Description |
|--------------|-------------|
| Under-chunking | Too few chunks; ideas remain combined |
| Over-chunking | Too many chunks; ideas are fragmented |
| Ambiguity | Unclear how to classify or split |

---

## 1. Under-Chunking

### Description

The system produces fewer chunks than expected, leaving compound ideas unsplit.

### Detection Signals

| Signal | Threshold |
|--------|-----------|
| Chunk length | > 30 words |
| Multiple conjunctions | "and", "but", "also" appearing multiple times |
| Mixed types | Single chunk contains fact + cause + example |

### User-Facing Response

```
┌─────────────────────────────────────────────────────────────┐
│  ℹ️ This idea may contain multiple concepts.                │
│                                                             │
│  "Water boils at 100°C and ice melts at 0°C because of     │
│   molecular energy changes."                                │
│                                                             │
│  Would you like to split it?                                │
│                                                             │
│       [ Keep as-is ]       [ Split ]                        │
└─────────────────────────────────────────────────────────────┘
```

### Safe Fallback

- Keep the chunk intact
- Flag for user review
- Let user manually split if desired

---

## 2. Over-Chunking

### Description

The system produces too many chunks, fragmenting coherent ideas into meaningless pieces.

### Detection Signals

| Signal | Threshold |
|--------|-----------|
| Chunk length | < 5 words |
| Incomplete sentence | Missing subject or verb |
| Fragment phrases | "because of", "for example", "in order to" alone |

### User-Facing Response

```
┌─────────────────────────────────────────────────────────────┐
│  ⚠️ Some ideas may be incomplete.                           │
│                                                             │
│  Fragment detected: "because of molecular energy"           │
│                                                             │
│  This might belong with another idea.                       │
│                                                             │
│       [ Merge with previous ]    [ Keep separate ]          │
└─────────────────────────────────────────────────────────────┘
```

### Safe Fallback

- Present fragments with adjacent context
- Suggest merge with nearest chunk
- User decides final grouping

---

## 3. Ambiguity

### Description

The system cannot confidently classify the idea type or determine splitting boundaries.

### Detection Signals

| Signal | Example |
|--------|---------|
| Low confidence score | Type classification < 60% |
| Multiple valid types | Could be fact or definition |
| Unclear boundaries | "X because Y but also Z" |

### User-Facing Response

```
┌─────────────────────────────────────────────────────────────┐
│  ❓ Classification uncertain                                 │
│                                                             │
│  "A catalyst speeds up reactions without being consumed."   │
│                                                             │
│  Could be: definition (70%) or fact (65%)                   │
│                                                             │
│  Please select:                                             │
│       [ Definition ]    [ Fact ]    [ Other... ]            │
└─────────────────────────────────────────────────────────────┘
```

### Safe Fallback

- Present top 2–3 type options
- Default to most likely type
- User can override

---

## Failure Response Summary

| Failure | Detection | Response | Fallback |
|---------|-----------|----------|----------|
| Under-chunking | >30 words, multiple conjunctions | Suggest split | Keep intact |
| Over-chunking | <5 words, fragments | Suggest merge | Keep with context |
| Ambiguity | Low confidence, multiple types | Ask user | Use top prediction |

---

## Logging

All failures are logged for debugging:

| Event | Log Level | Message |
|-------|-----------|---------|
| Under-chunk detected | WARN | `[CHUNK] Under-chunk: {id}, length: {words}` |
| Over-chunk detected | WARN | `[CHUNK] Over-chunk: {id}, length: {words}` |
| Ambiguity detected | INFO | `[CHUNK] Ambiguous type: {id}, options: {types}` |
| User resolution | INFO | `[CHUNK] User resolved: {id}, action: {action}` |

---

## Recovery Flow

```
┌─────────────────┐
│ Chunking Engine │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Validate Output │
└────────┬────────┘
         │
    ┌────┴────┬────────────┐
    ▼         ▼            ▼
┌───────┐ ┌───────┐ ┌───────────┐
│ Valid │ │ Warn  │ │ Ambiguous │
└───┬───┘ └───┬───┘ └─────┬─────┘
    │         │           │
    ▼         ▼           ▼
┌───────┐ ┌───────────┐ ┌─────────────┐
│ Save  │ │ Flag for  │ │ Ask User    │
│       │ │ Review    │ │ to Clarify  │
└───────┘ └───────────┘ └─────────────┘
```

---

> **Principle:** When chunking fails, fail gracefully. The user always has the final word.
