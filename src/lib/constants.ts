/**
 * Global Constants for the Election Assistant Application.
 * Centralizing these values prevents "magic strings" and makes configuration easier.
 */

export const CACHE_TTL = {
  CHAT_RESPONSE_MS: 3600000, // 1 hour
  CIVIC_INFO_MS: 86400000, // 24 hours
};

export const AI_MODELS = {
  PRIMARY_ASSISTANT: 'gemini-1.5-pro',
};

export const RATE_LIMITS = {
  DEFAULT_MAX_REQUESTS: 10,
  DEFAULT_WINDOW_MS: 60000, // 1 minute
};

export const API_ROUTES = {
  CHAT: '/api/chat',
  CIVIC_INFO: '/api/civic-info',
};
