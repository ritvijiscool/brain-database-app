# Changelog

All notable changes to the Brain Database App will be documented in this file.

## [v1.4] - 2026-01-20

### Added
- **Graph Linking System (Phase 4)**: 
  - Added `graph.js` module.
  - Implemented link types: *supports, depends, example, contradicts, refines*.
  - Added "Details View" with ability to add/remove links.
- **Recall Mechanism (Phase 5)**:
  - Added `recall.js` module.
  - Implemented "Memory Strength" tracking (stages 0-3).
  - Added non-intrusive "Thinking Check" prompts.
- **Contextual Retrieval (Phase 6)**:
  - Added `context.js` module.
  - Replaced "Ideas" list with "Search & Retrieve" view.
  - Implemented relevance scoring based on keywords and graph connections.
- **UI Enhancements**:
  - New "Details" view for atomic ideas.
  - Visual indicators for Memory Strength and Link status.
  - Search bar in Retrieval view.

### Changed
- Updated `storage.js` to support edge storage (`braindb_edges`) and extended idea metadata (`confidence`, `strength`).
- Updated `ui.js` and `app.js` to coordinate new views and modules.
- Refined `style.css` to support new UI components.

## [v1.0] - 2026-01-20

### Initial Release (Phase 0-3)
- **Input**: Raw text capture and storage.
- **Chunking**: Rule-based extraction of atomic ideas.
- **Review**: Interface for editing, splitting, and approving chunks.
- **Storage**: LocalStorage-based persistence for raw inputs and approved ideas.
- **Offline**: Fully functional without internet access.
