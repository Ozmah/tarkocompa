import { RATE_LIMIT_CONFIG, TARKOV_API_ENDPOINT } from "@/lib/constants";
import { GraphQLClient } from "graphql-request";

// Create GraphQL client with default configuration
export const tarkovApiClient = new GraphQLClient(TARKOV_API_ENDPOINT, {
	headers: {
		"Content-Type": "application/json",
	},
});

// Rate limiting class following project guidelines
class TarkovApiRateLimiter {
	private tokens: number;
	private readonly maxTokens: number = RATE_LIMIT_CONFIG.MAX_TOKENS;
	private readonly refillRate: number = RATE_LIMIT_CONFIG.REFILL_RATE;
	private lastRefill: number = Date.now();

	constructor() {
		this.tokens = this.maxTokens;
	}

	canMakeRequest(): boolean {
		this.refillTokens();
		if (this.tokens >= 1) {
			this.tokens--;
			return true;
		}
		return false;
	}

	private refillTokens(): void {
		const now = Date.now();
		const timePassed = (now - this.lastRefill) / 1000;
		this.tokens = Math.min(
			this.maxTokens,
			this.tokens + timePassed * this.refillRate,
		);
		this.lastRefill = now;
	}
}

export const rateLimiter = new TarkovApiRateLimiter();
