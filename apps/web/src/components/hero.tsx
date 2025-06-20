import {
	Announcement,
	AnnouncementTag,
	AnnouncementTitle,
} from "@/components/ui/kibo-ui/announcement";
import { ArrowUpRightIcon } from "lucide-react";

export default function Header() {
	return (
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
	);
}
