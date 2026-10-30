import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import dynamic from "next/dynamic";
import { Toaster } from "sonner";

const Navbar = dynamic(() => import("@/components/Navbar"), {
  loading: () => <div className="h-20 bg-white border-b border-gray-100" />,
  ssr: true
});

const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <div className="h-96 bg-gray-50" />,
  ssr: true
});

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Keshava Kiranam",
  description: "Fresh groceries and daily essentials at your doorstep.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={outfit.className}>
          <Toaster richColors position="top-center" />
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
