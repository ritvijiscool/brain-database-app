/**
 * UI Module
 * Handles DOM manipulation and view rendering
 */

const UI = (function () {
    // Views
    const views = {
        input: document.getElementById('view-input'),
        review: document.getElementById('view-review'),
        ideas: document.getElementById('view-ideas')
    };

    // Nav buttons
    const navs = {
        input: document.getElementById('nav-input'),
        ideas: document.getElementById('nav-ideas')
    };

    // Input elements
    const elements = {
        inputText: document.getElementById('input-text'),
        charCount: document.getElementById('char-count'),
        submitBtn: document.getElementById('btn-submit'),
        inputError: document.getElementById('input-error'),

        reviewOriginalText: document.getElementById('review-original-text'),
        reviewIdeas: document.getElementById('review-ideas-list'),
        reviewWarning: document.getElementById('review-warning'),
        mergeBtn: document.getElementById('btn-merge'),

        ideasCount: document.getElementById('ideas-count'),
        ideasEmpty: document.getElementById('ideas-empty'),
        ideasList: document.getElementById('ideas-list'),

        modal: document.getElementById('modal-confirm'),
        modalTitle: document.getElementById('modal-title'),
        modalMessage: document.getElementById('modal-message'),
        modalConfirmBtn: document.getElementById('modal-confirm-btn')
    };

    /**
     * Switch view
     * @param {string} viewName - 'input', 'review', or 'ideas'
     */
    function showView(viewName) {
        // Hide all views
        Object.values(views).forEach(el => el.hidden = true);

        // Show target view
        if (views[viewName]) {
            views[viewName].hidden = false;
        }

        // Update nav state
        if (viewName === 'input' || viewName === 'review') {
            navs.input.classList.add('active');
            navs.ideas.classList.remove('active');
        } else if (viewName === 'ideas') {
            navs.input.classList.remove('active');
            navs.ideas.classList.add('active');
        }

        // Reset scroll
        window.scrollTo(0, 0);
    }

    /**
     * Show modal
     */
    function showModal(title, message, onConfirm) {
        elements.modalTitle.textContent = title;
        elements.modalMessage.textContent = message;
        elements.modal.hidden = false;

        // handlers need to be managed carefully to avoid duplicates
        const confirmHandler = () => {
            onConfirm();
            closeModal();
            elements.modalConfirmBtn.removeEventListener('click', confirmHandler);
        };

        elements.modalConfirmBtn.onclick = confirmHandler;
    }

    /**
     * Close modal
     */
    function closeModal() {
        elements.modal.hidden = true;
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

    function getInputText() {
        return elements.inputText.value;
    }

    function clearInput() {
        elements.inputText.value = '';
        updateCharCount(0, { status: 'normal', message: '0 / 10,000' });
    }

    // ============== Review View ==============

    function renderReview(rawInput, chunks, issues, selectedIndices) {
        elements.reviewOriginalText.textContent = rawInput.text;
        elements.reviewIdeas.innerHTML = '';

        chunks.forEach((chunk, index) => {
            const card = document.createElement('div');
            card.className = `idea-card ${selectedIndices.includes(index) ? 'selected' : ''}`;

            // Check for issues associated with this chunk
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

        // Update merge button state
        elements.mergeBtn.disabled = selectedIndices.length < 2;

        // Show/hide general warning if any issues exist
        if (issues.length > 0) {
            elements.reviewWarning.textContent = `${issues.length} potential issues detected. Please review carefully.`;
            elements.reviewWarning.hidden = false;
        } else {
            elements.reviewWarning.hidden = true;
        }
    }

    // ============== Ideas View ==============

    function renderIdeas(ideas) {
        elements.ideasCount.textContent = `${ideas.length} ideas`;
        elements.ideasList.innerHTML = '';

        if (ideas.length === 0) {
            elements.ideasEmpty.hidden = false;
            return;
        }

        elements.ideasEmpty.hidden = true;

        // Render in reverse chronological order (newest first)
        [...ideas].reverse().forEach(idea => {
            const item = document.createElement('div');
            item.className = 'stored-idea';

            item.innerHTML = `
                <div class="stored-idea-content">
                    <div class="stored-idea-text">${idea.idea_text}</div>
                    <div class="stored-idea-meta">
                        <span class="idea-type-badge">${idea.idea_type}</span>
                        <span style="margin-left: 8px;">Confidence: ${idea.confidence}</span>
                    </div>
                </div>
                <button class="btn btn-danger btn-small action-delete-stored" data-id="${idea.idea_id}">Delete</button>
            `;

            elements.ideasList.appendChild(item);
        });
    }

    // Public API
    return {
        views,
        elements,
        showView,
        showModal,
        closeModal,

        // Input
        updateCharCount,
        getInputText,
        clearInput,

        // Review
        renderReview,

        // Ideas
        renderIdeas
    };
})();
