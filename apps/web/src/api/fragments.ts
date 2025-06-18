// GraphQL fragments for reusable field selections following project conventions

export const BASIC_ITEM_FRAGMENT = `
  fragment BasicItemInfo on Item {
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
  }
`;

export const AMMO_STATS_FRAGMENT = `
  fragment AmmoStats on Ammo {
    damage
    penetrationPower
    armorDamage
    fragmentationChance
    ricochetChance
    initialSpeed
    caliber
  }
`;

export const AMMO_BALLISTICS_FRAGMENT = `
  fragment AmmoBallistics on Ammo {
    ballistics {
      distance
      damage
      penetrationPower
      speed
      timeOfFlight
    }
  }
`;

export const VENDOR_FRAGMENT = `
  fragment VendorInfo on Vendor {
    name
    normalizedName
  }
`;

export const ITEM_PRICE_FRAGMENT = `
  fragment ItemPriceInfo on ItemPrice {
    vendor {
      ...VendorInfo
    }
    price
    currency
    priceRUB
  }
  ${VENDOR_FRAGMENT}
`;

// Complete ammo fragment combining all relevant data
export const COMPLETE_AMMO_FRAGMENT = `
  fragment CompleteAmmoInfo on Item {
    ...BasicItemInfo
    ... on Ammo {
      ...AmmoStats
      buyFor {
        ...ItemPriceInfo
      }
      sellFor {
        ...ItemPriceInfo
      }
    }
  }
  ${BASIC_ITEM_FRAGMENT}
  ${AMMO_STATS_FRAGMENT}
  ${ITEM_PRICE_FRAGMENT}
`;
