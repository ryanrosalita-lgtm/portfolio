import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lynard - Web & Graphic Designer Portfolio",
  description: "Portfolio of Shu Huan, a graphic designer specializing in merchandise design and branding.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
