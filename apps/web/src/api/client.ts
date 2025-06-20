import type { TarkovApiError } from "@/api/types";
import { RATE_LIMIT_CONFIG, TARKOV_API_ENDPOINT } from "@/lib/constants";
import { GraphQLClient } from "graphql-request";

// Create GraphQL client with default configuration
const graphqlClient = new GraphQLClient(TARKOV_API_ENDPOINT, {
	headers: {
		"Content-Type": "application/json",
	},
});

// API client function that handles rate limiting and error handling
export async function tarkovApiClient<T>(
	query: string,
	variables?: Record<string, unknown>,
): Promise<T> {
	// Check rate limit
	if (!rateLimiter.canMakeRequest()) {
		const error: TarkovApiError = {
			type: "rate_limit",
			message: "Rate limit exceeded. Please try again later.",
		};
		throw error;
	}

	try {
		const response = await graphqlClient.request<T>(query, variables);
		return response;
	} catch (error) {
		// Handle different types of errors
		if (error instanceof Error) {
			if (error.message.includes("fetch")) {
				const tarkovError: TarkovApiError = {
					type: "network",
					message: "Network error. Please check your connection.",
				};
				throw tarkovError;
			}

			// GraphQL errors
			const tarkovError: TarkovApiError = {
				type: "graphql",
				message: error.message,
			};
			throw tarkovError;
		}

		// Unknown error
		const tarkovError: TarkovApiError = {
			type: "unknown",
			message: "An unknown error occurred",
		};
		throw tarkovError;
	}
}

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
