import { useTarkovMaps } from "@/api/hooks/useTarkovMaps";
import type { BossSpawn, TarkovMap } from "@/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EXCLUDED_BOSS_NAMES } from "@/lib/constants";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Clock, ExternalLink, Key, Loader2, MapPin, Skull, Users } from "lucide-react";

export const Route = createFileRoute("/maps")({
	component: MapsComponent,
});

function MapsComponent() {
	const { data: maps, isLoading, error } = useTarkovMaps();

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<section className="bg-gradient-to-br from-background to-secondary py-12">
				<div className="mx-auto max-w-screen-2xl px-4 text-center sm:px-6 lg:px-8">
					<h1 className="mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text font-[family-name:var(--font-heading)] font-bold text-4xl text-transparent md:text-5xl">
						Mapas de Tarkov
					</h1>
					<p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
						Información detallada de todos los mapas, incluyendo spawn rates de jefes, extracciones y datos
						tácticos.
					</p>
				</div>
			</section>

			{/* Main Content */}
			<main className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8">
				<section>
					<div className="mb-6 flex items-center gap-3">
						<MapPin className="h-6 w-6 text-primary" />
						<h2 className="font-[family-name:var(--font-heading)] font-bold text-2xl">Todos los Mapas</h2>
					</div>

					{isLoading && (
						<div className="flex items-center justify-center py-16">
							<Loader2 className="h-8 w-8 animate-spin text-primary" />
							<span className="ml-2 text-muted-foreground">Cargando mapas desde Tarkov.dev...</span>
						</div>
					)}

					{error && (
						<div className="flex items-center justify-center py-16 text-destructive">
							<AlertCircle className="h-6 w-6" />
							<span className="ml-2">Error al cargar mapas: {error.message}</span>
						</div>
					)}

					{maps && maps.length > 0 && (
						<div className="grid gap-3 md:grid-cols-2 lg:gap-6 lg:grid-cols-3">
							{maps.map((map) => (
								<MapCard key={map.id} map={map} />
							))}
						</div>
					)}

					{maps && maps.length === 0 && !isLoading && (
						<div className="py-16 text-center text-muted-foreground">No se encontraron mapas</div>
					)}
				</section>
			</main>
		</div>
	);
}

// Component for displaying individual map cards
interface MapCardProps {
	map: TarkovMap;
}

function MapCard({ map }: MapCardProps) {
	// Sort bosses by spawn chance (highest first)
	const filteredBosses = map.bosses?.filter((bossSpawn: BossSpawn) => {
		return !EXCLUDED_BOSS_NAMES.includes(bossSpawn.boss.normalizedName);
	});
	const sortedBosses = filteredBosses?.sort((a, b) => b.spawnChance - a.spawnChance) || [];

	// Format duration
	const formatDuration = (minutes?: number) => {
		if (!minutes) return "N/A";
		return `${minutes} min`;
	};

	// Format spawn chance as percentage
	const formatSpawnChance = (chance: number) => {
		return `${Math.round(chance * 100)}%`;
	};

	// Get boss spawn rate color
	const getBossSpawnColor = (chance: number) => {
		const percentage = chance * 100;
		if (percentage >= 60) return "text-destructive";
		if (percentage >= 30) return "text-chart-2";
		return "text-chart-1";
	};

	return (
		<Card className="hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
			<CardHeader className="border-border border-b">
				<CardTitle className="flex items-center justify-between font-[family-name:var(--font-heading)]">
					<span>{map.name}</span>
					{map.wiki && (
						<a
							href={map.wiki}
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary transition-colors hover:text-primary/80"
						>
							<ExternalLink className="h-4 w-4" />
						</a>
					)}
				</CardTitle>
			</CardHeader>

			<CardContent className="space-y-4 pt-6">
				{/* Map Description */}
				{map.description && <p className="line-clamp-2 text-muted-foreground text-sm">{map.description}</p>}

				{/* Key Stats */}
				<div className="grid grid-cols-2 gap-4">
					{/* Players */}
					{map.players && (
						<div className="flex items-center gap-2">
							<Users className="h-4 w-4 text-primary" />
							<span className="text-sm">
								<span className="text-muted-foreground">Jugadores:</span>
								<span className="ml-1 font-semibold">{map.players}</span>
							</span>
						</div>
					)}

					{/* Duration */}
					{map.raidDuration && (
						<div className="flex items-center gap-2">
							<Clock className="h-4 w-4 text-primary" />
							<span className="text-sm">
								<span className="text-muted-foreground">Duración:</span>
								<span className="ml-1 font-semibold">{formatDuration(map.raidDuration)}</span>
							</span>
						</div>
					)}

					{/* Level Requirement */}
					{map.minPlayerLevel && (
						<div className="flex items-center gap-2">
							<Key className="h-4 w-4 text-primary" />
							<span className="text-sm">
								<span className="text-muted-foreground">Nivel mín:</span>
								<span className="ml-1 font-semibold">{map.minPlayerLevel}</span>
							</span>
						</div>
					)}

					{/* Extracts count */}
					{map.extracts && map.extracts.length > 0 && (
						<div className="flex items-center gap-2">
							<MapPin className="h-4 w-4 text-primary" />
							<span className="text-sm">
								<span className="text-muted-foreground">Extracciones:</span>
								<span className="ml-1 font-semibold">{map.extracts.length}</span>
							</span>
						</div>
					)}
				</div>

				{/* Bosses Section */}
				{sortedBosses.length > 0 && (
					<div className="rounded-lg border border-border bg-secondary/30 p-4">
						<div className="mb-3 flex items-center gap-2">
							<Skull className="h-4 w-4 text-destructive" />
							<span className="font-semibold text-foreground">Jefes ({sortedBosses.length})</span>
						</div>

						<div className="space-y-3">
							{sortedBosses.map((bossSpawn, index) => (
								<div
									key={`${bossSpawn.boss.id}-${index}`}
									className={`flex items-center justify-between ${
										index !== sortedBosses.length - 1 ? "border-border/50 border-b pb-3" : ""
									}`}
								>
									<div className="flex items-center gap-3">
										{bossSpawn.boss.imagePortraitLink ?
											<img
												src={bossSpawn.boss.imagePortraitLink}
												alt={bossSpawn.boss.name}
												className="h-8 w-8 rounded-full border border-border object-cover"
												loading="lazy"
											/>
										:	<div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary">
												<Skull className="h-4 w-4 text-destructive" />
											</div>
										}
										<div>
											<div className="font-medium text-foreground text-sm">
												{bossSpawn.boss.name}
											</div>
											{bossSpawn.spawnLocations && bossSpawn.spawnLocations.length > 0 && (
												<div className="text-muted-foreground text-xs">
													{bossSpawn.spawnLocations.length} ubicación
													{bossSpawn.spawnLocations.length > 1 ? "es" : ""}
												</div>
											)}
											{bossSpawn.escorts && bossSpawn.escorts.length > 0 && (
												<div className="text-muted-foreground text-xs">
													+{bossSpawn.escorts.length} escort
													{bossSpawn.escorts.length > 1 ? "s" : ""}
												</div>
											)}
										</div>
									</div>

									<div className="text-right">
										<div
											className={`font-[family-name:var(--font-mono)] font-bold ${getBossSpawnColor(bossSpawn.spawnChance)}`}
										>
											{formatSpawnChance(bossSpawn.spawnChance)}
										</div>
										<div className="text-muted-foreground text-xs">Spawn</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* No Boss Info */}
				{sortedBosses.length === 0 && (
					<div className="rounded-lg border border-border bg-muted/20 p-4 text-center">
						<div className="text-muted-foreground text-sm">Sin jefes registrados</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
