import { Link } from "@tanstack/react-router";
import {
	Home,
	MapPin,
	Menu,
	Shield,
	ShoppingCart,
	Skull,
	Target,
} from "lucide-react";

import { ThemeSwitcher } from "./theme-switcher";
import { Button } from "./ui/button";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "./ui/sheet";

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
					<nav className="hidden gap-6 lg:flex">
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
						{/* Mobile Menu */}
						<Sheet>
							<SheetTrigger asChild>
								<Button variant="ghost" size="icon" className="lg:hidden">
									<Menu className="h-5 w-5" />
									<span className="sr-only">Abrir menú</span>
								</Button>
							</SheetTrigger>
							<SheetContent side="right" className="w-[300px] sm:w-[400px]">
								<SheetHeader>
									<SheetTitle className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text font-[family-name:var(--font-heading)] font-bold text-transparent text-xl">
										TARKOMPA
									</SheetTitle>
								</SheetHeader>
								<nav className="mt-8 flex flex-col gap-4">
									{links.map(({ to, label, icon: Icon }) => (
										<SheetClose key={to} asChild>
											<Link
												key={to}
												to={to}
												className="flex items-center gap-3 rounded-md px-3 py-3 font-medium text-foreground transition-all duration-200 hover:bg-muted [&.active]:bg-muted [&.active]:text-primary"
											>
												<Icon className="h-5 w-5" />
												{label}
											</Link>
										</SheetClose>
									))}
								</nav>
							</SheetContent>
						</Sheet>
						<ThemeSwitcher />
					</div>
				</div>
			</div>
		</header>
	);
}
