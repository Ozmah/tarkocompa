// Temporary test script to debug maps API connection
import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient("https://api.tarkov.dev/graphql");

const testQuery = `
  query TestMaps {
    maps(lang: en) {
      id
      name
      normalizedName
      wiki
      description
      raidDuration
      players
      minPlayerLevel
      maxPlayerLevel
      bosses {
        boss {
          id
          name
          normalizedName
          imagePortraitLink
        }
        spawnChance
        spawnLocations {
          name
          chance
        }
      }
      extracts {
        id
        name
        faction
      }
    }
  }
`;

async function testMapsAPI() {
	try {
		console.log("Testing Tarkov Maps API...");
		const response = await client.request(testQuery);

		console.log("✅ API Response successful!");
		console.log("Total maps:", response.maps?.length || 0);

		if (response.maps && response.maps.length > 0) {
			const firstMap = response.maps[0];
			console.log("\n📍 First map sample:");
			console.log("- Name:", firstMap.name);
			console.log("- Players:", firstMap.players);
			console.log("- Duration:", firstMap.raidDuration);
			console.log("- Bosses count:", firstMap.bosses?.length || 0);
			console.log("- Extracts count:", firstMap.extracts?.length || 0);

			if (firstMap.bosses && firstMap.bosses.length > 0) {
				const firstBoss = firstMap.bosses[0];
				console.log("\n👹 First boss sample:");
				console.log("- Boss name:", firstBoss.boss.name);
				console.log("- Spawn chance:", firstBoss.spawnChance);
				console.log(
					"- Spawn locations:",
					firstBoss.spawnLocations?.length || 0,
				);
			}
		}
	} catch (error) {
		console.error("❌ API Error:", error.message);
		console.error("Error details:", error);
	}
}

testMapsAPI();
