import { useTarkovHighValueItems } from "@/api/hooks/useTarkovHighValueItems";
import type { TarkovItem } from "@/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, ArrowUpDown, DollarSign, TrendingUp } from "lucide-react";
import { useMemo } from "react";

export function HighValueItemsGrid() {
	const { data: items, isLoading, error } = useTarkovHighValueItems();

	const skeletonIds = useMemo(
		() => Array.from({ length: 6 }, () => `skeleton-${crypto.randomUUID()}`),
		[],
	);

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
				{skeletonIds.map((id) => (
					<Card key={id} className="h-fit">
						<CardHeader className="pb-3">
							<div className="flex items-center gap-3">
								<Skeleton className="h-12 w-12 rounded-md" />
								<div className="flex-1">
									<Skeleton className="mb-2 h-5 w-32" />
									<Skeleton className="h-4 w-24" />
								</div>
							</div>
						</CardHeader>
						<CardContent className="space-y-3">
							<Skeleton className="h-6 w-20" />
							<div className="space-y-2">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-3/4" />
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<Card>
				<CardContent className="p-6">
					<div className="flex items-center gap-2 text-destructive">
						<AlertCircle className="h-5 w-5" />
						<span>Error al cargar items de alto valor: {error.message}</span>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
			{items?.map((item) => (
				<HighValueItemCard key={item.id} item={item} />
			))}
		</div>
	);
}

interface HighValueItemCardProps {
	item: TarkovItem;
}

function HighValueItemCard({ item }: HighValueItemCardProps) {
	const formatPrice = (price?: number) => {
		if (!price) return "N/A";
		return `₽${price.toLocaleString()}`;
	};

	const getItemDisplayName = (name: string) => {
		// Simplify common item names for better display
		if (name.includes("TerraGroup Labs keycard")) {
			return `${name.replace("TerraGroup Labs keycard ", "Labs ")} Key`;
		}
		if (name === "LEDX Skin Transilluminator") {
			return "LEDX";
		}
		return name;
	};

	const getItemIcon = (name: string) => {
		if (name.toLowerCase().includes("bitcoin")) return "₿";
		if (name.toLowerCase().includes("ledx")) return "🏥";
		if (name.toLowerCase().includes("moonshine")) return "🥃";
		if (name.toLowerCase().includes("keycard")) return "🔑";
		return "💰";
	};

	// Get best prices from different sources
	const fleaMarketPrice = item.avg24hPrice;
	const basePrice = item.basePrice;

	// Find best sell and buy prices if available
	const bestSellPrice = item.sellFor?.[0]?.priceRUB;
	const bestBuyPrice = item.buyFor?.[0]?.priceRUB;

	return (
		<Card className="group transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
			<CardHeader className="border-border border-b pb-3">
				<div className="flex items-center gap-3">
					<div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md border border-border bg-secondary transition-colors group-hover:border-primary/50">
						{item.iconLink ? (
							<img
								src={item.iconLink}
								alt={item.name}
								className="h-10 w-10 object-contain"
								loading="lazy"
							/>
						) : (
							<span className="text-xl">{getItemIcon(item.name)}</span>
						)}
					</div>
					<div className="min-w-0 flex-1">
						<CardTitle className="font-[family-name:var(--font-heading)] text-base leading-tight">
							{getItemDisplayName(item.name)}
						</CardTitle>
						{item.shortName && item.shortName !== item.name && (
							<p className="truncate text-muted-foreground text-sm">
								{item.shortName}
							</p>
						)}
					</div>
				</div>
			</CardHeader>

			<CardContent className="pt-4">
				{/* Primary Price - Flea Market */}
				<div className="mb-4">
					<div className="mb-1 flex items-center gap-2">
						<TrendingUp className="h-4 w-4 text-primary" />
						<span className="font-medium text-sm">Flea Market (24h avg)</span>
					</div>
					<div className="font-[family-name:var(--font-mono)] font-bold text-primary text-xl">
						{formatPrice(fleaMarketPrice)}
					</div>
				</div>

				{/* Other Prices */}
				<div className="space-y-2 text-sm">
					{basePrice && (
						<div className="flex items-center justify-between">
							<span className="flex items-center gap-1 text-muted-foreground">
								<DollarSign className="h-3 w-3" />
								Precio Base
							</span>
							<span className="font-[family-name:var(--font-mono)] font-medium">
								{formatPrice(basePrice)}
							</span>
						</div>
					)}

					{bestSellPrice && (
						<div className="flex items-center justify-between">
							<span className="flex items-center gap-1 text-muted-foreground">
								<ArrowUpDown className="h-3 w-3" />
								Mejor Venta
							</span>
							<span className="font-[family-name:var(--font-mono)] font-medium text-green-400">
								{formatPrice(bestSellPrice)}
							</span>
						</div>
					)}

					{bestBuyPrice && (
						<div className="flex items-center justify-between">
							<span className="flex items-center gap-1 text-muted-foreground">
								<ArrowUpDown className="h-3 w-3" />
								Mejor Compra
							</span>
							<span className="font-[family-name:var(--font-mono)] font-medium text-red-400">
								{formatPrice(bestBuyPrice)}
							</span>
						</div>
					)}
				</div>

				{/* Item Weight & Dimensions */}
				{(item.weight || (item.width && item.height)) && (
					<div className="mt-3 border-border/50 border-t pt-3">
						<div className="flex items-center gap-4 text-muted-foreground text-xs">
							{item.weight && <span>{item.weight}kg</span>}
							{item.width && item.height && (
								<span>
									{item.width}×{item.height}
								</span>
							)}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
