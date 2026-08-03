import { Inter, Outfit } from "next/font/google";
import Head from "next/head"; // Import Head
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "Save and Grow",
  description: "Your smart financial assistant",
  icons: {
    icon: "/favicon.ico", // Main Favicon
    shortcut: "/favicon.ico", // For Browser
    apple: "/favicon.ico", // For Apple Devices
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <Head>
          <title>Save and Grow</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body className={outfit.className}>
          <Toaster />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
