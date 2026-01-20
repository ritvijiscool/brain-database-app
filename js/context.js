/**
 * Context Module
 * Handles relevance scoring, retrieval ranking, and search
 */

const Context = (function () {

    /**
     * Calculate relevance score for an idea against a query
     */
    function scoreIdea(idea, normalizedQuery, activeContextId = null) {
        let score = 0;
        const text = idea.idea_text.toLowerCase();

        // 1. Keyword Match (Highest Weight)
        if (text.includes(normalizedQuery)) {
            score += 10;
            // Exact match bonus
            if (text === normalizedQuery) score += 5;
        }

        // 2. Context Connectivity
        if (activeContextId) {
            const links = Graph.getLinksFor(activeContextId);
            const isLinked = links.some(l => l.target.idea_id === idea.idea_id);
            if (isLinked) score += 5;
        }

        // 3. Confidence Boost (Prefer verified truth)
        if (idea.confidence > 1) score += 1;

        return score;
    }

    /**
     * Find relevant ideas
     */
    function findRelevant(query, activeContextId = null) {
        const ideas = Storage.getIdeas();
        const context = Storage.getContext(); // For pins/exclusions
        const normalizedQuery = query.toLowerCase().trim();

        if (!normalizedQuery && !activeContextId) return [];

        const scored = ideas.map(idea => {
            // Check exclusion
            if (context.exclusions.includes(idea.idea_id)) return null;

            // Check pins
            const isPinned = context.pins.includes(idea.idea_id);

            const score = isPinned ? 999 : scoreIdea(idea, normalizedQuery, activeContextId);

            return { idea, score };
        }).filter(item => item && item.score > 0);

        // Sort by score desc
        scored.sort((a, b) => b.score - a.score);

        return scored.map(item => item.idea);
    }

    /**
     * Toggle Pin
     */
    function togglePin(ideaId) {
        const ctx = Storage.getContext();
        const index = ctx.pins.indexOf(ideaId);

        if (index > -1) {
            ctx.pins.splice(index, 1);
        } else {
            ctx.pins.push(ideaId);
        }

        Storage.saveContext(ctx);
        return ctx.pins.includes(ideaId);
    }

    /**
     * Toggle Exclusion
     */
    function toggleExclusion(ideaId) {
        const ctx = Storage.getContext();
        const index = ctx.exclusions.indexOf(ideaId);

        if (index > -1) {
            ctx.exclusions.splice(index, 1);
        } else {
            ctx.exclusions.push(ideaId);
        }

        Storage.saveContext(ctx);
        return ctx.exclusions.includes(ideaId);
    }

    return {
        findRelevant,
        scoreIdea,
        togglePin,
        toggleExclusion
    };
})();
