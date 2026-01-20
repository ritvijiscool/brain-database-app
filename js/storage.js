/**
 * Storage Module
 * Handles all localStorage operations with atomic writes
 */

const Storage = (function () {
    const KEYS = {
        RAW_INPUTS: 'braindb_raw_inputs',
        IDEAS: 'braindb_ideas',
        EDGES: 'braindb_edges',
        CONTEXT: 'braindb_context'
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

    function getRawInputs() {
        return parseStorage(KEYS.RAW_INPUTS, []);
    }

    function getUnprocessedInputs() {
        return getRawInputs().filter(input => !input.processed);
    }

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

    function saveIdea(idea) {
        const ideas = parseStorage(KEYS.IDEAS, []);

        // Check if updating existing idea
        const existingIndex = ideas.findIndex(i => i.idea_id === idea.idea_id);

        if (existingIndex !== -1) {
            // Update existing
            ideas[existingIndex] = { ...ideas[existingIndex], ...idea, updated_at: getTimestamp() };
            if (writeStorage(KEYS.IDEAS, ideas)) {
                console.log(`[STORAGE] Idea updated: ${idea.idea_id}`);
                return ideas[existingIndex];
            }
        } else {
            // Create new
            const savedIdea = {
                idea_id: idea.idea_id || generateId('idea'),
                idea_text: idea.idea_text,
                idea_type: idea.idea_type || 'fact',
                source_raw_input_id: idea.source_raw_input_id || null,
                confidence: idea.confidence || 0, // 0=Unknown, 1=Low, 2=Med, 3=High
                strength: idea.strength || 0, // 0=New, 1=Sprouting, 2=Established, 3=Deep
                last_recalled: idea.last_recalled || null,
                linked: idea.linked || false,
                created_at: idea.created_at || getTimestamp()
            };

            ideas.push(savedIdea);

            if (writeStorage(KEYS.IDEAS, ideas)) {
                console.log(`[STORAGE] Idea saved: ${savedIdea.idea_id}`);
                return savedIdea;
            }
        }

        throw new Error('Failed to save idea');
    }

    function saveIdeas(ideasToSave) {
        const ideas = parseStorage(KEYS.IDEAS, []);
        const timestamp = getTimestamp();

        const savedIdeas = ideasToSave.map((idea, index) => ({
            idea_id: idea.idea_id || generateId('idea') + '_' + index,
            idea_text: idea.idea_text,
            idea_type: idea.idea_type || 'fact',
            source_raw_input_id: idea.source_raw_input_id || null,
            confidence: idea.confidence || 0,
            strength: idea.strength || 0,
            last_recalled: null,
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

    function getIdeas() {
        return parseStorage(KEYS.IDEAS, []);
    }

    function getIdea(id) {
        const ideas = getIdeas();
        return ideas.find(i => i.idea_id === id) || null;
    }

    function deleteIdea(id) {
        const ideas = getIdeas();
        const filtered = ideas.filter(idea => idea.idea_id !== id);

        if (filtered.length === ideas.length) {
            console.warn(`[STORAGE] Idea not found: ${id}`);
            return false;
        }

        // Also delete associated edges
        const edges = getEdges();
        const filteredEdges = edges.filter(e => e.from !== id && e.to !== id);
        writeStorage(KEYS.EDGES, filteredEdges);

        return writeStorage(KEYS.IDEAS, filtered);
    }

    function clearAllIdeas() {
        writeStorage(KEYS.EDGES, []); // Clear edges too
        return writeStorage(KEYS.IDEAS, []);
    }

    // ============== Graph/Edge Operations ==============

    function saveEdge(edge) {
        const edges = parseStorage(KEYS.EDGES, []);

        // Prevent exact duplicates
        const exists = edges.some(e =>
            e.from === edge.from &&
            e.to === edge.to &&
            e.type === edge.type
        );

        if (exists) {
            console.log('[STORAGE] Edge already exists, skipping');
            return null;
        }

        const newEdge = {
            id: generateId('edge'),
            from: edge.from,
            to: edge.to,
            type: edge.type, // 'supports', 'depends', 'example', 'contradicts', 'refines', 'duplicates'
            weight: edge.weight || 1.0,
            created_at: getTimestamp()
        };

        edges.push(newEdge);

        if (writeStorage(KEYS.EDGES, edges)) {
            console.log(`[STORAGE] Edge saved: ${newEdge.from} -> ${newEdge.to}`);
            return newEdge;
        }
        return null;
    }

    function getEdges() {
        return parseStorage(KEYS.EDGES, []);
    }

    function deleteEdge(id) {
        const edges = getEdges();
        const filtered = edges.filter(e => e.id !== id);
        return writeStorage(KEYS.EDGES, filtered);
    }

    // ============== Context Operations ==============

    function getContext() {
        return parseStorage(KEYS.CONTEXT, { pins: [], exclusions: [] });
    }

    function saveContext(context) {
        return writeStorage(KEYS.CONTEXT, context);
    }

    // ============== Export/Import ==============

    function exportData() {
        return {
            exported_at: getTimestamp(),
            version: '1.4', // Updated for Phases 4-6
            raw_inputs: getRawInputs(),
            ideas: getIdeas(),
            edges: getEdges(),
            context: getContext()
        };
    }

    function clearAllData() {
        try {
            localStorage.removeItem(KEYS.RAW_INPUTS);
            localStorage.removeItem(KEYS.IDEAS);
            localStorage.removeItem(KEYS.EDGES);
            localStorage.removeItem(KEYS.CONTEXT);
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
        getIdea,
        deleteIdea,
        clearAllIdeas,

        // Edges
        saveEdge,
        getEdges,
        deleteEdge,

        // Context
        getContext,
        saveContext,

        // Export/Import
        exportData,
        clearAllData,

        // Utilities
        generateId,
        getTimestamp
    };
})();
