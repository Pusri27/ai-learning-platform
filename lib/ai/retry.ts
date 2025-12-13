/**
 * AI API Retry Utility with Exponential Backoff
 * Handles rate limiting (429) errors gracefully
 */

export interface RetryOptions {
    maxRetries?: number;
    initialDelayMs?: number;
    maxDelayMs?: number;
}

export class AIRateLimitError extends Error {
    public retryAfterMs?: number;

    constructor(message: string, retryAfterMs?: number) {
        super(message);
        this.name = 'AIRateLimitError';
        this.retryAfterMs = retryAfterMs;
    }
}

export class AIQuotaExceededError extends Error {
    constructor(message: string = 'API quota telah habis. Silakan coba lagi nanti atau hubungi administrator.') {
        super(message);
        this.name = 'AIQuotaExceededError';
    }
}

/**
 * Delay helper with exponential backoff
 */
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Extract retry delay from Gemini API error
 */
function extractRetryDelay(error: any): number | undefined {
    if (error?.errorDetails) {
        for (const detail of error.errorDetails) {
            if (detail['@type'] === 'type.googleapis.com/google.rpc.RetryInfo') {
                const delayStr = detail.retryDelay;
                if (delayStr) {
                    // Parse "22s" or "22.321s" format
                    const match = delayStr.match(/(\d+\.?\d*)/);
                    if (match) {
                        return Math.ceil(parseFloat(match[1]) * 1000);
                    }
                }
            }
        }
    }
    return undefined;
}

/**
 * Check if error indicates quota is completely exhausted (limit: 0)
 */
function isQuotaExhausted(error: any): boolean {
    const message = error?.message || '';
    return message.includes('limit: 0') ||
        (message.includes('quota') && message.includes('exceeded'));
}

/**
 * Retry wrapper with exponential backoff for AI API calls
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    options: RetryOptions = {}
): Promise<T> {
    const {
        maxRetries = 3,
        initialDelayMs = 1000,
        maxDelayMs = 30000
    } = options;

    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await fn();
        } catch (error: any) {
            lastError = error;

            // Check if quota is completely exhausted
            if (isQuotaExhausted(error)) {
                throw new AIQuotaExceededError(
                    'Kuota API AI sudah habis untuk hari ini. Fitur AI akan tersedia kembali besok, atau Anda bisa menghubungi administrator untuk upgrade.'
                );
            }

            // Check if it's a rate limit error (429)
            const isRateLimitError = error?.status === 429 ||
                error?.statusText === 'Too Many Requests' ||
                error?.message?.includes('429');

            if (!isRateLimitError) {
                throw error; // Non-retryable error
            }

            if (attempt === maxRetries) {
                throw new AIRateLimitError(
                    'AI sedang sibuk. Silakan tunggu beberapa saat dan coba lagi.',
                    extractRetryDelay(error)
                );
            }

            // Calculate delay with exponential backoff
            const retryAfter = extractRetryDelay(error);
            const exponentialDelay = initialDelayMs * Math.pow(2, attempt);
            const jitter = Math.random() * 1000; // Add random jitter
            const delayTime = Math.min(
                retryAfter || exponentialDelay + jitter,
                maxDelayMs
            );

            console.log(`Rate limited. Retrying in ${delayTime}ms (attempt ${attempt + 1}/${maxRetries})`);
            await delay(delayTime);
        }
    }

    throw lastError;
}

/**
 * User-friendly error messages for AI errors
 */
export function getAIErrorMessage(error: any): string {
    if (error instanceof AIQuotaExceededError) {
        return error.message;
    }

    if (error instanceof AIRateLimitError) {
        return error.message;
    }

    const message = error?.message || '';

    if (message.includes('429') || message.includes('Too Many Requests')) {
        return 'AI sedang sibuk. Silakan tunggu beberapa saat dan coba lagi.';
    }

    if (message.includes('quota') || message.includes('limit')) {
        return 'Kuota API AI sudah habis. Silakan hubungi administrator.';
    }

    if (message.includes('API key') || message.includes('authentication')) {
        return 'Konfigurasi AI belum lengkap. Silakan hubungi administrator.';
    }

    return 'Terjadi kesalahan pada AI. Silakan coba lagi nanti.';
}
