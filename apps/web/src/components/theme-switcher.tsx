import { useTheme } from "./theme-provider";
import { ThemeSwitcher as KiboThemeSwitcher } from "./ui/kibo-ui/theme-switcher";

export function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();

	return (
		<KiboThemeSwitcher
			value={theme as "light" | "dark" | "system"}
			onChange={(newTheme) => setTheme(newTheme)}
		/>
	);
}
