# Chunking Rules

This document defines how raw input is split into atomic ideas.

---

## Core Principle

> **Consistency over cleverness.** Predictable, repeatable chunking is more valuable than sophisticated but unpredictable splitting.

---

## What Qualifies as a Single Atomic Idea

An atomic idea is:
- **One concept** — A single, self-contained piece of information
- **Independently meaningful** — Makes sense without surrounding context
- **Approximately 5–20 words** — Long enough to be useful, short enough to recall
- **One type** — Clearly classifiable as fact, definition, cause, example, procedure, or question

---

## Splitting Compound Sentences

### Rule: Split on Logical Boundaries

| Pattern | Action |
|---------|--------|
| "X and Y" (different topics) | Split into two ideas |
| "X and Y" (same topic) | Keep as one idea |
| "X, which means Y" | Split: X is fact, Y is definition |
| "X because Y" | Split: X is fact, Y is cause/effect |
| "First X, then Y" | Keep together if procedure; split if unrelated |

### Examples

**Do Split:**
```
Input: "Water boils at 100°C and ice melts at 0°C."
→ Idea 1: "Water boils at 100°C." (fact)
→ Idea 2: "Ice melts at 0°C." (fact)
```

**Don't Split:**
```
Input: "Water boils at 100°C at sea level."
→ Keep as one idea (single fact with condition)
```

---

## Handling Lists

| List Type | Action |
|-----------|--------|
| Related items (same category) | Keep as one idea |
| Unrelated items | Split each item |
| Numbered steps | Keep together as procedure |

### Examples

**Keep Together:**
```
Input: "Primary colors are red, blue, and yellow."
→ One idea (fact about a category)
```

**Split:**
```
Input: "Today I learned about gravity, wrote a poem, and fixed my bike."
→ Three separate ideas (unrelated topics)
```

---

## Handling Analogies

| Pattern | Action |
|---------|--------|
| "X is like Y" | Keep as one idea (example or definition) |
| "X is like Y because Z" | Split: analogy + cause/effect |

### Example

```
Input: "The brain is like a computer."
→ One idea (example/analogy)

Input: "The brain is like a computer because both process information."
→ Idea 1: "The brain is like a computer." (example)
→ Idea 2: "Both brain and computer process information." (cause/effect)
```

---

## Handling Opinions

| Scenario | Action |
|----------|--------|
| Clear opinion | Mark as fact (user's perspective) |
| Opinion + reasoning | Split: opinion + cause/effect |
| Controversial claim | Keep; confidence set to low |

### Example

```
Input: "I think remote work improves productivity because it reduces commute stress."
→ Idea 1: "Remote work improves productivity." (fact/opinion)
→ Idea 2: "Reduced commute stress improves productivity." (cause/effect)
```

---

## Do / Don't

| ✅ Do | ❌ Don't |
|-------|----------|
| Split on clear logical boundaries | Split mid-sentence |
| Preserve original meaning | Add interpretation |
| Keep atomic (5–20 words) | Create fragments (<5 words) |
| Default to fewer chunks if unsure | Over-split aggressively |
| Maintain user's voice | Paraphrase heavily |

---

## Edge Cases

| Scenario | Resolution |
|----------|------------|
| Single word input | Keep as-is, mark for user review |
| Very long sentence | Split at conjunctions, semicolons |
| Ambiguous structure | Keep together, flag for user review |
| Multiple languages | Treat as single idea, preserve original |

---

> **When in doubt:** Keep the idea together and let the user split it during review.
