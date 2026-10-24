import { Lora, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Providers from "../components/Providers";
import { getGlobalSeoSettings } from "@/lib/seo/dynamicSeo";
import { getBusinessProfile } from "@/lib/dal";
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
  metadataBase: new URL("https://saudagarproperties.com"),
  title: {
    default: "Saudagar Properties — Premier Real Estate Consultant in DLF Gurugram",
    template: "%s | Saudagar Properties",
  },
  description:
    "Find your dream luxury builder floor, independent villa, penthouse, or commercial office in DLF Phase 1–5, Sushant Lok & Golf Course Road. Established 1999 trusted advisory in Gurugram.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Saudagar Properties — Premier Real Estate Consultant in DLF Gurugram",
    description: "Premier real estate advisory in DLF Phase 1–5, Sushant Lok & Golf Course Road since 1999.",
    url: "https://saudagarproperties.com",
    siteName: "Saudagar Properties",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saudagar Properties — Premier Real Estate Consultant in DLF Gurugram",
    description: "Premier real estate advisory in DLF Phase 1–5, Sushant Lok & Golf Course Road since 1999.",
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
  const [settings, profile] = await Promise.all([
    getGlobalSeoSettings(),
    getBusinessProfile(),
  ]);

  // Dynamic Google Tag Manager
  const gtmId =
    settings?.enableGtm && settings?.googleTagManagerId
      ? settings.googleTagManagerId.trim()
      : '';

  // Dynamic GA4 (Strictly prevent double-firing: standalone GA4 is only loaded if GTM is NOT active)
  const gaId =
    !gtmId && settings?.enableGa4 && settings?.googleAnalyticsId
      ? settings.googleAnalyticsId.trim()
      : (!gtmId ? (process.env.NEXT_PUBLIC_GA_ID || '') : '');

  // Dynamic Google Search Console verification code
  const gscCode =
    settings?.enableGsc && settings?.googleSearchConsoleCode
      ? settings.googleSearchConsoleCode.replace(/^google-site-verification=/, '').trim()
      : '';

  // Dynamic Bing Webmaster verification code
  const bingCode =
    settings?.enableBingVerification !== false && settings?.bingVerificationCode
      ? settings.bingVerificationCode.trim()
      : '';

  // Dynamic Speed & Performance Optimizations
  const speed = settings?.speedOptimizations || {
    enablePreconnect: true,
    enableDnsPrefetch: true,
  };

  // Structured Data (Organization / RealEstateAgent Schema from DB)
  const organizationSchema = buildOrganizationSchema(settings?.organizationSchema || settings, profile);

  return (
    <html lang="en" className={`${lora.variable} ${outfit.variable} ${jakarta.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Preload Hero Video Posters for instantaneous LCP */}
        <link
          rel="preload"
          as="image"
          href="https://ik.imagekit.io/saudagarproperties/saudagar-properties/videos/poster-mobile.jpg?tr=f-auto,q-80"
          media="(max-width: 768px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="https://ik.imagekit.io/saudagarproperties/saudagar-properties/videos/poster.jpg?tr=f-auto,q-80"
          media="(min-width: 769px)"
          fetchPriority="high"
        />
        {gscCode && (
          <meta name="google-site-verification" content={gscCode} />
        )}
        {bingCode && (
          <meta name="msvalidate.01" content={bingCode} />
        )}
        {speed.enablePreconnect !== false && (
          <>
            <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
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
        {/* Custom Head Scripts configured via Admin */}
        {settings?.customScripts?.isEnabled && settings?.customScripts?.head && (
          <div
            id="admin-custom-head-scripts"
            dangerouslySetInnerHTML={{ __html: settings.customScripts.head }}
          />
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
        {/* Custom Body Scripts configured via Admin */}
        {settings?.customScripts?.isEnabled && settings?.customScripts?.body && (
          <div
            id="admin-custom-body-scripts"
            dangerouslySetInnerHTML={{ __html: settings.customScripts.body }}
          />
        )}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
