# Brain Database App (v1.4)

A local-first cognitive system for capturing, organizing, and synthesizing atomic ideas.

## Features

### Phase 0-3 (Core)
- **Input Capture**: Type or paste information securely.
- **Atomic Chunking**: Automatically splits text into "atomic ideas".
- **Local Storage**: Data stays on your machine (`localStorage`).

### Phase 4 (Linking & Graph)
- **Typed Links**: Connect ideas (Supports, Depends On, Example, Contradicts, Refines).
- **Graph Consistency**: Automatic deduplication checks and orphan detection.
- **Details View**: deep dive into specific ideas and their connections.

### Phase 5 (Recall & Memory)
- **Memory Strength**: Visual tracking of how well you know an idea (New → Deep Rooted).
- **Contextual Recall**: Non-intrusive prompts ("Do you remember...?") based on what you are working on.
- **Confidence**: Manually tag ideas as "High Confidence" or "Draft".

### Phase 6 (Retrieval & Context)
- **Contextual Search**: Results are ranked by keyword match AND graph connection.
- **Pins & Exclusions**: Manually control what appears in your search context.
- **Export**: Full JSON backup includes graph edges.

## Usage

1. **Launch**: Open `index.html`.
2. **Input**: Type information. Review and approve chunks.
3. **Link**: Go to "Search & Retrieve", click an idea, use the "Add Link" section.
4. **Recall**: Watch for prompts when starting the app or browsing.
5. **Search**: Use the "Search your brain..." bar to find concepts.

## Development

- **Stack**: Vanilla HTML/CSS/JS. No dependencies.
- **Modules**: `storage`, `graph`, `recall`, `context`, `chunker`, `ui`, `app`.
