import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { dark } from "@clerk/themes";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata = {
	title: "URL Shortener",
	description: "Made by editid",
};

export default function RootLayout({ children }) {
	return (
		<ClerkProvider
			appearance={{
				baseTheme: dark,
			}}
		>
			<html lang="en" suppressHydrationWarning>
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				>
					<ThemeProvider
						storageKey="theme"
						defaultTheme="system"
						enableSystem
						attribute={"class"}
					>
						<SidebarProvider>
							<AppSidebar />
							<div className="dark:bg-neutral-900 h-fit p-1 mt-2 rounded-r-md border-y-2 border-neutral-300 dark:border-neutral-800 border-r-2">
								<SidebarTrigger />
							</div>

							{children}
						</SidebarProvider>
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
