/**
 * Storage Module
 * Handles all localStorage operations with atomic writes
 */

const Storage = (function() {
    const KEYS = {
        RAW_INPUTS: 'braindb_raw_inputs',
        IDEAS: 'braindb_ideas'
    };

    /**
     * Generate unique ID
     */
    function generateId(prefix) {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Get current timestamp in ISO format
     */
    function getTimestamp() {
        return new Date().toISOString();
    }

    /**
     * Safely parse JSON from localStorage
     */
    function parseStorage(key, defaultValue) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (e) {
            console.error(`[STORAGE] Failed to parse ${key}:`, e);
            return defaultValue;
        }
    }

    /**
     * Safely write JSON to localStorage (atomic-like operation)
     */
    function writeStorage(key, data) {
        try {
            const json = JSON.stringify(data, null, 2);
            localStorage.setItem(key, json);
            return true;
        } catch (e) {
            console.error(`[STORAGE] Failed to write ${key}:`, e);
            return false;
        }
    }

    // ============== Raw Input Operations ==============

    /**
     * Save new raw input
     * @param {string} text - The raw input text
     * @returns {object} The created raw input object
     */
    function saveRawInput(text) {
        const rawInputs = parseStorage(KEYS.RAW_INPUTS, []);
        
        const rawInput = {
            id: generateId('raw'),
            text: text,
            timestamp: getTimestamp(),
            processed: false
        };
        
        rawInputs.push(rawInput);
        
        if (writeStorage(KEYS.RAW_INPUTS, rawInputs)) {
            console.log(`[STORAGE] Raw input saved: ${rawInput.id}`);
            return rawInput;
        }
        
        throw new Error('Failed to save raw input');
    }

    /**
     * Get all raw inputs
     * @returns {array} Array of raw input objects
     */
    function getRawInputs() {
        return parseStorage(KEYS.RAW_INPUTS, []);
    }

    /**
     * Get unprocessed raw inputs
     * @returns {array} Array of unprocessed raw input objects
     */
    function getUnprocessedInputs() {
        return getRawInputs().filter(input => !input.processed);
    }

    /**
     * Mark a raw input as processed
     * @param {string} id - The raw input ID
     * @returns {boolean} Success status
     */
    function markProcessed(id) {
        const rawInputs = getRawInputs();
        const index = rawInputs.findIndex(input => input.id === id);
        
        if (index === -1) {
            console.warn(`[STORAGE] Raw input not found: ${id}`);
            return false;
        }
        
        rawInputs[index].processed = true;
        rawInputs[index].processed_at = getTimestamp();
        
        if (writeStorage(KEYS.RAW_INPUTS, rawInputs)) {
            console.log(`[STORAGE] Marked processed: ${id}`);
            return true;
        }
        
        return false;
    }

    /**
     * Delete a raw input
     * @param {string} id - The raw input ID
     * @returns {boolean} Success status
     */
    function deleteRawInput(id) {
        const rawInputs = getRawInputs();
        const filtered = rawInputs.filter(input => input.id !== id);
        
        if (filtered.length === rawInputs.length) {
            console.warn(`[STORAGE] Raw input not found: ${id}`);
            return false;
        }
        
        return writeStorage(KEYS.RAW_INPUTS, filtered);
    }

    // ============== Ideas Operations ==============

    /**
     * Save a single approved idea
     * @param {object} idea - The idea object
     * @returns {object} The saved idea
     */
    function saveIdea(idea) {
        const ideas = parseStorage(KEYS.IDEAS, []);
        
        // Ensure required fields
        const savedIdea = {
            idea_id: idea.idea_id || generateId('idea'),
            idea_text: idea.idea_text,
            idea_type: idea.idea_type || 'fact',
            source_raw_input_id: idea.source_raw_input_id || null,
            confidence: idea.confidence || 'unknown',
            linked: idea.linked || false,
            created_at: idea.created_at || getTimestamp()
        };
        
        ideas.push(savedIdea);
        
        if (writeStorage(KEYS.IDEAS, ideas)) {
            console.log(`[STORAGE] Idea saved: ${savedIdea.idea_id}`);
            return savedIdea;
        }
        
        throw new Error('Failed to save idea');
    }

    /**
     * Save multiple ideas at once
     * @param {array} ideasToSave - Array of idea objects
     * @returns {array} Array of saved ideas
     */
    function saveIdeas(ideasToSave) {
        const ideas = parseStorage(KEYS.IDEAS, []);
        const timestamp = getTimestamp();
        
        const savedIdeas = ideasToSave.map((idea, index) => ({
            idea_id: idea.idea_id || generateId('idea') + '_' + index,
            idea_text: idea.idea_text,
            idea_type: idea.idea_type || 'fact',
            source_raw_input_id: idea.source_raw_input_id || null,
            confidence: idea.confidence || 'unknown',
            linked: idea.linked || false,
            created_at: timestamp
        }));
        
        const allIdeas = [...ideas, ...savedIdeas];
        
        if (writeStorage(KEYS.IDEAS, allIdeas)) {
            console.log(`[STORAGE] Saved ${savedIdeas.length} ideas`);
            return savedIdeas;
        }
        
        throw new Error('Failed to save ideas');
    }

    /**
     * Get all approved ideas
     * @returns {array} Array of idea objects
     */
    function getIdeas() {
        return parseStorage(KEYS.IDEAS, []);
    }

    /**
     * Delete an idea
     * @param {string} id - The idea ID
     * @returns {boolean} Success status
     */
    function deleteIdea(id) {
        const ideas = getIdeas();
        const filtered = ideas.filter(idea => idea.idea_id !== id);
        
        if (filtered.length === ideas.length) {
            console.warn(`[STORAGE] Idea not found: ${id}`);
            return false;
        }
        
        return writeStorage(KEYS.IDEAS, filtered);
    }

    /**
     * Clear all ideas
     * @returns {boolean} Success status
     */
    function clearAllIdeas() {
        return writeStorage(KEYS.IDEAS, []);
    }

    // ============== Export/Import ==============

    /**
     * Export all data as JSON
     * @returns {object} Complete data export
     */
    function exportData() {
        return {
            exported_at: getTimestamp(),
            version: '1.0',
            raw_inputs: getRawInputs(),
            ideas: getIdeas()
        };
    }

    /**
     * Clear all data
     * @returns {boolean} Success status
     */
    function clearAllData() {
        try {
            localStorage.removeItem(KEYS.RAW_INPUTS);
            localStorage.removeItem(KEYS.IDEAS);
            console.log('[STORAGE] All data cleared');
            return true;
        } catch (e) {
            console.error('[STORAGE] Failed to clear data:', e);
            return false;
        }
    }

    // Public API
    return {
        // Raw inputs
        saveRawInput,
        getRawInputs,
        getUnprocessedInputs,
        markProcessed,
        deleteRawInput,
        
        // Ideas
        saveIdea,
        saveIdeas,
        getIdeas,
        deleteIdea,
        clearAllIdeas,
        
        // Export/Import
        exportData,
        clearAllData,
        
        // Utilities
        generateId,
        getTimestamp
    };
})();
