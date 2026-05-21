import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ideas Generator",
  description: "Private AI-powered business idea lab.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
