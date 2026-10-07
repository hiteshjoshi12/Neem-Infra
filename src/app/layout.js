import { Lora, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "../components/Providers";

const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL("https://www.saudagarproperties.com"),
  title: {
    default: "Saudagar Properties — Premier Real Estate Consultant in DLF Gurugram",
    template: "%s | Saudagar Properties",
  },
  description:
    "Find your dream luxury builder floor, independent villa, penthouse, or commercial office in DLF Phase 1–5, Sushant Lok & Golf Course Road. 25+ years of trusted advisory in Gurugram.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Saudagar Properties — Premier Real Estate Consultant in DLF Gurugram",
    description: "25+ years of trusted real estate advisory in DLF Phase 1–5, Sushant Lok & Golf Course Road.",
    url: "https://www.saudagarproperties.com",
    siteName: "Saudagar Properties",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saudagar Properties — Premier Real Estate Consultant in DLF Gurugram",
    description: "25+ years of trusted real estate advisory in DLF Phase 1–5, Sushant Lok & Golf Course Road.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/SP%20favicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${lora.variable} ${outfit.variable} ${jakarta.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#F7F5EF] text-[#121A2F]">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
