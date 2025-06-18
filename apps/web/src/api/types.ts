// Base types for Tarkov API following project conventions

export interface TarkovItem {
	id: string;
	bsgId?: string;
	name: string;
	normalizedName?: string;
	shortName?: string;
	description?: string;
	weight?: number;
	width: number;
	height: number;
	iconLink?: string;
	avg24hPrice?: number;
	basePrice?: number;
	wikiLink?: string;
}

// Properties interface matching the API structure
export interface ItemPropertiesAmmo {
	damage?: number;
	penetrationPower?: number;
	armorDamage?: number;
	fragmentationChance?: number;
	ricochetChance?: number;
	initialSpeed?: number;
	caliber?: string;
}

export interface TarkovAmmo extends TarkovItem {
	types?: string[];
	properties?: ItemPropertiesAmmo;
}

export interface AmmoBallistics {
	distance: number;
	damage: number;
	penetrationPower: number;
	speed: number;
	timeOfFlight: number;
}

export interface TarkovItemPrice {
	vendor: TarkovVendor;
	price: number;
	currency: string;
	priceRUB: number;
}

export interface TarkovVendor {
	name: string;
	normalizedName: string;
}

// API Response types
export interface TarkovApiResponse<T> {
	data: T;
	errors?: Array<{
		message: string;
		locations: Array<{
			line: number;
			column: number;
		}>;
		path: string[];
	}>;
}

export interface AmmoQueryResponse {
	items: TarkovAmmo[];
}

// Error types for better error handling
export type TarkovApiErrorType =
	| "network"
	| "graphql"
	| "rate_limit"
	| "unknown";

export interface TarkovApiError {
	type: TarkovApiErrorType;
	message: string;
	graphqlErrors?: Array<{
		message: string;
		locations?: Array<{ line: number; column: number }>;
		path?: string[];
	}>;
}

// Map types based on API documentation
export interface TarkovMap {
	id: string;
	tarkovDataId?: string;
	name: string;
	normalizedName: string;
	wiki?: string;
	description?: string;
	enemies?: string[];
	raidDuration?: number;
	players?: string;
	bosses: BossSpawn[];
	nameId?: string;
	accessKeys?: TarkovItem[];
	accessKeysMinPlayerLevel?: number;
	minPlayerLevel?: number;
	maxPlayerLevel?: number;
	spawns?: MapSpawn[];
	extracts?: MapExtract[];
	transits?: MapTransit[];
	locks?: Lock[];
	switches?: MapSwitch[];
	hazards?: MapHazard[];
	lootContainers?: LootContainerPosition[];
	lootLoose?: LootLoosePosition[];
	stationaryWeapons?: StationaryWeaponPosition[];
	artillery?: MapArtillerySettings;
}

export interface BossSpawn {
	boss: MobInfo;
	spawnChance: number;
	spawnLocations: BossSpawnLocation[];
	escorts: BossEscort[];
	spawnTime?: number;
	spawnTimeRandom?: boolean;
	spawnTrigger?: string;
	switch?: MapSwitch;
}

export interface MobInfo {
	id: string;
	name: string;
	normalizedName: string;
	imagePortraitLink?: string;
	imagePosterLink?: string;
	health?: Array<{
		bodyPart: string;
		max: number;
	}>;
}

export interface BossSpawnLocation {
	name: string;
	chance: number;
	spawnKey?: string;
}

export interface BossEscort {
	boss: MobInfo;
	amount: Array<{
		count: number;
		chance: number;
	}>;
}

// Additional map-related interfaces (simplified for now)
export interface MapSpawn {
	zoneName?: string;
	position: Position;
	sides: string[];
	categories: string[];
}

export interface MapExtract {
	id: string;
	name: string;
	faction?: string;
	switches?: MapSwitch[];
	position?: Position;
}

export interface MapTransit {
	source: string;
	target: string;
	requirement?: string;
	activatedBy?: MapSwitch[];
}

export interface MapSwitch {
	id: string;
	name: string;
	position: Position;
	activatedBy?: string;
	switchType?: string;
}

export interface Lock {
	position: Position;
	key?: TarkovItem;
	needsPower?: boolean;
	lockType?: string;
}

export interface MapHazard {
	hazardType: string;
	name: string;
	position: Position;
}

export interface Position {
	x: number;
	y: number;
	z: number;
}

export interface LootContainerPosition {
	lootContainer: LootContainer;
	position: Position;
}

export interface LootLoosePosition {
	item: TarkovItem;
	position: Position;
	probability: number;
}

export interface StationaryWeaponPosition {
	stationaryWeapon: StationaryWeapon;
	position: Position;
}

export interface MapArtillerySettings {
	delay: number;
	duration: number;
}

// Placeholder interfaces for complex types
export interface LootContainer {
	id: string;
	name: string;
}

export interface StationaryWeapon {
	id: string;
	name: string;
}

// API Response types for maps
export interface MapsQueryResponse {
	maps: TarkovMap[];
}
