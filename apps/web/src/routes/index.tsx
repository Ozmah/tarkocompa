import { useTarkovTopAmmo } from "@/api/hooks/useTarkovAmmo";
import type { TarkovAmmo } from "@/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import { AlertCircle, Loader2, Target } from "lucide-react";

export const Route = createFileRoute("/")({
	component: DashboardComponent,
});

function DashboardComponent() {
	const { data: ammoList, isLoading, error } = useTarkovTopAmmo(10);

	return (
		<div className="min-h-screen bg-background">
			{/* Hero Section */}
			<section className="bg-gradient-to-br from-background to-secondary py-12">
				<div className="mx-auto max-w-screen-2xl px-4 text-center sm:px-6 lg:px-8">
					<h1 className="mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text font-[family-name:var(--font-heading)] font-bold text-4xl text-transparent md:text-5xl">
						Tarkompa Dashboard
					</h1>
					<p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
						Datos tácticos en tiempo real desde la API de Tarkov.dev
					</p>
				</div>
			</section>

			{/* Main Content */}
			<main className="mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8">
				<section>
					<div className="mb-6 flex items-center gap-3">
						<Target className="h-6 w-6 text-primary" />
						<h2 className="font-[family-name:var(--font-heading)] font-bold text-2xl">
							Municiones de Tarkov (API Real)
						</h2>
					</div>

					<Card className="transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
						<CardHeader className="border-border border-b">
							<CardTitle className="font-[family-name:var(--font-heading)]">
								Top 10 Municiones
							</CardTitle>
						</CardHeader>
						<CardContent className="pt-6">
							{isLoading && (
								<div className="flex items-center justify-center py-8">
									<Loader2 className="h-8 w-8 animate-spin text-primary" />
									<span className="ml-2 text-muted-foreground">
										Cargando municiones desde Tarkov.dev...
									</span>
								</div>
							)}

							{error && (
								<div className="flex items-center justify-center py-8 text-destructive">
									<AlertCircle className="h-6 w-6" />
									<span className="ml-2">
										Error al cargar municiones: {error.message}
									</span>
								</div>
							)}

							{ammoList && ammoList.length > 0 && (
								<div className="space-y-4">
									{ammoList.map((ammo) => (
										<AmmoItem key={ammo.id} ammo={ammo} />
									))}
								</div>
							)}

							{ammoList && ammoList.length === 0 && !isLoading && (
								<div className="py-8 text-center text-muted-foreground">
									No se encontraron municiones
								</div>
							)}
						</CardContent>
					</Card>
				</section>
			</main>
		</div>
	);
}

// Component for displaying individual ammo items with real API data
interface AmmoItemProps {
	ammo: TarkovAmmo;
}

function AmmoItem({ ammo }: AmmoItemProps) {
	const formatPrice = (price?: number) => {
		if (!price) return "N/A";
		return `₽${price.toLocaleString()}`;
	};

	const getProgressValue = (penetration?: number) => {
		if (!penetration) return 0;
		// Assuming max penetration is around 70 for progress bar calculation
		return Math.min((penetration / 70) * 100, 100);
	};

	// Check if item is actually ammunition (not grenade)
	const isActualAmmo =
		ammo.properties?.damage && ammo.properties?.penetrationPower;

	// Skip non-ammo items like grenades
	if (!isActualAmmo) {
		return null;
	}

	return (
		<div className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:border-primary/50">
			{/* Icon/Image */}
			<div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-md border border-border bg-secondary">
				{ammo.iconLink ? (
					<img
						src={ammo.iconLink}
						alt={ammo.name}
						className="h-12 w-12 object-contain"
						loading="lazy"
					/>
				) : (
					<Target className="h-8 w-8 text-primary" />
				)}
			</div>

			{/* Ammo Information */}
			<div className="flex-1">
				<div className="mb-1 font-semibold text-foreground">
					{ammo.name || "Unknown Ammo"}
				</div>
				<div className="mb-2 flex flex-wrap gap-4 text-muted-foreground text-sm">
					{ammo.properties?.caliber && (
						<span>Calibre: {ammo.properties.caliber}</span>
					)}
					{ammo.properties?.damage && (
						<span>Daño: {ammo.properties.damage}</span>
					)}
					{ammo.properties?.penetrationPower && (
						<span>Penetración: {ammo.properties.penetrationPower}</span>
					)}
					{ammo.properties?.fragmentationChance && (
						<span>Fragmentación: {ammo.properties.fragmentationChance}%</span>
					)}
					{ammo.types && <span>Tipos: {ammo.types.join(", ")}</span>}
				</div>

				{/* Progress bar for penetration power */}
				{ammo.properties?.penetrationPower && (
					<div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
						<div
							className="h-full bg-gradient-to-r from-chart-1 via-chart-2 to-destructive transition-all duration-500"
							style={{
								width: `${getProgressValue(ammo.properties.penetrationPower)}%`,
							}}
						/>
					</div>
				)}
			</div>

			{/* Price Information */}
			<div className="text-right">
				<div className="font-[family-name:var(--font-mono)] font-bold text-primary">
					{formatPrice(ammo.avg24hPrice)}
				</div>
				<div className="text-muted-foreground text-xs">Precio promedio</div>
				{ammo.basePrice && (
					<div className="text-muted-foreground text-xs">
						Base: {formatPrice(ammo.basePrice)}
					</div>
				)}
			</div>
		</div>
	);
}
