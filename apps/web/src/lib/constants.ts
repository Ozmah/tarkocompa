// Global constants for the Tarkompa application

// Tarkov API configuration
export const TARKOV_API_ENDPOINT = "https://api.tarkov.dev/graphql";

// Boss filtering configuration
export const EXCLUDED_BOSS_NAMES = ["rogue", "usec", "bear", "raider"];

// Cache configuration (in milliseconds)
export const CACHE_TIMES = {
	MAPS: 30 * 60 * 1000, // 30 minutes - maps data changes infrequently
	MAPS_DETAIL: 60 * 60 * 1000, // 1 hour - individual map details
	AMMO: 5 * 60 * 1000, // 5 minutes - ammo prices change frequently
	ITEMS: 10 * 60 * 1000, // 10 minutes - general items
} as const;

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
	MAX_TOKENS: 100,
	REFILL_RATE: 10, // tokens per second
	RETRY_ATTEMPTS: 3,
	RETRY_DELAY_BASE: 1000, // milliseconds
	RETRY_DELAY_MAX: 30000, // milliseconds
} as const;
