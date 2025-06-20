import { tarkovApiClient } from "@/api/client";
import { BOSS_INFO_FRAGMENT, BOSS_SPAWNS_FRAGMENT } from "@/api/fragments";
import type { BossSpawn, MapsQueryResponse, TarkovApiError } from "@/api/types";
import { useQuery } from "@tanstack/react-query";

const BOSSES_QUERY = `
  query GetAllBosses {
    maps {
      id
      name
      bosses {
        ${BOSS_SPAWNS_FRAGMENT}
      }
    }
  }
  ${BOSS_INFO_FRAGMENT}
`;

interface BossData {
	id: string;
	name: string;
	spawnRate: number;
	maps: string[];
}

export function useTarkovBosses() {
	return useQuery<BossData[], TarkovApiError>({
		queryKey: ["tarkov", "bosses"],
		queryFn: async () => {
			const response = await tarkovApiClient<MapsQueryResponse>(BOSSES_QUERY);

			// Aggregate boss spawn data across all maps
			const bossMap = new Map<string, BossData>();

			for (const map of response.maps) {
				for (const bossSpawn of map.bosses) {
					const bossId = bossSpawn.boss.id;
					const bossName = bossSpawn.boss.name;
					const spawnChance = bossSpawn.spawnChance;

					if (bossMap.has(bossId)) {
						const existing = bossMap.get(bossId);
						if (existing) {
							existing.maps.push(map.name);
							// Use highest spawn rate across maps
							existing.spawnRate = Math.max(existing.spawnRate, spawnChance);
						}
					} else {
						bossMap.set(bossId, {
							id: bossId,
							name: bossName,
							spawnRate: spawnChance,
							maps: [map.name],
						});
					}
				}
			}

			return Array.from(bossMap.values()).sort(
				(a, b) => b.spawnRate - a.spawnRate,
			);
		},
		staleTime: 30 * 60 * 1000, // 30 minutes (boss data is relatively static)
		gcTime: 60 * 60 * 1000, // 1 hour
		refetchOnWindowFocus: false,
	});
}
