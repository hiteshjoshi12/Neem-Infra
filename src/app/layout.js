import { Lora, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Providers from "../components/Providers";
import { getGlobalSeoSettings } from "@/lib/seo/dynamicSeo";
import { getBusinessProfile, getInitialCmsPayload } from "@/lib/dal";
import { buildOrganizationSchema, buildWebSiteSchema } from "@/lib/seo/schemaBuilders";

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

export async function generateMetadata() {
  const [settings, profile] = await Promise.all([
    getGlobalSeoSettings(),
    getBusinessProfile().catch(() => null),
  ]);

  const baseUrl = (settings?.canonicalBaseUrl || 'https://saudagarproperties.com').replace(/\/+$/, '');
  const brandName = profile?.name || settings?.organizationSchema?.name || 'Saudagar Properties';
  const siteTitle = settings?.defaultMetaTitle || `${brandName} — Premier Real Estate Consultant in DLF Gurugram`;
  const siteTitleTemplate = settings?.siteTitleTemplate || '%s | ' + brandName;
  const siteDescription =
    settings?.defaultMetaDescription ||
    'Find your dream luxury builder floor, independent villa, penthouse, or commercial office in DLF Phase 1–5, Sushant Lok & Golf Course Road. Established 1999 trusted advisory in Gurugram.';
  const defaultOgImage =
    settings?.defaultOgImage ||
    'https://ik.imagekit.io/saudagarproperties/saudagar-properties/branding/logo.png?updatedAt=1792302925853';
  const keywords = settings?.defaultKeywords?.length
    ? settings.defaultKeywords
    : [
      'Saudagar Properties',
      'Real Estate Consultant Gurugram',
      'DLF Phase 1-5 Builder Floors',
      'Luxury Villas Gurgaon',
      'Commercial Office Lease Cyber City',
    ];

  let metadataBase;
  try {
    metadataBase = new URL(baseUrl);
  } catch {
    metadataBase = new URL('https://saudagarproperties.com');
  }

  return {
    metadataBase,
    title: {
      default: siteTitle,
      template: siteTitleTemplate,
    },
    description: siteDescription,
    keywords,
    openGraph: {
      title: siteTitle,
      description: siteDescription,
      url: baseUrl,
      siteName: brandName,
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: siteTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteTitle,
      description: siteDescription,
      images: [defaultOgImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      shortcut: '/favicon.ico',
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
  };
}

export default async function RootLayout({ children }) {
  const [settings, profile, cmsPayload] = await Promise.all([
    getGlobalSeoSettings(),
    getBusinessProfile(),
    getInitialCmsPayload(),
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
    preconnectDomains: [
      'https://images.unsplash.com',
      'https://ik.imagekit.io',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ],
  };

  const preconnectDomains = speed.preconnectDomains?.length
    ? speed.preconnectDomains
    : ['https://images.unsplash.com', 'https://ik.imagekit.io', 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'];

  // Structured Data (Organization + WebSite Schema graph from DB)
  const websiteSchema = buildWebSiteSchema(settings, profile);
  const organizationSchema = buildOrganizationSchema(settings, profile);
  const rootSchemaGraph = {
    '@context': 'https://schema.org',
    '@graph': [websiteSchema, organizationSchema].filter(Boolean),
  };

  return (
    <html lang="en" className={`${lora.variable} ${outfit.variable} ${jakarta.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Core Favicons for browser top bar / tab bar */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
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
        {speed.enablePreconnect !== false &&
          preconnectDomains.map((domain) => (
            <link key={`preconnect-${domain}`} rel="preconnect" href={domain} crossOrigin="anonymous" />
          ))
        }
        {speed.enableDnsPrefetch !== false &&
          preconnectDomains.map((domain) => (
            <link key={`dns-${domain}`} rel="dns-prefetch" href={domain} />
          ))
        }
        {/* Global Organization / LocalBusiness / WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(rootSchemaGraph) }}
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
        <Providers initialData={cmsPayload}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
