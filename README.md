# Brain Database App

A local-first cognitive system for capturing and organizing atomic ideas. Built with vanilla HTML/JS, running entirely in your browser with no server, accounts, or cloud dependencies.

## Features

- **Input Capture**: Type or paste information securely.
- **Atomic Chunking**: Automatically splits text into "atomic ideas" (facts, definitions, etc.).
- **User Review**: You are the final authority. Edit, split, merge, or delete ideas before approving.
- **Local Storage**: All data stays on your machine (`localStorage`).
- **Export**: Backup your knowledge graph to JSON.

## Usage

1. **Launch**: Open `index.html` in any web browser.
2. **Input**: Type information into the chat box.
   - Example: *"Water boils at 100°C because heat provides energy for molecules to escape."*
3. **Review**: 
   - The system extracts atomic ideas.
   - Check if they are correct.
   - **Split** compound ideas, **Merge** fragments, or **Edit** text.
   - Assign types (Fact, Definition, Cause, Example, Procedure, Question).
4. **Confirm**: Click "Confirm All" to save approved ideas.
5. **View**: See your stored ideas in the "Ideas" tab.

## Principles

- **Offline-First**: Works without an internet connection.
- **Privacy**: No tracking, no data sharing.
- **Control**: AI suggests; you decide.

## Development

- built with: HTML5, CSS3, Vanilla JavaScript
- storage: browser localStorage
- license: MIT
