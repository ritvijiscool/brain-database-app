/**
 * Recall Module
 * Handles memory strength dynamics and contextual recall prompts
 */

const Recall = (function () {
    // Memory Strength Stages
    const STAGES = {
        0: 'New',
        1: 'Sprouting',
        2: 'Established',
        3: 'Deep Rooted'
    };

    /**
     * Calculate next review or "Health" decay logic
     * Simple linear decay for v1 to avoid complex SM-2 math
     */
    function checkHealth(idea) {
        // Just return current strength label
        return STAGES[idea.strength] || STAGES[0];
    }

    /**
     * Update strength based on interaction
     * @param {string} ideaId 
     * @param {boolean} success - True if recalled/used, False if failed
     */
    function updateStrength(ideaId, success) {
        const idea = Storage.getIdea(ideaId);
        if (!idea) return;

        let newStrength = idea.strength || 0;

        if (success) {
            // Gradual increase, max 3
            if (newStrength < 3) newStrength++;
        } else {
            // Penalty for failure, min 0
            if (newStrength > 0) newStrength--;
        }

        const updatedIdea = {
            ...idea,
            strength: newStrength,
            last_recalled: Storage.getTimestamp()
        };

        Storage.saveIdea(updatedIdea);
        return updatedIdea;
    }

    /**
     * Get items due for review
     * Strategy: Random sample of 'New' or 'Sprouting' items
     * Contextual trigger: We can also pass a context ID to get related items
     */
    function getPrompts(count = 3, contextId = null) {
        const ideas = Storage.getIdeas();

        // If context provided, prefer linked items
        let candidates = ideas;

        if (contextId) {
            const links = Graph.getLinksFor(contextId);
            const linkedIds = links.map(l => l.target.idea_id);
            // Get ideas linked to current context that are NOT the current context
            const related = ideas.filter(i => linkedIds.includes(i.idea_id));
            if (related.length > 0) candidates = related;
        }

        // Filter: meaningful ideas only (strength < 3 preferred for review)
        candidates = candidates.filter(i => (i.strength || 0) < 3);

        // Shuffle
        const shuffled = candidates.sort(() => 0.5 - Math.random());

        return shuffled.slice(0, count);
    }

    return {
        updateStrength,
        checkHealth,
        getPrompts,
        STAGES
    };
})();
