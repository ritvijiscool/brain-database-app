# Application Checks

This document defines how the system prompts users to **apply** their knowledge, moving beyond rote recall.

---

## Concept

**Application** > **Recall**. Knowing *that* something is true is less valuable than knowing *how* to use it.

---

## Prompt Types

### 1. Hypothetical Scenarios
**Prompt:** "How would [Idea X] apply if [Situation Y] happened?"
**Goal:** Transfer knowledge to new context.

### 2. Synthesis Prompts
**Prompt:** "How does [Idea X] support or contradict [Idea Y]?"
**Goal:** Build connections.

### 3. Real-World Action
**Prompt:** "Can you spot an example of [Idea X] in your day today?"
**Goal:** Observation.

---

## Recording Results

The user self-reports the outcome:

| User Response | System Record |
|---------------|---------------|
| "I did it" | Application Success |
| "I couldn't" | Application Failure (Trigger Reframing) |
| "Not relevant" | Skip |

---

## Constraints

- **No Grading:** The system cannot verify if the user's application was "correct" in the real world. It trusts the user's report.
- **Lightweight:** These prompts are rare (e.g., <10% of interactions) to avoid cognitive burden.

---

> **Principle:** Knowledge is for use, not just for storage.
