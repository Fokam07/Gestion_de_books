import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://shelfio.app'),
  title: {
    default: 'Shelfio | Smart Library Management',
    template: '%s | Shelfio',
  },
  applicationName: 'Shelfio',
  description: 'Plateforme complete pour la gestion des bibliotheques universitaires et scolaires. Reservations, emprunts et administration moderne.',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/app-icon.png', type: 'image/png' },
    ],
    shortcut: ['/app-icon.png'],
    apple: [
      { url: '/app-icon.png' },
    ],
  },
  appleWebApp: {
    capable: true,
    title: 'Shelfio',
    statusBarStyle: 'default',
  },
};

export const viewport: Viewport = {
  themeColor: '#C41C3B',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
