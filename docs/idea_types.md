# Idea Types

This document defines the allowed atomic idea types in brain-database-app.

---

## Allowed Types (v1)

> **No other types are allowed in v1.** All ideas must be classified into one of the following six types.

---

### 1. Fact

**Description:** A verifiable piece of information that can be confirmed as true or false.

| Rule | Criteria |
|------|----------|
| **Include** | Objective statements, data points, historical events, measurements |
| **Exclude** | Opinions, predictions, interpretations |

**Example:**
> "Water boils at 100°C at sea level."

---

### 2. Definition

**Description:** An explanation of what something is or means.

| Rule | Criteria |
|------|----------|
| **Include** | Meanings of terms, concepts, or categories |
| **Exclude** | Descriptions of how things work (use Procedure), examples (use Example) |

**Example:**
> "Entropy is a measure of disorder in a system."

---

### 3. Cause/Effect

**Description:** An explanation of why something happens or what results from an action.

| Rule | Criteria |
|------|----------|
| **Include** | Causal relationships, consequences, mechanisms |
| **Exclude** | Mere correlations without causation, facts without explanation |

**Example:**
> "Ice floats because water expands when it freezes."

---

### 4. Example

**Description:** A specific instance that illustrates a concept or principle.

| Rule | Criteria |
|------|----------|
| **Include** | Concrete illustrations, case studies, demonstrations |
| **Exclude** | General statements, abstract concepts |

**Example:**
> "An apple falling from a tree is an example of gravity."

---

### 5. Procedure

**Description:** A sequence of steps to accomplish a task.

| Rule | Criteria |
|------|----------|
| **Include** | Instructions, methods, algorithms, processes |
| **Exclude** | Single actions (use Fact), explanations of why (use Cause/Effect) |

**Example:**
> "To make coffee: grind beans, add hot water, filter, and serve."

---

### 6. Question

**Description:** An open inquiry or topic for further exploration.

| Rule | Criteria |
|------|----------|
| **Include** | Unanswered questions, research topics, curiosities |
| **Exclude** | Rhetorical questions, statements disguised as questions |

**Example:**
> "How does memory consolidation during sleep work?"

---

## Type Reference Table

| Type | Key Signal | Example Prefix |
|------|------------|----------------|
| Fact | "X is Y", data | "The population is..." |
| Definition | "X means", "X is a" | "A neuron is..." |
| Cause/Effect | "because", "causes", "leads to" | "This happens because..." |
| Example | "for example", "such as" | "An example is..." |
| Procedure | "to do X", "steps", "first...then" | "To achieve X..." |
| Question | "?", "how", "why", "what if" | "How does...?" |

---

> **v1 Constraint:** Only these six types are supported. Future versions may expand this list based on user feedback.
