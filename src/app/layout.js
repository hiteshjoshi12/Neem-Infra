import { Lora, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Providers from "../components/Providers";
import { getGlobalSeoSettings } from "@/lib/seo/dynamicSeo";
import { buildOrganizationSchema } from "@/lib/seo/schemaBuilders";

const lora = Lora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
  weight: ["500", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "700"],
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

export default async function RootLayout({ children }) {
  const settings = await getGlobalSeoSettings();

  // Dynamic GA4 (DB configuration takes priority, fall back to process.env)
  const gaId =
    settings?.enableGa4 && settings?.googleAnalyticsId
      ? settings.googleAnalyticsId.trim()
      : process.env.NEXT_PUBLIC_GA_ID;

  // Dynamic Google Tag Manager
  const gtmId =
    settings?.enableGtm && settings?.googleTagManagerId
      ? settings.googleTagManagerId.trim()
      : '';

  // Dynamic Google Search Console verification code
  const gscCode =
    settings?.enableGsc && settings?.googleSearchConsoleCode
      ? settings.googleSearchConsoleCode.replace(/^google-site-verification=/, '').trim()
      : '';

  // Dynamic Speed & Performance Optimizations
  const speed = settings?.speedOptimizations || {
    enablePreconnect: true,
    enableDnsPrefetch: true,
  };

  // Structured Data (Organization / RealEstateAgent Schema)
  const organizationSchema = buildOrganizationSchema();

  return (
    <html lang="en" className={`${lora.variable} ${outfit.variable} ${jakarta.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {gscCode && (
          <meta name="google-site-verification" content={gscCode} />
        )}
        {speed.enablePreconnect !== false && (
          <>
            <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          </>
        )}
        {speed.enableDnsPrefetch !== false && (
          <>
            <link rel="dns-prefetch" href="https://ik.imagekit.io" />
            <link rel="dns-prefetch" href="https://images.unsplash.com" />
            <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          </>
        )}
        {/* Global Organization / LocalBusiness Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* Dynamic Google Tag Manager in <head> */}
        {gtmId && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `}
          </Script>
        )}
      </head>
      <body className="min-h-full flex flex-col font-sans bg-brand-ivory text-brand-text-dark" suppressHydrationWarning>
        {/* Dynamic Google Tag Manager (noscript fallback in <body>) */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {/* Dynamic Google Analytics 4 */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
