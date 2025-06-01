import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "daisyui";

const inter = Inter({ subsets: ["latin"] });

import { headers } from "next/headers"; // added
import ContextProvider from "@/context";

export const metadata: Metadata = {
  title: "NFT Product Verifier",
  description: "Powered by Blockchain Technology",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  return (
    <html lang="en">
      <body className="min-h-screen bg-base-100 text-base-content">
        <ContextProvider cookies={cookies}>{children}</ContextProvider>
      </body>
    </html>
  );
}
