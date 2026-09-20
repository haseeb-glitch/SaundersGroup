import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Saunders Group | Tu tienda, mejor organizada",
    template: "%s | Saunders Group",
  },
  description: "Evaluación personalizada para organizar estanterías, categorías y recorridos en minimarkets y bodegas de Quito.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "Saunders Group | Tu tienda, mejor organizada",
    description: "Evaluación personalizada para minimarkets y bodegas de Quito.",
    images: [{ url: "/og.png", width: 1734, height: 909, alt: "Saunders Group — Tu tienda, mejor organizada" }],
    locale: "es_EC",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saunders Group | Tu tienda, mejor organizada",
    description: "Evaluación personalizada para minimarkets y bodegas de Quito.",
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  other: { google: "notranslate" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" translate="no" className="notranslate" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="antialiased notranslate" suppressHydrationWarning>{children}</body>
    </html>
  );
}
