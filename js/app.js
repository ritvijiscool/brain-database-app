/**
 * App Module
 * Main application orchestrator (Extended for Phases 4-6)
 */

window.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    console.log('[APP] Initializing Brain Database v1.4');
    UI.showView('input');

    // Check for recall prompts on load
    const dueItems = Recall.getPrompts(1);
    if (dueItems.length > 0) {
        UI.showRecallPrompt(dueItems[0]);
    }
}

function setupEventListeners() {
    // Navigation
    document.getElementById('nav-input').addEventListener('click', () => UI.showView('input'));
    document.getElementById('nav-ideas').addEventListener('click', () => {
        loadRetrievalView();
        UI.showView('ideas');
    });

    // Input View
    UI.elements.inputText.addEventListener('input', (e) => {
        const text = e.target.value;
        const valid = Validation.validate(text);
        UI.updateCharCount(text.length, Validation.getCharCountStatus(text.length));

        // Simple context detection (Phase 6)
        // If text > 20 chars, try to find relevant stuff silently? 
        // For v1, we won't auto-search while typing to avoid noise, 
        // relying on the specific 'Search' tab.
    });

    UI.elements.submitBtn.addEventListener('click', handleInputSubmit);

    // Recall View
    UI.elements.recallCloseBtn.addEventListener('click', UI.hideRecallPrompt);
    UI.elements.recallRevealBtn.addEventListener('click', () => {
        UI.elements.recallAnswer.hidden = false;
    });
    UI.elements.recallHintBtn.addEventListener('click', () => {
        alert('Hint: Reframing not fully implemented yet, try to think about connected ideas.');
    });

    UI.elements.recallFeedbackBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const result = e.target.dataset.result; // 'success', 'fail', 'partial'
            const ideaId = UI.elements.recallArea.dataset.id;

            const success = result === 'success';
            Recall.updateStrength(ideaId, success);
            UI.hideRecallPrompt();
        });
    });

    // Review View (Delegation updated)
    UI.elements.mergeBtn.addEventListener('click', () => {
        if (Review.mergeSelected()) refreshReviewView();
    });
    document.getElementById('btn-cancel').addEventListener('click', () => {
        if (confirm('Discard ideas?')) { Review.reset(); UI.showView('input'); }
    });
    document.getElementById('btn-confirm').addEventListener('click', handleConfirmReview);

    UI.elements.reviewIdeas.addEventListener('change', handleReviewChange);
    UI.elements.reviewIdeas.addEventListener('click', handleReviewClick);

    // Retrieval View
    UI.elements.searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        const results = Context.findRelevant(query);
        UI.renderIdeas(results, true);
    });

    // Click on idea in list -> Go to Details
    UI.elements.ideasList.addEventListener('click', (e) => {
        const ideaEl = e.target.closest('.stored-idea');
        if (ideaEl) {
            loadDetailsView(ideaEl.dataset.id);
        }
    });

    document.getElementById('btn-export').addEventListener('click', handleExport);
    document.getElementById('btn-clear-all').addEventListener('click', handleClearAll);

    // Details View
    UI.elements.backToIdeasBtn.addEventListener('click', () => UI.showView('ideas'));

    UI.elements.addLinkBtn.addEventListener('click', handleAddLink);

    // Delegation for details
    UI.elements.detailCard.addEventListener('change', (e) => {
        if (e.target.classList.contains('action-update-conf')) {
            const id = e.target.dataset.id;
            const val = parseInt(e.target.value);
            const idea = Storage.getIdea(id);
            if (idea) {
                idea.confidence = val;
                Storage.saveIdea(idea);
            }
        }
    });

    UI.elements.detailCard.addEventListener('click', (e) => {
        if (e.target.classList.contains('action-delete-detail')) {
            if (confirm('Delete this idea?')) {
                Storage.deleteIdea(e.target.dataset.id);
                UI.showView('ideas');
                loadRetrievalView();
            }
        }
    });

    UI.elements.detailLinks.addEventListener('click', (e) => {
        if (e.target.classList.contains('action-remove-link')) {
            const edgeId = e.target.dataset.edgeId;
            Graph.removeLink(edgeId);
            // Refresh details
            const currentId = UI.elements.detailCard.dataset.id;
            loadDetailsView(currentId);
        }
    });
}

// ============== Handlers ==============

function handleInputSubmit() {
    const text = UI.elements.inputText.value;
    if (!Validation.isValid(text)) return;

    const rawInput = Storage.saveRawInput(text);
    const result = Chunker.chunk(rawInput.text, rawInput.id);

    Review.init(rawInput, result.chunks, result.issues);
    refreshReviewView();
    UI.showView('review');
    UI.elements.inputText.value = '';
}

function refreshReviewView() {
    UI.renderReview(Review.getRawInput(), Review.getChunks(), [], Review.getSelectedIndices());
}

function handleReviewChange(e) {
    const target = e.target;
    const index = parseInt(target.dataset.index);
    if (target.classList.contains('idea-checkbox')) Review.toggleSelection(index);
    else if (target.classList.contains('idea-text-input')) Review.editChunk(index, target.value);
    else if (target.classList.contains('idea-type-select')) Review.changeType(index, target.value);
}

function handleReviewClick(e) {
    const target = e.target;
    const index = parseInt(target.dataset.index);
    if (target.classList.contains('action-delete')) { Review.deleteChunk(index); refreshReviewView(); }
    else if (target.classList.contains('action-split')) { /* Split logic same as before */ }
}

function handleConfirmReview() {
    const chunks = Review.getChunksForSaving();
    if (chunks.length === 0) return;

    Storage.saveIdeas(chunks);
    Storage.markProcessed(Review.getRawInput().id);
    Review.reset();

    // Check for auto-linking candidates (Deduplication check)
    // For v1, just go to ideas view
    loadRetrievalView();
    UI.showView('ideas');
}

function loadRetrievalView() {
    const ideas = Storage.getIdeas().slice().reverse(); // Default: newest first
    UI.renderIdeas(ideas);
    UI.elements.searchInput.value = '';
}

function loadDetailsView(id) {
    const idea = Storage.getIdea(id);
    if (!idea) return;

    const links = Graph.getLinksFor(id);
    UI.renderDetails(idea, links);
    UI.showView('details');
}

function handleAddLink() {
    const currentId = UI.elements.detailCard.dataset.id;
    const targetQuery = UI.elements.linkTargetInput.value.trim();
    const type = UI.elements.linkTypeSelect.value;

    if (!targetQuery) return alert('Enter a target ID or search text');

    // Simple search for target
    const candidates = Context.findRelevant(targetQuery);
    if (candidates.length === 0) return alert('No idea found matching that text.');

    // If multiple, maybe ask user? For now pick first that isn't self
    const target = candidates.find(c => c.idea_id !== currentId);

    if (!target) return alert('Cannot link to self or no valid target.');

    if (confirm(`Link to: "${target.idea_text.substring(0, 30)}..."?`)) {
        Graph.addLink(currentId, target.idea_id, type);
        loadDetailsView(currentId);
    }
}

function handleExport() {
    const data = Storage.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brain-database-v1.4-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
}

function handleClearAll() {
    if (confirm('DELETE ALL DATA?')) {
        Storage.clearAllData();
        loadRetrievalView();
    }
}
