import { useTarkovBosses } from "@/api/hooks/useTarkovBosses";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Skull } from "lucide-react";
import { useMemo } from "react";

export function BossSpawnList() {
	const { data: bosses, isLoading, error } = useTarkovBosses();

	const skeletonIds = useMemo(
		() => Array.from({ length: 8 }, () => `skeleton-${crypto.randomUUID()}`),
		[],
	);

	if (isLoading) {
		return (
			<Card className="h-fit">
				<CardHeader className="border-border border-b pb-3">
					<CardTitle className="flex items-center gap-2 font-[family-name:var(--font-heading)] text-lg">
						<Skull className="h-5 w-5 text-primary" />
						Spawn de Jefes
					</CardTitle>
				</CardHeader>
				<CardContent className="p-4">
					<div className="space-y-3">
						{skeletonIds.map((id) => (
							<div key={id} className="flex items-center justify-between">
								<Skeleton className="h-4 w-24" />
								<Skeleton className="h-4 w-12" />
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card className="h-fit">
				<CardHeader className="border-border border-b pb-3">
					<CardTitle className="flex items-center gap-2 font-[family-name:var(--font-heading)] text-lg">
						<Skull className="h-5 w-5 text-primary" />
						Spawn de Jefes
					</CardTitle>
				</CardHeader>
				<CardContent className="p-4">
					<div className="flex items-center gap-2 text-destructive text-sm">
						<AlertCircle className="h-4 w-4" />
						Error al cargar bosses
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="h-fit transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
			<CardHeader className="border-border border-b pb-3">
				<CardTitle className="flex items-center gap-2 font-[family-name:var(--font-heading)] text-lg">
					<Skull className="h-5 w-5 text-primary" />
					Spawn de Jefes
				</CardTitle>
			</CardHeader>
			<CardContent className="p-4">
				<div className="space-y-3">
					{bosses?.map((boss) => (
						<div
							key={boss.id}
							className="group -m-2 flex items-center justify-between rounded-md p-2 transition-colors hover:bg-secondary/50"
						>
							<div className="min-w-0 flex-1">
								<div className="truncate font-medium text-foreground text-sm">
									{boss.name}
								</div>
								{boss.maps.length > 0 && (
									<div className="truncate text-muted-foreground text-xs">
										{boss.maps.slice(0, 2).join(", ")}
										{boss.maps.length > 2 && ` +${boss.maps.length - 2}`}
									</div>
								)}
							</div>
							<div className="flex flex-shrink-0 items-center gap-2">
								<div className="font-[family-name:var(--font-mono)] font-semibold text-primary text-sm">
									{(boss.spawnRate * 100).toFixed(0)}%
								</div>
								<div
									className="h-2 w-12 overflow-hidden rounded-full bg-secondary"
									title={`${(boss.spawnRate * 100).toFixed(1)}% spawn rate`}
								>
									<div
										className="h-full bg-gradient-to-r from-chart-1 to-primary transition-all duration-500"
										style={{ width: `${boss.spawnRate * 100}%` }}
									/>
								</div>
							</div>
						</div>
					))}
				</div>
				{bosses?.length === 0 && (
					<div className="py-6 text-center text-muted-foreground text-sm">
						No se encontraron bosses
					</div>
				)}
			</CardContent>
		</Card>
	);
}
