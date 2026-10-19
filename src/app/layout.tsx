import type { Metadata, Viewport } from "next";
import { Poppins, Nunito } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { LocationProvider } from "@/context/LocationContext";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { PwaRegister } from "@/components/common/PwaRegister";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const nunito = Nunito({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Garbage Collection - Spot it. Post it. Clean it together.",
  description: "A community-powered clean-city platform. Report garbage spots on a live map, organise Sunday cleanup drives, and keep our neighbourhoods green.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#2E7D32",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${nunito.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#F8FAF8] dark:bg-[#0F172A] text-gray-900 dark:text-gray-100 antialiased selection:bg-emerald-200 selection:text-emerald-900">
        <LanguageProvider>
          <LocationProvider>
            <AuthProvider>
              <PwaRegister />
              <Navbar />
              <main className="flex-1 pb-20 lg:pb-0">{children}</main>
              <MobileTabBar />
            </AuthProvider>
          </LocationProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
