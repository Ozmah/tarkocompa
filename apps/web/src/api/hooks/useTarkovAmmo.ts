import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { rateLimiter, tarkovApiClient } from "../client";
import { GET_AMMO_ITEMS, type GetAmmoItemsVariables } from "../queries";
import type { AmmoQueryResponse, TarkovAmmo, TarkovApiError } from "../types";

// Query keys following project conventions
export const tarkovAmmoKeys = {
	all: ["tarkov-ammo"] as const,
	lists: () => [...tarkovAmmoKeys.all, "list"] as const,
	list: (filters: GetAmmoItemsVariables) =>
		[...tarkovAmmoKeys.lists(), filters] as const,
	details: () => [...tarkovAmmoKeys.all, "detail"] as const,
	detail: (id: string) => [...tarkovAmmoKeys.details(), id] as const,
} as const;

// Custom hook for fetching ammo data with rate limiting and error handling
export function useTarkovAmmo(
	variables: GetAmmoItemsVariables = { limit: 10, lang: "en" },
	options?: Omit<
		UseQueryOptions<TarkovAmmo[], TarkovApiError>,
		"queryKey" | "queryFn"
	>,
) {
	return useQuery<TarkovAmmo[], TarkovApiError>({
		queryKey: tarkovAmmoKeys.list(variables),
		queryFn: async (): Promise<TarkovAmmo[]> => {
			// Check rate limit before making request
			if (!rateLimiter.canMakeRequest()) {
				const error: TarkovApiError = {
					type: "rate_limit",
					message:
						"Rate limit exceeded. Please wait before making another request.",
				};
				throw error;
			}

			try {
				const response = await tarkovApiClient.request<AmmoQueryResponse>(
					GET_AMMO_ITEMS,
					variables,
				);

				return response.items || [];
			} catch (error) {
				// Enhanced error handling
				if (error instanceof Error) {
					if (error.message.includes("fetch")) {
						const apiError: TarkovApiError = {
							type: "network",
							message: "Network error: Unable to connect to Tarkov API",
						};
						throw apiError;
					}

					const apiError: TarkovApiError = {
						type: "graphql",
						message: error.message,
					};
					throw apiError;
				}

				const unknownError: TarkovApiError = {
					type: "unknown",
					message: "An unexpected error occurred",
				};
				throw unknownError;
			}
		},
		// Default cache configuration following project guidelines
		staleTime: 5 * 60 * 1000, // 5 minutes - ammo data changes frequently with prices
		gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
		refetchOnWindowFocus: false,
		retry: (failureCount, error) => {
			// Custom retry logic based on error type
			const apiError = error as TarkovApiError;

			if (apiError.type === "rate_limit") {
				return false; // Don't retry rate limit errors
			}

			if (apiError.type === "network" && failureCount < 3) {
				return true; // Retry network errors up to 3 times
			}

			return false;
		},
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
		...options,
	});
}

// Hook for getting top penetration ammo (useful for dashboard)
export function useTarkovTopAmmo(
	limit = 10,
	options?: Omit<
		UseQueryOptions<TarkovAmmo[], TarkovApiError>,
		"queryKey" | "queryFn"
	>,
) {
	return useTarkovAmmo(
		{ limit, lang: "en" },
		{
			// Longer cache time for "top" lists as they change less frequently
			staleTime: 30 * 60 * 1000, // 30 minutes
			gcTime: 60 * 60 * 1000, // 1 hour
			...options,
		},
	);
}
