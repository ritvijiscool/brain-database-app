# Chunk Review Flow

This document describes how users review and finalize extracted ideas.

---

## Core Principle

> **The user is the final authority.** No idea is stored permanently without user confirmation.

---

## Review Interface

After chunking, ideas are presented for review:

```
┌─────────────────────────────────────────────────────────────────┐
│                      REVIEW EXTRACTED IDEAS                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Original input:                                                │
│  "Water boils at 100°C. This happens because heat provides     │
│   energy for molecules to escape."                              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Extracted ideas:                                               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 1. "Water boils at 100°C."                              │   │
│  │    Type: [fact ▼]                                       │   │
│  │    [ Edit ] [ Split ] [ Delete ]                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 2. "Heat provides energy for molecules to escape."      │   │
│  │    Type: [cause ▼]                                      │   │
│  │    [ Edit ] [ Split ] [ Delete ]                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [ Merge Selected ]                                             │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│           [ Cancel ]              [ Confirm All ]               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Allowed Actions

### Edit

Modify the idea text directly.

| Action | Result |
|--------|--------|
| Change wording | Updated `idea_text` |
| Fix typos | Updated `idea_text` |
| Clarify meaning | Updated `idea_text` |

### Split

Divide one idea into multiple ideas.

| Before | After |
|--------|-------|
| "A and B" | "A" + "B" |

### Merge

Combine two or more ideas into one.

| Before | After |
|--------|-------|
| "A" + "B" | "A and B" |

### Relabel

Change the idea type.

| Before | After |
|--------|-------|
| Type: fact | Type: definition |

### Delete

Remove an idea entirely.

| Before | After |
|--------|-------|
| Idea exists | Idea discarded |

---

## Action Summary

| Action | Button | Result |
|--------|--------|--------|
| Edit | `[ Edit ]` | Inline text editing |
| Split | `[ Split ]` | Create new idea, reduce original |
| Merge | `[ Merge Selected ]` | Combine checked ideas |
| Relabel | Type dropdown | Change classification |
| Delete | `[ Delete ]` | Remove from list |

---

## Confirmation Step

**Nothing is saved until the user confirms.**

### Flow

```
┌─────────────────┐
│ Chunking Done   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Review Screen   │ ◀── User edits, splits, merges, deletes
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ User Confirms?  │──No─▶│ Discard Changes │
└────────┬────────┘     └─────────────────┘
         │ Yes
         ▼
┌─────────────────┐
│ Ideas Saved     │
│ to ideas.json   │
└─────────────────┘
```

### Confirmation Dialog

```
┌─────────────────────────────────────────┐
│  Save 2 ideas?                          │
│                                         │
│  This will add them to your knowledge   │
│  base. You can edit them later.         │
│                                         │
│       [ Cancel ]    [ Save ]            │
└─────────────────────────────────────────┘
```

---

## Cancel Behavior

| Action | Result |
|--------|--------|
| Cancel during review | All extracted ideas discarded |
| Raw input status | Remains `processed: false` |
| User can retry | Re-process same input later |

---

## Post-Confirmation

After user confirms:

1. Ideas saved to `ideas.json`
2. Raw input marked `processed: true`
3. Review screen closes
4. User returns to main interface

---

> **Principle:** The system suggests; the user decides. Every idea in storage has been explicitly approved.
