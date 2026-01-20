/**
 * App Module
 * Main application orchestrator
 */

window.addEventListener('DOMContentLoaded', () => {
    // Initialize state
    initializeApp();

    // Global Event Listeners
    setupEventListeners();
});

function initializeApp() {
    console.log('[APP] Initializing Brain Database v1');

    // Load initial view
    UI.showView('input');

    // Check for offline status
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
}

function updateOnlineStatus() {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status');

    if (navigator.onLine) {
        statusDot.style.backgroundColor = 'var(--color-success)';
        // statusText.innerHTML = '<span class="status-dot"></span> Online';
    } else {
        statusDot.style.backgroundColor = 'var(--color-warning)';
        // statusText.innerHTML = '<span class="status-dot" style="background-color: var(--color-warning)"></span> Offline';
    }
}

function setupEventListeners() {
    // Navigation
    document.getElementById('nav-input').addEventListener('click', () => {
        if (Review.hasChunks()) {
            UI.showModal(
                'Abandon Review?',
                'You have unsaved ideas. Going back to input will discard them.',
                () => {
                    Review.reset();
                    UI.showView('input');
                }
            );
        } else {
            UI.showView('input');
        }
    });

    document.getElementById('nav-ideas').addEventListener('click', () => {
        if (Review.hasChunks()) {
            UI.showModal(
                'Abandon Review?',
                'You have unsaved ideas. Going to stored ideas will discard them.',
                () => {
                    Review.reset();
                    loadIdeasView();
                }
            );
        } else {
            loadIdeasView();
        }
    });

    // Input View events
    UI.elements.inputText.addEventListener('input', handleInput);
    UI.elements.submitBtn.addEventListener('click', handleSubmit);

    // Review View events
    UI.elements.mergeBtn.addEventListener('click', handleMerge);
    document.getElementById('btn-cancel').addEventListener('click', handleCancelReview);
    document.getElementById('btn-confirm').addEventListener('click', handleConfirmReview);

    // Delegation for dynamic elements in Review View
    UI.elements.reviewIdeas.addEventListener('change', handleReviewChange);
    UI.elements.reviewIdeas.addEventListener('click', handleReviewClick);

    // Ideas View events
    document.getElementById('btn-export').addEventListener('click', handleExport);
    document.getElementById('btn-clear-all').addEventListener('click', handleClearAll);
    UI.elements.ideasList.addEventListener('click', handleIdeasClick);

    // Modal events
    document.getElementById('modal-cancel').addEventListener('click', UI.closeModal);
}

// ============== Input Handlers ==============

function handleInput(e) {
    const text = e.target.value;
    const validation = Validation.validate(text);
    const status = Validation.getCharCountStatus(text.length);

    UI.updateCharCount(text.length, status);
}

function handleSubmit() {
    const text = UI.getInputText();

    if (!Validation.isValid(text)) {
        return; // UI already shows error
    }

    // 1. Save raw input
    try {
        const rawInput = Storage.saveRawInput(text);

        // 2. Run chunker
        const result = Chunker.chunk(rawInput.text, rawInput.id);

        // 3. Initialize Review
        Review.init(rawInput, result.chunks, result.issues);

        // 4. Render Review View
        refreshReviewView(result.issues);
        UI.showView('review');

        // 5. Clear input
        UI.clearInput();

    } catch (e) {
        console.error('[APP] Submission failed:', e);
        alert('An error occurred while processing your input. Check console for details.');
    }
}

// ============== Review Handlers ==============

function refreshReviewView(issues = []) {
    UI.renderReview(
        Review.getRawInput(),
        Review.getChunks(),
        issues,
        Review.getSelectedIndices()
    );
}

function handleReviewChange(e) {
    const target = e.target;
    const index = parseInt(target.dataset.index);

    if (target.classList.contains('idea-checkbox')) {
        Review.toggleSelection(index);
        refreshReviewView();
    }
    else if (target.classList.contains('idea-text-input')) {
        Review.editChunk(index, target.value);
        // Don't refresh whole view on text edit, loses focus
    }
    else if (target.classList.contains('idea-type-select')) {
        Review.changeType(index, target.value);
        // Don't refresh needed
    }
}

function handleReviewClick(e) {
    const target = e.target;
    const index = parseInt(target.dataset.index);

    if (target.classList.contains('action-delete')) {
        Review.deleteChunk(index);
        refreshReviewView();
    }
    else if (target.classList.contains('action-split')) {
        // Simple prompt for now, could be better UI
        // We'll split visually at the cursor position if possible?
        // For v1, let's just ask user where to split relative to text
        const chunk = Review.getChunks()[index];
        const text = chunk.idea_text;

        if (text.includes(' ') && text.length > 5) {
            // Find middle space as default approximation or just duplicate?
            // Actually, best UX for simplicity: Ask user to edit.
            // Or better: prompt "Enter the first part (rest will be new idea)"
            const splitWord = prompt('Copy the text for the FIRST idea (the remainder will become the second idea):', text);
            if (splitWord && splitWord !== text) {
                // Find where this substring ends
                // This is a bit fragile, so let's try strict character match
                if (text.startsWith(splitWord)) {
                    Review.splitChunk(index, splitWord.length);
                    refreshReviewView();
                } else {
                    alert('Please enter a substring from the beginning of the text.');
                }
            }
        } else {
            alert('Text too short to split.');
        }
    }
}

function handleMerge() {
    if (Review.mergeSelected()) {
        refreshReviewView();
    }
}

function handleCancelReview() {
    UI.showModal(
        'Discard Changes?',
        'This will discard all extracted ideas. The raw input is still safe.',
        () => {
            Review.reset();
            UI.showView('input');
        }
    );
}

function handleConfirmReview() {
    const chunks = Review.getChunksForSaving();

    if (chunks.length === 0) {
        alert('No ideas to save.');
        return;
    }

    UI.showModal(
        `Save ${chunks.length} Ideas?`,
        'These ideas will be added to your permanent database.',
        () => {
            try {
                // Save ideas
                Storage.saveIdeas(chunks);

                // Mark raw input as processed
                Storage.markProcessed(Review.getRawInput().id);

                // Reset and go to ideas view
                Review.reset();
                loadIdeasView();

            } catch (e) {
                console.error('[APP] Save failed:', e);
                alert('Failed to save ideas. See console.');
            }
        }
    );
}

// ============== Ideas Handlers ==============

function loadIdeasView() {
    const ideas = Storage.getIdeas();
    UI.renderIdeas(ideas);
    UI.showView('ideas');
}

function handleIdeasClick(e) {
    if (e.target.classList.contains('action-delete-stored')) {
        const id = e.target.dataset.id;
        UI.showModal(
            'Delete Idea?',
            'This action cannot be undone.',
            () => {
                Storage.deleteIdea(id);
                loadIdeasView();
            }
        );
    }
}

function handleExport() {
    const data = Storage.exportData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `brain-database-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();

    URL.revokeObjectURL(url);
}

function handleClearAll() {
    UI.showModal(
        'CLEAR ALL DATA?',
        'This will delete ALL ideas and raw inputs. There is no undo.',
        () => {
            Storage.clearAllData();
            loadIdeasView(); // refresh empty state
        }
    );
}
