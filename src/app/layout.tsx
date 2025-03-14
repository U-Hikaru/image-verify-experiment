import type { Metadata } from "next";

import "./globals.css";
import SessionProvider from "./providers";
import { getServerSession } from "next-auth";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Verify Experiment",
  description: "Software Engineer course 2025, image verify experimentation.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>{children}</SessionProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
