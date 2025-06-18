import { Link } from "@tanstack/react-router";
import {
	Home,
	MapPin,
	Shield,
	ShoppingCart,
	Skull,
	Target,
} from "lucide-react";

import { ModeToggle } from "./mode-toggle";

export default function Header() {
	const links = [
		{ to: "/", label: "Dashboard", icon: Home },
		{ to: "/ammo", label: "Munición", icon: Target },
		{ to: "/armor", label: "Armadura", icon: Shield },
		{ to: "/maps", label: "Mapas", icon: MapPin },
		{ to: "/bosses", label: "Jefes", icon: Skull },
		{ to: "/market", label: "Mercado", icon: ShoppingCart },
	];

	return (
		<header className="sticky top-0 z-50 border-primary border-b-2 bg-secondary backdrop-blur-sm">
			<div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between py-4">
					<div className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text font-[family-name:var(--font-heading)] font-bold text-2xl text-transparent">
						TARKOMPA
					</div>
					<nav className="hidden gap-6 md:flex">
						{links.map(({ to, label, icon: Icon }) => (
							<Link
								key={to}
								to={to}
								className="flex items-center gap-2 rounded-md px-3 py-2 font-medium text-muted-foreground text-sm transition-all duration-200 hover:bg-muted/50 hover:text-primary [&.active]:bg-muted [&.active]:text-primary"
							>
								<Icon className="h-4 w-4" />
								{label}
							</Link>
						))}
					</nav>
					<div className="flex items-center gap-2">
						<ModeToggle />
					</div>
				</div>
			</div>
		</header>
	);
}
