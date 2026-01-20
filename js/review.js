/**
 * Review Module
 * Handles the chunk review interface logic
 */

const Review = (function () {
    let currentChunks = [];
    let currentRawInput = null;
    let selectedIndices = new Set();

    /**
     * Initialize review with chunks
     */
    function init(rawInput, chunks, issues) {
        currentRawInput = rawInput;
        currentChunks = chunks.map((chunk, index) => ({
            ...chunk,
            _index: index,
            _editing: false,
            _issue: issues.find(i => i.chunkIndex === index) || null
        }));
        selectedIndices.clear();

        console.log(`[REVIEW] Initialized with ${currentChunks.length} chunks`);
        return currentChunks;
    }

    /**
     * Get current chunks
     */
    function getChunks() {
        return currentChunks;
    }

    /**
     * Get current raw input
     */
    function getRawInput() {
        return currentRawInput;
    }

    /**
     * Toggle selection for merging
     */
    function toggleSelection(index) {
        if (selectedIndices.has(index)) {
            selectedIndices.delete(index);
        } else {
            selectedIndices.add(index);
        }
        return getSelectedIndices();
    }

    /**
     * Get selected indices
     */
    function getSelectedIndices() {
        return Array.from(selectedIndices).sort((a, b) => a - b);
    }

    /**
     * Clear selection
     */
    function clearSelection() {
        selectedIndices.clear();
    }

    /**
     * Edit chunk text
     */
    function editChunk(index, newText) {
        if (index < 0 || index >= currentChunks.length) {
            console.warn(`[REVIEW] Invalid chunk index: ${index}`);
            return false;
        }

        if (!newText.trim()) {
            console.warn('[REVIEW] Cannot save empty chunk');
            return false;
        }

        currentChunks[index].idea_text = newText.trim();
        currentChunks[index]._editing = false;

        // Re-classify type based on new text
        currentChunks[index].idea_type = Chunker.classifyType(newText);

        console.log(`[REVIEW] Edited chunk ${index}`);
        return true;
    }

    /**
     * Change chunk type
     */
    function changeType(index, newType) {
        if (index < 0 || index >= currentChunks.length) {
            return false;
        }

        const validTypes = Chunker.getIdeaTypes();
        if (!validTypes.includes(newType)) {
            console.warn(`[REVIEW] Invalid type: ${newType}`);
            return false;
        }

        currentChunks[index].idea_type = newType;
        console.log(`[REVIEW] Changed chunk ${index} type to ${newType}`);
        return true;
    }

    /**
     * Delete chunk
     */
    function deleteChunk(index) {
        if (index < 0 || index >= currentChunks.length) {
            return false;
        }

        currentChunks.splice(index, 1);

        // Update indices
        currentChunks.forEach((chunk, i) => {
            chunk._index = i;
        });

        // Clear selection (indices no longer valid)
        selectedIndices.clear();

        console.log(`[REVIEW] Deleted chunk ${index}`);
        return true;
    }

    /**
     * Split chunk into two
     */
    function splitChunk(index, splitPoint) {
        if (index < 0 || index >= currentChunks.length) {
            return false;
        }

        const chunk = currentChunks[index];
        const text = chunk.idea_text;

        if (splitPoint <= 0 || splitPoint >= text.length) {
            console.warn('[REVIEW] Invalid split point');
            return false;
        }

        const firstPart = text.substring(0, splitPoint).trim();
        const secondPart = text.substring(splitPoint).trim();

        if (!firstPart || !secondPart) {
            console.warn('[REVIEW] Split would create empty chunk');
            return false;
        }

        // Update first part
        currentChunks[index].idea_text = firstPart;
        currentChunks[index].idea_type = Chunker.classifyType(firstPart);

        // Insert second part after
        const newChunk = {
            idea_id: `${chunk.source_raw_input_id}_chunk_${Date.now()}`,
            idea_text: secondPart,
            idea_type: Chunker.classifyType(secondPart),
            source_raw_input_id: chunk.source_raw_input_id,
            confidence: 'unknown',
            linked: false,
            _index: index + 1,
            _editing: false,
            _issue: null
        };

        currentChunks.splice(index + 1, 0, newChunk);

        // Update indices
        currentChunks.forEach((c, i) => {
            c._index = i;
        });

        console.log(`[REVIEW] Split chunk ${index} into two`);
        return true;
    }

    /**
     * Merge selected chunks
     */
    function mergeSelected() {
        const indices = getSelectedIndices();

        if (indices.length < 2) {
            console.warn('[REVIEW] Need at least 2 chunks to merge');
            return false;
        }

        // Combine texts
        const mergedText = indices
            .map(i => currentChunks[i].idea_text)
            .join(' ');

        // Keep the first chunk, update its text
        const firstIndex = indices[0];
        currentChunks[firstIndex].idea_text = mergedText;
        currentChunks[firstIndex].idea_type = Chunker.classifyType(mergedText);

        // Remove other chunks (in reverse order to preserve indices)
        // Sort descending to remove from end first
        const indicesToRemove = indices.slice(1).sort((a, b) => b - a);
        for (const i of indicesToRemove) {
            currentChunks.splice(i, 1);
        }

        // Update indices
        currentChunks.forEach((chunk, i) => {
            chunk._index = i;
        });

        // Clear selection
        selectedIndices.clear();

        console.log(`[REVIEW] Merged ${indices.length} chunks`);
        return true;
    }

    /**
     * Get chunks ready for saving (clean up internal properties)
     */
    function getChunksForSaving() {
        return currentChunks.map(chunk => ({
            idea_id: chunk.idea_id,
            idea_text: chunk.idea_text,
            idea_type: chunk.idea_type,
            source_raw_input_id: chunk.source_raw_input_id,
            confidence: chunk.confidence,
            linked: chunk.linked
        }));
    }

    /**
     * Check if there are chunks to review
     */
    function hasChunks() {
        return currentChunks.length > 0;
    }

    /**
     * Reset review state
     */
    function reset() {
        currentChunks = [];
        currentRawInput = null;
        selectedIndices.clear();
    }

    // Public API
    return {
        init,
        getChunks,
        getRawInput,
        toggleSelection,
        getSelectedIndices,
        clearSelection,
        editChunk,
        changeType,
        deleteChunk,
        splitChunk,
        mergeSelected,
        getChunksForSaving,
        hasChunks,
        reset
    };
})();
