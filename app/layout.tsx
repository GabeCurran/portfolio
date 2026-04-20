import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./globals.css";
import { exo } from "./fonts";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Gabe Curran",
    template: "%s | Gabe Curran",
  },
  description: "Portfolio of Gabe Curran",
  icons: {
    icon: "/img/jarvis.png",
    shortcut: "/img/jarvis.png",
    apple: "/img/jarvis.png",
  },
  metadataBase: new URL("https://gabecurran.me"),
  openGraph: {
    title: "Gabe Curran",
    description: "Portfolio of Gabe Curran",
    url: "https://gabecurran.me",
    siteName: "Gabe Curran",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gabe Curran",
    description: "Portfolio of Gabe Curran",
  },
};

// Per Next.js 13.4+ app router, viewport must be a separate export
// https://nextjs.org/docs/app/api-reference/functions/generate-viewport
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="preload">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${exo.variable} antialiased`}
      >
        <NextTopLoader
          color="#f76a6a"
          height={2}
          showSpinner={false}
          shadow="0 0 8px rgba(247,106,106,0.5)"
        />
        <div className="site-content" style={{ opacity: 0 }}>
          <Header />
          {children}
          <Footer />
        </div>
        <Analytics />
        <SpeedInsights />
        <Script id="remove-preload" strategy="afterInteractive">
          {`
            (function(){
              var endPreload = function(){
                if (!document.documentElement.classList.contains('preload')) return;
                document.documentElement.classList.remove('preload');
                try { document.documentElement.classList.add('js'); } catch(e){}
                try {
                  var wrap = document.querySelector('.site-content');
                  if (wrap) wrap.style.opacity = '';
                } catch(e){}
                setTimeout(function(){
                  try { window.dispatchEvent(new CustomEvent('site-preload-done')); } catch(e){}
                }, 200);
              };
              var startWhenFontsReady = function(){
                if (document.fonts && document.fonts.ready) {
                  document.fonts.ready.then(endPreload);
                } else {
                  endPreload();
                }
              };
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', startWhenFontsReady, { once: true });
              } else {
                startWhenFontsReady();
              }
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
