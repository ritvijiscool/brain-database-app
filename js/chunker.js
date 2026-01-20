/**
 * Chunker Module
 * Rule-based chunking engine - splits text into atomic ideas
 */

const Chunker = (function () {
    // Idea types per documentation
    const IDEA_TYPES = ['fact', 'definition', 'cause', 'example', 'procedure', 'question'];

    // Type classification patterns
    const TYPE_PATTERNS = {
        definition: [
            /\bis\s+defined\s+as\b/i,
            /\bmeans\s+that\b/i,
            /\brefers\s+to\b/i,
            /\bis\s+a\s+type\s+of\b/i,
            /\bis\s+the\s+(?:process|act|state)\s+of\b/i,
            /^[A-Z][a-z]+\s+is\s+a\b/i,  // "X is a ..."
            /^[A-Z][a-z]+\s+are\s+/i      // "X are ..."
        ],
        cause: [
            /\bbecause\b/i,
            /\bcauses?\b/i,
            /\bleads?\s+to\b/i,
            /\bresults?\s+in\b/i,
            /\bdue\s+to\b/i,
            /\bas\s+a\s+result\b/i,
            /\btherefore\b/i,
            /\bconsequently\b/i,
            /\bsince\b/i
        ],
        example: [
            /\bfor\s+example\b/i,
            /\bsuch\s+as\b/i,
            /\be\.g\.\b/i,
            /\bfor\s+instance\b/i,
            /\blike\s+when\b/i,
            /\bis\s+an\s+example\s+of\b/i
        ],
        procedure: [
            /\bto\s+do\s+this\b/i,
            /\bsteps?\s*:/i,
            /\bfirst\s*,?\s*(?:you|we)?\s*(?:need|should|must|have)\b/i,
            /\bhow\s+to\b/i,
            /\bin\s+order\s+to\b/i,
            /^\d+\.\s+/,  // Numbered steps
            /^step\s+\d+/i
        ],
        question: [
            /\?$/,
            /^(?:what|why|how|when|where|who|which|can|could|would|should|is|are|do|does)\s+/i
        ]
    };

    // Splitting patterns
    const SENTENCE_ENDINGS = /([.!?])\s+/g;
    const COMPOUND_CONJUNCTIONS = /\s+(and|but|however|although|whereas|while)\s+/gi;

    // Thresholds for failure detection
    const UNDER_CHUNK_WORD_LIMIT = 30;
    const OVER_CHUNK_WORD_LIMIT = 5;

    /**
     * Count words in text
     */
    function countWords(text) {
        return text.trim().split(/\s+/).filter(w => w.length > 0).length;
    }

    /**
     * Split text into sentences
     */
    function splitIntoSentences(text) {
        // Replace sentence endings with marker, then split
        const sentences = text
            .replace(SENTENCE_ENDINGS, '$1|||')
            .split('|||')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        return sentences;
    }

    /**
     * Attempt to split compound sentences
     */
    function splitCompound(sentence) {
        const wordCount = countWords(sentence);

        // Only try to split if sentence is long enough
        if (wordCount <= UNDER_CHUNK_WORD_LIMIT) {
            return [sentence];
        }

        // Try splitting on major conjunctions
        const parts = sentence.split(COMPOUND_CONJUNCTIONS);

        // If we got meaningful splits, return them
        if (parts.length > 1) {
            // Recombine: even indices are content, odd indices are conjunctions
            const results = [];
            for (let i = 0; i < parts.length; i += 2) {
                let part = parts[i].trim();

                // Skip empty parts
                if (!part) continue;

                // Add conjunction to next part if it exists
                if (i + 1 < parts.length && parts[i + 1]) {
                    // Keep the part as-is (conjunction was a separator)
                }

                if (part.length > 0) {
                    results.push(part);
                }
            }

            return results.filter(r => r.length > 0);
        }

        return [sentence];
    }

    /**
     * Classify idea type based on text patterns
     */
    function classifyType(text) {
        // Check each type's patterns
        for (const [type, patterns] of Object.entries(TYPE_PATTERNS)) {
            for (const pattern of patterns) {
                if (pattern.test(text)) {
                    return type;
                }
            }
        }

        // Default to fact
        return 'fact';
    }

    /**
     * Detect chunking issues
     */
    function detectIssues(chunks) {
        const issues = [];

        chunks.forEach((chunk, index) => {
            const wordCount = countWords(chunk.idea_text);

            // Under-chunking detection
            if (wordCount > UNDER_CHUNK_WORD_LIMIT) {
                issues.push({
                    type: 'under-chunk',
                    chunkIndex: index,
                    message: `Idea ${index + 1} may contain multiple concepts (${wordCount} words). Consider splitting it.`,
                    wordCount: wordCount
                });
            }

            // Over-chunking detection
            if (wordCount < OVER_CHUNK_WORD_LIMIT) {
                // Check if it looks like a fragment
                const text = chunk.idea_text.toLowerCase();
                const fragments = ['because', 'for example', 'such as', 'however', 'therefore'];
                const isFragment = fragments.some(f => text.startsWith(f)) ||
                    !text.match(/[.!?]$/) && wordCount < 3;

                if (isFragment) {
                    issues.push({
                        type: 'over-chunk',
                        chunkIndex: index,
                        message: `Idea ${index + 1} may be incomplete (${wordCount} words). Consider merging with another idea.`,
                        wordCount: wordCount
                    });
                }
            }
        });

        return issues;
    }

    /**
     * Main chunking function
     * @param {string} text - Raw input text
     * @param {string} sourceId - Source raw input ID
     * @returns {object} { chunks: array, issues: array }
     */
    function chunk(text, sourceId) {
        console.log('[CHUNKER] Starting chunking process');

        // Step 1: Split into sentences
        const sentences = splitIntoSentences(text);
        console.log(`[CHUNKER] Found ${sentences.length} sentences`);

        // Step 2: Further split compound sentences
        let allChunks = [];
        sentences.forEach(sentence => {
            const parts = splitCompound(sentence);
            allChunks = allChunks.concat(parts);
        });
        console.log(`[CHUNKER] After compound splitting: ${allChunks.length} chunks`);

        // Step 3: Create idea objects with classification
        const ideas = allChunks.map((text, index) => ({
            idea_id: `${sourceId}_chunk_${index}`,
            idea_text: text,
            idea_type: classifyType(text),
            source_raw_input_id: sourceId,
            confidence: 'unknown',
            linked: false
        }));

        // Step 4: Detect issues
        const issues = detectIssues(ideas);

        if (issues.length > 0) {
            console.log(`[CHUNKER] Detected ${issues.length} potential issues`);
        }

        return {
            chunks: ideas,
            issues: issues
        };
    }

    /**
     * Get available idea types
     */
    function getIdeaTypes() {
        return [...IDEA_TYPES];
    }

    // Public API
    return {
        chunk,
        classifyType,
        getIdeaTypes,
        countWords,
        UNDER_CHUNK_WORD_LIMIT,
        OVER_CHUNK_WORD_LIMIT
    };
})();
