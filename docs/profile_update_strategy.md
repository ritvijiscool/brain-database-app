# Profile Update Strategy

This document defines when and how user profile data is updated during application use.

---

## Update Triggers

### On New Idea Submission

| Field | Update Action |
|-------|---------------|
| `known_topics` | Add new topics detected in the idea |
| `abstraction_preference` | Adjust based on idea complexity |
| `last_interaction` | Set to current timestamp |

**Logic:**
```
if idea contains new topic:
    known_topics.add(topic)

if idea.word_count < 10:
    abstraction_preference = min(abstraction_preference + 0.1, 5)
else if idea.word_count > 25:
    abstraction_preference = max(abstraction_preference - 0.1, 0)
```

---

### On Recall Attempt

| Field | Update Action |
|-------|---------------|
| `recall_success_rate` | Recalculate global success ratio |
| `usage_history[idea_id]` | Increment recall attempts/successes |
| `last_interaction` | Set to current timestamp |

**Logic:**
```
total_attempts += 1
if recall_successful:
    total_successes += 1
    usage_history[idea_id].recall_successes += 1

usage_history[idea_id].recall_attempts += 1
recall_success_rate = total_successes / total_attempts
```

---

### On Correction

| Field | Update Action |
|-------|---------------|
| `correction_frequency` | Recalculate modification ratio |
| `usage_history[idea_id]` | Increment modifications |
| `last_interaction` | Set to current timestamp |

**Corrections include:**
- Editing an existing idea
- Modifying AI-suggested compression
- Rejecting then re-entering content
- Changing idea type or metadata

**Logic:**
```
total_modifications += 1
correction_frequency = total_modifications / total_interactions
usage_history[idea_id].modifications += 1
```

---

## Timestamping

All updates include timestamps:

| Event | Timestamp Updated |
|-------|-------------------|
| First use | `first_interaction` (set once) |
| Any interaction | `last_interaction` |
| Idea access | `usage_history[idea_id].last_accessed` |
| Idea creation | `usage_history[idea_id].created_at` |

**Format:** ISO 8601 (`YYYY-MM-DDTHH:mm:ssZ`)

---

## Offline-Only Guarantee

- **All updates are local** — No network requests for profile updates.
- **No external data sharing** — Profile data never leaves the device.
- **No analytics or telemetry** — User behavior is not tracked externally.

```
┌─────────────────────────────────────────┐
│           User Interaction              │
└─────────────────┬───────────────────────┘
                  │
                  ▼
        ┌─────────────────┐
        │  Update Engine  │
        │  (Local Only)   │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ user_profile    │
        │ .json           │ ◀── Local Storage Only
        └─────────────────┘
                 │
                 ╳ ── No external sync
```

---

## Version History

Profile changes are versioned for recovery:

### Storage Structure

```
/data/
  user_profile.json          ← Current profile
  /profile_history/
    profile_v001.json        ← First version
    profile_v002.json        ← After updates
    profile_v003.json        ← Latest backup
    ...
```

### Versioning Rules

| Rule | Description |
|------|-------------|
| Snapshot frequency | After every 10 updates OR daily, whichever is first |
| Max versions kept | 30 (rolling window) |
| Recovery | User can restore any previous version |

### Version Metadata

```json
{
  "version": 3,
  "created_at": "2026-01-20T15:23:00Z",
  "updates_since_last": 10,
  "profile_data": { ... }
}
```

---

## Update Flow Summary

```
┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│  Idea Submit   │     │ Recall Attempt │     │  Correction    │
└───────┬────────┘     └───────┬────────┘     └───────┬────────┘
        │                      │                      │
        ▼                      ▼                      ▼
┌───────────────────────────────────────────────────────────────┐
│                      Profile Updater                          │
├───────────────────────────────────────────────────────────────┤
│  • Update relevant fields                                     │
│  • Timestamp all changes                                      │
│  • Check if snapshot needed                                   │
│  • Write to local storage                                     │
└───────────────────────────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────────────────────────────┐
│                   user_profile.json                           │
└───────────────────────────────────────────────────────────────┘
```

---

> **Data Sovereignty:** The user owns all profile data. No sync, no accounts, no external dependencies.
