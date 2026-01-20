# Profile Storage Rules

This document defines how user profile data is stored, written, and backed up.

---

## Storage Location

- **File:** `user_profile.json`
- **Location:** Local application data directory
- **No cloud storage** — All data remains on user's device
- **No account required** — Works immediately without registration

---

## File Format

| Property | Specification |
|----------|---------------|
| Format | JSON |
| Encoding | UTF-8 |
| Readability | Human-readable, pretty-printed |
| Indentation | 2 spaces |

**Rationale:** JSON is chosen for:
- Easy debugging and inspection
- Cross-platform compatibility
- Simple parsing without dependencies
- User can manually edit if needed

---

## Atomic Updates

All writes must be **atomic** to prevent data corruption:

### Write Strategy

```
1. Write to temporary file: user_profile.tmp
2. Validate JSON integrity
3. Rename temp file to user_profile.json (atomic operation)
4. Delete old backup if rename succeeds
```

### Implementation

```
┌─────────────────┐
│  Update Data    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Write to .tmp   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Validate JSON   │──▶  │ Abort on Error  │
└────────┬────────┘     └─────────────────┘
         │ ✓
         ▼
┌─────────────────┐
│ Atomic Rename   │
│ .tmp → .json    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Update Complete │
└─────────────────┘
```

### Failure Recovery

| Scenario | Recovery |
|----------|----------|
| Crash during write | `.tmp` file ignored on restart; original `.json` intact |
| Corrupt `.json` | Restore from latest versioned snapshot |
| Missing file | Initialize with default profile values |

---

## Versioned Backups

### Snapshot Schedule

| Trigger | Action |
|---------|--------|
| Every 10 updates | Create snapshot |
| Daily (if active) | Create snapshot |
| Before major changes | Create snapshot |

### Backup Structure

```
/data/
├── user_profile.json           ← Current
└── /backups/
    ├── user_profile.2026-01-20T15-00-00.json
    ├── user_profile.2026-01-19T12-30-00.json
    └── user_profile.2026-01-18T09-00-00.json
```

### Retention Policy

| Rule | Value |
|------|-------|
| Max backups | 30 |
| Oldest deleted | When limit exceeded |
| User export | All backups available |

---

## Recovery Options

| Action | Method |
|--------|--------|
| View backups | List available snapshots |
| Restore backup | Replace current with selected snapshot |
| Export profile | Download as JSON file |
| Reset profile | Delete and reinitialize with defaults |

---

## v1 Constraints

| Feature | Status |
|---------|--------|
| Local storage | ✅ Supported |
| Cloud sync | ❌ Not in v1 |
| Account binding | ❌ Not in v1 |
| Cross-device sync | ❌ Not in v1 |
| Encryption | ⚠️ Optional (future) |

---

> **Principle:** User data never leaves the device without explicit export action.
