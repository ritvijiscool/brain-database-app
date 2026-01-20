/**
 * Graph Module
 * Handles Linking strategy, traversal, and network health
 */

const Graph = (function () {
    const LINK_TYPES = ['supports', 'depends', 'example', 'contradicts', 'refines', 'duplicates'];

    /**
     * Create a link between two ideas
     */
    function addLink(fromId, toId, type) {
        if (!LINK_TYPES.includes(type)) {
            console.error(`[GRAPH] Invalid link type: ${type}`);
            return false;
        }

        if (fromId === toId) {
            console.error('[GRAPH] Cannot link idea to itself');
            return false;
        }

        // Check for existing link to prevent duplicates
        const edges = Storage.getEdges();
        const existing = edges.find(e => e.from === fromId && e.to === toId && e.type === type);

        if (existing) {
            console.log('[GRAPH] Link already exists');
            return existing;
        }

        const edge = Storage.saveEdge({
            from: fromId,
            to: toId,
            type: type
        });

        // If 'contradicts' or 'duplicates', it's bidirectional
        if (type === 'contradicts' || type === 'duplicates') {
            Storage.saveEdge({
                from: toId,
                to: fromId,
                type: type
            });
        }

        // Update 'linked' status on ideas
        updateLinkStatus(fromId);
        updateLinkStatus(toId);

        return edge;
    }

    /**
     * Remove a link
     */
    function removeLink(edgeId) {
        const edges = Storage.getEdges();
        const edge = edges.find(e => e.id === edgeId);

        if (Storage.deleteEdge(edgeId)) {
            if (edge) {
                updateLinkStatus(edge.from);
                updateLinkStatus(edge.to);
            }
            return true;
        }
        return false;
    }

    /**
     * Get all connected links for an idea
     */
    function getLinksFor(ideaId) {
        const edges = Storage.getEdges();
        const ideas = Storage.getIdeas();

        // Outgoing
        const outgoing = edges
            .filter(e => e.from === ideaId)
            .map(e => ({
                ...e,
                direction: 'outgoing',
                target: ideas.find(i => i.idea_id === e.to)
            }));

        // Incoming
        const incoming = edges
            .filter(e => e.to === ideaId)
            .map(e => ({
                ...e,
                direction: 'incoming',
                target: ideas.find(i => i.idea_id === e.from)
            }));

        return [...outgoing, ...incoming].filter(l => l.target); // Ensure target exists
    }

    /**
     * Helper to update 'linked' boolean on Idea
     */
    function updateLinkStatus(ideaId) {
        const edges = Storage.getEdges();
        const hasLinks = edges.some(e => e.from === ideaId || e.to === ideaId);

        const idea = Storage.getIdea(ideaId);
        if (idea && idea.linked !== hasLinks) {
            idea.linked = hasLinks;
            Storage.saveIdea(idea);
        }
    }

    /**
     * Detect exact matches for deduplication
     */
    function findDuplicateCandidates(text) {
        const ideas = Storage.getIdeas();
        const normalized = text.toLowerCase().trim();

        return ideas.filter(i =>
            i.idea_text.toLowerCase().trim() === normalized
        );
    }

    /**
     * Find orphans (Unlinked ideas)
     */
    function getOrphans() {
        const ideas = Storage.getIdeas();
        return ideas.filter(i => !i.linked);
    }

    return {
        addLink,
        removeLink,
        getLinksFor,
        findDuplicateCandidates,
        getOrphans,
        LINK_TYPES
    };
})();
