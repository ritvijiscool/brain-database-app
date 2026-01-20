/**
 * UI Module
 * Handles DOM manipulation and view rendering (Extended for Phases 4-6)
 */

const UI = (function () {
    // Views
    const views = {
        input: document.getElementById('view-input'),
        review: document.getElementById('view-review'),
        ideas: document.getElementById('view-ideas'),
        details: document.getElementById('view-details')
    };

    // Nav buttons
    const navs = {
        input: document.getElementById('nav-input'),
        ideas: document.getElementById('nav-ideas')
    };

    // Input elements
    const elements = {
        // Input
        inputText: document.getElementById('input-text'),
        charCount: document.getElementById('char-count'),
        submitBtn: document.getElementById('btn-submit'),
        inputError: document.getElementById('input-error'),
        contextIndicator: document.getElementById('context-indicator'),

        // Recall
        recallArea: document.getElementById('recall-area'),
        recallPromptText: document.getElementById('recall-prompt-text'),
        recallAnswer: document.getElementById('recall-answer'),
        recallAnswerText: document.getElementById('recall-answer-text'),
        recallCloseBtn: document.querySelector('.close-recall'),
        recallRevealBtn: document.querySelector('.action-reveal'),
        recallHintBtn: document.querySelector('.action-hint'),
        recallFeedbackBtns: document.querySelectorAll('.action-feedback'),

        // Review
        reviewOriginalText: document.getElementById('review-original-text'),
        reviewIdeas: document.getElementById('review-ideas-list'),
        reviewWarning: document.getElementById('review-warning'),
        mergeBtn: document.getElementById('btn-merge'),

        // Ideas (Search/Retrieval)
        searchInput: document.getElementById('search-input'),
        ideasCount: document.getElementById('ideas-count'),
        ideasEmpty: document.getElementById('ideas-empty'),
        ideasList: document.getElementById('ideas-list'),

        // Details
        detailCard: document.getElementById('detail-card'),
        detailLinks: document.getElementById('detail-links'),
        linkTypeSelect: document.getElementById('link-type-select'),
        linkTargetInput: document.getElementById('link-target-input'),
        addLinkBtn: document.getElementById('btn-add-link'),
        backToIdeasBtn: document.getElementById('btn-back-ideas'),

        // Modal
        modal: document.getElementById('modal-confirm'),
        modalTitle: document.getElementById('modal-title'),
        modalMessage: document.getElementById('modal-message'),
        modalConfirmBtn: document.getElementById('modal-confirm-btn')
    };

    /**
     * Switch view
     * @param {string} viewName - 'input', 'review', 'ideas', 'details'
     */
    function showView(viewName) {
        Object.values(views).forEach(el => el.hidden = true);
        if (views[viewName]) views[viewName].hidden = false;

        // Nav state
        if (viewName === 'input' || viewName === 'review') {
            navs.input.classList.add('active');
            navs.ideas.classList.remove('active');
        } else if (viewName === 'ideas' || viewName === 'details') {
            navs.input.classList.remove('active');
            navs.ideas.classList.add('active');
        }

        window.scrollTo(0, 0);
    }

    // ============== Input View ==============

    function updateCharCount(count, statusInfo) {
        elements.charCount.textContent = statusInfo.message;
        elements.charCount.className = `char-count ${statusInfo.status}`;
        if (statusInfo.status === 'error') {
            elements.inputError.textContent = statusInfo.message;
            elements.inputError.hidden = false;
            elements.submitBtn.disabled = true;
        } else {
            elements.inputError.hidden = true;
            elements.submitBtn.disabled = count === 0;
        }
    }

    function showRecallPrompt(idea) {
        elements.recallArea.hidden = false;
        elements.recallPromptText.textContent = `Do you remember: "${idea.idea_text}"?`; // Simplified prompt
        elements.recallAnswer.hidden = true;
        elements.recallAnswerText.textContent = idea.idea_text; // Full text as answer
        elements.recallArea.dataset.id = idea.idea_id;
    }

    function hideRecallPrompt() {
        elements.recallArea.hidden = true;
    }

    // ============== Review View (Unchanged mostly) ==============

    function renderReview(rawInput, chunks, issues, selectedIndices) {
        // ... previous implementation ...
        elements.reviewOriginalText.textContent = rawInput.text;
        elements.reviewIdeas.innerHTML = '';

        chunks.forEach((chunk, index) => {
            const card = document.createElement('div');
            card.className = `idea-card ${selectedIndices.includes(index) ? 'selected' : ''}`;

            // Check for issues
            const issue = issues.find(i => i.chunkIndex === index);
            let alertHtml = '';
            if (issue) {
                const icon = issue.type === 'under-chunk' ? 'ℹ️' : '⚠️';
                alertHtml = `<div class="warning-message" style="margin-top: 0; margin-bottom: 8px; font-size: 0.8rem;">
                    ${icon} ${issue.message}
                </div>`;
            }

            card.innerHTML = `
                ${alertHtml}
                <div class="idea-card-header">
                    <input type="checkbox" class="idea-checkbox" data-index="${index}" 
                        ${selectedIndices.includes(index) ? 'checked' : ''}>
                    <span class="idea-number">${index + 1}.</span>
                    <input type="text" class="idea-text-input" value="${chunk.idea_text}" data-index="${index}">
                </div>
                
                <div class="idea-card-footer">
                    <select class="idea-type-select" data-index="${index}">
                        ${Chunker.getIdeaTypes().map(type =>
                `<option value="${type}" ${chunk.idea_type === type ? 'selected' : ''}>${type}</option>`
            ).join('')}
                    </select>
                    
                    <div class="idea-actions">
                        <button class="btn btn-secondary btn-small action-split" data-index="${index}">Split</button>
                        <button class="btn btn-danger btn-small action-delete" data-index="${index}">Delete</button>
                    </div>
                </div>
            `;
            elements.reviewIdeas.appendChild(card);
        });

        elements.mergeBtn.disabled = selectedIndices.length < 2;
        elements.reviewWarning.hidden = issues.length === 0;
        if (issues.length > 0) {
            elements.reviewWarning.textContent = `${issues.length} potential issues detected.`;
        }
    }

    // ============== Ideas/Retrieval View ==============

    function renderIdeas(ideas, isSearchResult = false) {
        elements.ideasCount.textContent = `${ideas.length} results`;
        elements.ideasList.innerHTML = '';

        if (ideas.length === 0) {
            elements.ideasEmpty.hidden = false;
            return;
        }

        elements.ideasEmpty.hidden = true;

        ideas.forEach(idea => {
            const item = document.createElement('div');
            item.className = 'stored-idea';
            item.dataset.id = idea.idea_id;

            // Limit text length for preview if it's really long
            const displaySafe = idea.idea_text.length > 150 ? idea.idea_text.substring(0, 150) + '...' : idea.idea_text;

            item.innerHTML = `
                <div class="stored-idea-content">
                    <div class="stored-idea-text">${displaySafe}</div>
                    <div class="stored-idea-meta">
                        <span class="idea-type-badge">${idea.idea_type}</span>
                        <span>Conf: ${idea.confidence || '-'}</span>
                        <div class="strength-indicator strength-${idea.strength || 0}" title="Memory Strength"></div>
                        ${idea.linked ? '<span>🔗 Linked</span>' : ''}
                    </div>
                </div>
            `;

            elements.ideasList.appendChild(item);
        });
    }

    // ============== Details View ==============

    function renderDetails(idea, links = []) {
        elements.detailCard.innerHTML = `
            <div class="detail-text">${idea.idea_text}</div>
            
            <div class="detail-meta-controls">
                <div class="detail-control-group">
                    <label class="detail-control-label">Type</label>
                    <span class="idea-type-badge">${idea.idea_type}</span>
                </div>
                
                <div class="detail-control-group">
                    <label class="detail-control-label">Confidence</label>
                    <select class="detail-select action-update-conf" data-id="${idea.idea_id}">
                        <option value="0" ${idea.confidence == 0 ? 'selected' : ''}>Unknown</option>
                        <option value="1" ${idea.confidence == 1 ? 'selected' : ''}>Low</option>
                        <option value="2" ${idea.confidence == 2 ? 'selected' : ''}>Medium</option>
                        <option value="3" ${idea.confidence == 3 ? 'selected' : ''}>High</option>
                    </select>
                </div>

                <div class="detail-control-group">
                    <label class="detail-control-label">Memory</label>
                    <div class="strength-indicator strength-${idea.strength || 0}" 
                         style="width: 20px; height: 20px; align-self: center;"></div>
                </div>
                
                <div style="flex:1"></div>
                
                <button class="btn btn-danger btn-small action-delete-detail" data-id="${idea.idea_id}">Delete Idea</button>
            </div>
        `;

        elements.detailLinks.innerHTML = '';
        if (links.length === 0) {
            elements.detailLinks.innerHTML = '<p class="subtle">No links yet.</p>';
        } else {
            links.forEach(link => {
                const linkLabel = link.direction === 'outgoing' ? `→ ${link.type}` : `← ${link.type} by`;
                const el = document.createElement('div');
                el.className = 'link-item';
                el.innerHTML = `
                    <span class="link-type">${linkLabel}</span>
                    <span style="flex:1;">${link.target.idea_text.substring(0, 60)}...</span>
                    <button class="btn-icon action-remove-link" data-edge-id="${link.id}">×</button>
                `;
                elements.detailLinks.appendChild(el);
            });
        }

        elements.linkTargetInput.value = ''; // clear input
        elements.detailCard.dataset.id = idea.idea_id;
    }

    // Modal helpers (same as before)
    function showModal(title, message, onConfirm) {
        elements.modalTitle.textContent = title;
        elements.modalMessage.textContent = message;
        elements.modal.hidden = false;

        const confirmHandler = () => {
            onConfirm();
            closeModal();
            elements.modalConfirmBtn.removeEventListener('click', confirmHandler);
        };
        elements.modalConfirmBtn.onclick = confirmHandler;
    }

    function closeModal() {
        elements.modal.hidden = true;
    }

    return {
        elements,
        showView,
        showModal,
        closeModal,
        updateCharCount,
        renderReview,
        renderIdeas,
        renderDetails,
        showRecallPrompt,
        hideRecallPrompt
    };
})();
