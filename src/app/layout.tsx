import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ReactQueryProvider } from "~/lib/react-query";

export const metadata: Metadata = {
	title: "Life OS",
	description: "Personal note-taking application",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${geist.variable}`}>
			<body>
				<ReactQueryProvider>{children}</ReactQueryProvider>
			</body>
		</html>
	);
}
