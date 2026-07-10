import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Figtree,
  Montserrat,
  Poppins,
  Syne,
} from "next/font/google";
import { META } from "@/constants/brand";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { AuthProvider } from "@/lib/auth/auth-context";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree-family",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat-family",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const poppins = Poppins({
  variable: "--font-poppins-family",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const syne = Syne({
  variable: "--font-syne-family",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: META.title,
  description: META.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${figtree.variable} ${montserrat.variable} ${poppins.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
