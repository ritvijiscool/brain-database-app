# Input Validation Rules

This document defines validation rules for user input.

---

## Validation Checks

### 1. Length Limit

| Rule | Value |
|------|-------|
| Maximum characters | 10,000 |
| Minimum characters | 1 (non-empty) |

**Rejection message:**
```
"Input exceeds maximum length of 10,000 characters. 
Please submit smaller portions."
```

---

### 2. Empty Submission Rejection

| Condition | Action |
|-----------|--------|
| Empty string | Reject |
| Whitespace only | Reject |
| Null/undefined | Reject |

**Rejection message:**
```
"Please enter some text before submitting."
```

---

### 3. Text Sanitization

Sanitize text for safe offline processing:

| Character Type | Action |
|----------------|--------|
| Control characters (U+0000–U+001F) | Strip |
| Null bytes | Strip |
| Bell, backspace, form feed | Strip |
| Newlines (`\n`, `\r`) | Preserve |
| Tabs (`\t`) | Preserve |
| Unicode text | Preserve |
| Emoji | Preserve |

**Sanitization regex:**
```javascript
text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
```

---

## Validation Flow

```
┌─────────────────┐
│   Raw Input     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Check Empty     │──▶  │ Reject + Notify │
└────────┬────────┘     └─────────────────┘
         │ ✓
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Check Length    │──▶  │ Reject + Notify │
└────────┬────────┘     └─────────────────┘
         │ ✓
         ▼
┌─────────────────┐
│ Sanitize Text   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Valid Input     │
└─────────────────┘
```

---

## User Feedback

Provide clear feedback for invalid input:

| Scenario | Feedback Type | Message |
|----------|---------------|---------|
| Empty | Inline warning | "Please enter some text" |
| Too long | Inline warning + counter | "10,234 / 10,000 characters (exceeded)" |
| Sanitized | Silent | No notification (automatic cleanup) |
| Valid | Confirmation | "Input received" |

### Visual Indicators

```
┌───────────────────────────────────────────────────────────┐
│                                                           │
│  [Input text area]                                        │
│                                                           │
├───────────────────────────────────────────────────────────┤
│  ⚠️ Input exceeds 10,000 characters                       │  ← Error state
│  Characters: 10,234 / 10,000                              │
└───────────────────────────────────────────────────────────┘
```

---

## Local Logging

Log validation status locally for debugging:

| Event | Log Level | Message |
|-------|-----------|---------|
| Validation pass | DEBUG | `[VALIDATE] Input valid: {length} chars` |
| Empty rejection | WARN | `[VALIDATE] Rejected: empty input` |
| Length rejection | WARN | `[VALIDATE] Rejected: {length} chars exceeds limit` |
| Sanitization | DEBUG | `[VALIDATE] Sanitized {count} control characters` |

### Log Format

```
2026-01-20T16:30:00Z [DEBUG] [VALIDATE] Input valid: 523 chars
2026-01-20T16:30:01Z [WARN] [VALIDATE] Rejected: empty input
2026-01-20T16:30:02Z [DEBUG] [VALIDATE] Sanitized 2 control characters
```

---

> **Principle:** Validation is silent when possible, informative when necessary.
