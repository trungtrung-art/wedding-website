import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n-context";
import type { Locale } from "@/data/i18n";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-cormorant",
  display: "swap",
});
const playfair = Playfair_Display({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-playfair",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Thiện Trung & Quỳnh Trang — Thiệp cưới",
  description: "Trân trọng kính mời tham dự lễ cưới của chúng tôi.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const cookieLang = jar.get("lang")?.value;
  const locale: Locale = cookieLang === "en" ? "en" : "vi";

  return (
    <html lang={locale} className={`${cormorant.variable} ${playfair.variable} ${inter.variable}`}>
      <body className="font-sans">
        <LanguageProvider initial={locale}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
