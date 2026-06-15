import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LunchSwipe",
  description: "Ekibinle bugün nerede yiyorsunuz?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
