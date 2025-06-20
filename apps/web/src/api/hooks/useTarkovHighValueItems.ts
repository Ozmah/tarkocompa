import { tarkovApiClient } from "@/api/client";
import { BASIC_ITEM_FRAGMENT, ITEM_PRICE_FRAGMENT } from "@/api/fragments";
import type { TarkovApiError, TarkovItem } from "@/api/types";
import { useQuery } from "@tanstack/react-query";

const HIGH_VALUE_ITEMS_QUERY = `
  	query GetHighValueItems($names: [String]) {
    	items(names: $names) {
      		...BasicItemInfo
      		types
      		buyFor {
        		...ItemPriceInfo
      		}
      		sellFor {
        		...ItemPriceInfo
      		}
    	}
  	}
	${BASIC_ITEM_FRAGMENT}
	${ITEM_PRICE_FRAGMENT}
`;

// Specific high-value items we want to track
const HIGH_VALUE_ITEM_NAMES = [
	"Bitcoin",
	"LEDX Skin Transilluminator",
	"Moonshine",
	"TerraGroup Labs keycard (Red)",
	"TerraGroup Labs keycard (Green)",
];

interface HighValueItemsResponse {
	items: TarkovItem[];
}

export function useTarkovHighValueItems() {
	return useQuery<TarkovItem[], TarkovApiError>({
		queryKey: ["tarkov", "high-value-items"],
		queryFn: async () => {
			const response = await tarkovApiClient<HighValueItemsResponse>(
				HIGH_VALUE_ITEMS_QUERY,
				{
					names: HIGH_VALUE_ITEM_NAMES,
				},
			);

			// Sort by price (descending) and then by name for consistency
			return response.items.sort((a, b) => {
				const priceA = a.avg24hPrice || 0;
				const priceB = b.avg24hPrice || 0;

				if (priceB !== priceA) {
					return priceB - priceA;
				}

				return a.name.localeCompare(b.name);
			});
		},
		staleTime: 5 * 60 * 1000, // 5 minutes (prices change frequently)
		gcTime: 10 * 60 * 1000, // 10 minutes
		refetchOnWindowFocus: false,
	});
}
