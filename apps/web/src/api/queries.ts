import { gql } from "graphql-request";

// Correct query structure based on API testing
export const GET_AMMO_ITEMS = gql`
  query GetAmmoItems($limit: Int, $offset: Int, $lang: LanguageCode) {
    items(limit: $limit, offset: $offset, type: ammo, lang: $lang) {
      id
      name
      shortName
      iconLink
      avg24hPrice
      basePrice
      wikiLink
      weight
      width
      height
      types
      properties {
        ... on ItemPropertiesAmmo {
          damage
          penetrationPower
          armorDamage
          fragmentationChance
          ricochetChance
          initialSpeed
          caliber
        }
      }
    }
  }
`;

// Maps queries
export const GET_MAPS = gql`
  query GetMaps($lang: LanguageCode) {
    maps(lang: $lang) {
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
          imagePosterLink
        }
        spawnChance
        spawnLocations {
          name
          chance
        }
        escorts {
          boss {
            id
            name
            normalizedName
          }
          amount {
            count
            chance
          }
        }
        spawnTime
        spawnTimeRandom
        spawnTrigger
      }
      extracts {
        id
        name
        faction
      }
    }
  }
`;

export const GET_MAP_BY_ID = gql`
  query GetMapById($id: ID!, $lang: LanguageCode) {
    map(id: $id, lang: $lang) {
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
          imagePosterLink
          health {
            bodyPart
            max
          }
        }
        spawnChance
        spawnLocations {
          name
          chance
          spawnKey
        }
        escorts {
          boss {
            id
            name
            normalizedName
          }
          amount {
            count
            chance
          }
        }
        spawnTime
        spawnTimeRandom
        spawnTrigger
      }
      extracts {
        id
        name
        faction
        requirement
      }
      accessKeys {
        id
        name
        shortName
        iconLink
      }
      accessKeysMinPlayerLevel
    }
  }
`;

// Query variables types
export interface GetAmmoItemsVariables {
	limit?: number;
	offset?: number;
	lang?: "en" | "ru" | "de" | "fr" | "es" | "zh" | "cs";
}

export interface SearchAmmoByNameVariables {
	name: string;
	limit?: number;
	lang?: "en" | "ru" | "de" | "fr" | "es" | "zh" | "cs";
}

export interface GetAmmoByCaliberVariables {
	caliber: string;
	limit?: number;
	lang?: "en" | "ru" | "de" | "fr" | "es" | "zh" | "cs";
}

// Maps query variables
export interface GetMapsVariables {
	lang?: "en" | "ru" | "de" | "fr" | "es" | "zh" | "cs";
}

export interface GetMapByIdVariables {
	id: string;
	lang?: "en" | "ru" | "de" | "fr" | "es" | "zh" | "cs";
}
