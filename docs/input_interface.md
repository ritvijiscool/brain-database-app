# Input Interface

This document defines the user input interface design and behavior.

---

## Chat Box

### Design Principles

- **Text-first** — No unnecessary graphics or visual clutter
- **Minimal design** — Focus on content, not decoration
- **Offline operation** — Works without network connectivity

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                                                       │  │
│  │  Type or paste information.                           │  │
│  │  It will not be stored until processed.               │  │
│  │                                                       │  │
│  │                                                       │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│                                         [ Submit ]          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Features

### Text Input

| Feature | Specification |
|---------|---------------|
| Input type | Multi-line text area |
| Placeholder | "Type or paste information..." |
| Max length | 10,000 characters |
| Line breaks | Supported |
| Paste | Multi-line pasting allowed |

### Submit Button

| Behavior | Description |
|----------|-------------|
| Click action | Captures "raw input" |
| Keyboard shortcut | `Cmd/Ctrl + Enter` |
| Disabled when | Input is empty |
| After submit | Clear input, show confirmation |

---

## User Guidance

Display helpful text to guide user:

```
"Type or paste information. It will not be stored until processed."
```

**Additional guidance (on hover or info icon):**
- "Your input is saved temporarily for processing"
- "Ideas are extracted and stored after review"
- "All data stays on your device"

---

## Multi-Line Support

| Scenario | Handling |
|----------|----------|
| Short text | Single line display |
| Long text | Text area expands (max 10 lines visible) |
| Paste | Preserve line breaks and formatting |
| Scrolling | Enabled for content exceeding visible area |

---

## Offline Guarantee

```
┌─────────────────┐
│   User Input    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Local Capture   │ ◀── No network required
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ raw_input.json  │
└─────────────────┘
```

- No server requests on submit
- Immediate local storage
- Works in airplane mode
- No loading spinners for network

---

## Accessibility

| Feature | Implementation |
|---------|----------------|
| Focus indicator | Clear visual outline |
| Label | Associated `<label>` element |
| ARIA | `aria-label="Enter information"` |
| Keyboard | Full keyboard navigation |

---

> **Principle:** Input should feel instant and private. No waiting, no network indicators.
