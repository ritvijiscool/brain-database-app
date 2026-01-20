/**
 * Validation Module
 * Input validation per documentation rules
 */

const Validation = (function () {
    const MAX_LENGTH = 10000;

    // Control characters to strip (except newlines and tabs)
    const CONTROL_CHAR_REGEX = /[\x00-\x08\x0B\x0C\x0E-\x1F]/g;

    /**
     * Validate input text
     * @param {string} text - The input text to validate
     * @returns {object} { valid: boolean, error: string|null, sanitized: string }
     */
    function validate(text) {
        // Check for null/undefined
        if (text === null || text === undefined) {
            return {
                valid: false,
                error: 'Please enter some text before submitting.',
                sanitized: null
            };
        }

        // Convert to string
        const inputText = String(text);

        // Sanitize: strip control characters
        const sanitized = inputText.replace(CONTROL_CHAR_REGEX, '');
        const charsRemoved = inputText.length - sanitized.length;

        if (charsRemoved > 0) {
            console.log(`[VALIDATE] Sanitized ${charsRemoved} control characters`);
        }

        // Check for empty/whitespace only
        if (!sanitized.trim()) {
            return {
                valid: false,
                error: 'Please enter some text before submitting.',
                sanitized: null
            };
        }

        // Check length
        if (sanitized.length > MAX_LENGTH) {
            return {
                valid: false,
                error: `Input exceeds maximum length of ${MAX_LENGTH.toLocaleString()} characters. Please submit smaller portions.`,
                sanitized: null
            };
        }

        console.log(`[VALIDATE] Input valid: ${sanitized.length} chars`);

        return {
            valid: true,
            error: null,
            sanitized: sanitized.trim()
        };
    }

    /**
     * Get character count status
     * @param {number} count - Current character count
     * @returns {object} { status: string, message: string }
     */
    function getCharCountStatus(count) {
        if (count > MAX_LENGTH) {
            return {
                status: 'error',
                message: `${count.toLocaleString()} / ${MAX_LENGTH.toLocaleString()} (exceeded)`
            };
        }

        if (count > MAX_LENGTH * 0.9) {
            return {
                status: 'warning',
                message: `${count.toLocaleString()} / ${MAX_LENGTH.toLocaleString()}`
            };
        }

        return {
            status: 'normal',
            message: `${count.toLocaleString()} / ${MAX_LENGTH.toLocaleString()}`
        };
    }

    /**
     * Check if input is valid for submission
     * @param {string} text - The input text
     * @returns {boolean}
     */
    function isValid(text) {
        return validate(text).valid;
    }

    // Public API
    return {
        validate,
        getCharCountStatus,
        isValid,
        MAX_LENGTH
    };
})();
