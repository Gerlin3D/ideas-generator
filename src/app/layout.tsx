import type { Metadata } from "next";
import "./globals.css";
import { WebVitals } from "@/components/web-vitals";

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
      <body>
        <WebVitals />
        {children}
        </body>
    </html>
  );
}
