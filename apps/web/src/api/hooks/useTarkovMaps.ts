import { type UseQueryOptions, useQuery } from "@tanstack/react-query";
import { tarkovApiClient } from "../client";
import {
	GET_MAPS,
	GET_MAP_BY_ID,
	type GetMapByIdVariables,
	type GetMapsVariables,
} from "../queries";
import type { MapsQueryResponse, TarkovApiError, TarkovMap } from "../types";

// Query keys for maps following project conventions
export const tarkovMapsKeys = {
	all: ["tarkov-maps"] as const,
	lists: () => [...tarkovMapsKeys.all, "list"] as const,
	list: (filters: GetMapsVariables) =>
		[...tarkovMapsKeys.lists(), filters] as const,
	details: () => [...tarkovMapsKeys.all, "detail"] as const,
	detail: (id: string) => [...tarkovMapsKeys.details(), id] as const,
} as const;

// Custom hook for fetching all maps
export function useTarkovMaps(
	variables: GetMapsVariables = { lang: "en" },
	options?: Omit<
		UseQueryOptions<TarkovMap[], TarkovApiError>,
		"queryKey" | "queryFn"
	>,
) {
	return useQuery<TarkovMap[], TarkovApiError>({
		queryKey: tarkovMapsKeys.list(variables),
		queryFn: async (): Promise<TarkovMap[]> => {
			const response = await tarkovApiClient<MapsQueryResponse>(
				GET_MAPS,
				variables,
			);

			return response.maps || [];
		},
		// Cache configuration for maps (static data changes less frequently)
		staleTime: 30 * 60 * 1000, // 30 minutes - maps data changes infrequently
		gcTime: 60 * 60 * 1000, // 1 hour
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

// Hook for getting a specific map by ID
export function useTarkovMap(
	variables: GetMapByIdVariables,
	options?: Omit<
		UseQueryOptions<TarkovMap, TarkovApiError>,
		"queryKey" | "queryFn"
	>,
) {
	return useQuery<TarkovMap, TarkovApiError>({
		queryKey: tarkovMapsKeys.detail(variables.id),
		queryFn: async (): Promise<TarkovMap> => {
			const response = await tarkovApiClient<{ map: TarkovMap }>(
				GET_MAP_BY_ID,
				variables,
			);

			if (!response.map) {
				const notFoundError: TarkovApiError = {
					type: "graphql",
					message: `Map with ID ${variables.id} not found`,
				};
				throw notFoundError;
			}

			return response.map;
		},
		// Longer cache for individual map details
		staleTime: 60 * 60 * 1000, // 1 hour
		gcTime: 2 * 60 * 60 * 1000, // 2 hours
		refetchOnWindowFocus: false,
		retry: (failureCount, error) => {
			const apiError = error as TarkovApiError;

			if (apiError.type === "rate_limit") {
				return false;
			}

			if (apiError.type === "network" && failureCount < 3) {
				return true;
			}

			return false;
		},
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
		...options,
	});
}
