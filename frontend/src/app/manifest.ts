import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Shelfio - Smart Library Management',
    short_name: 'Shelfio',
    description: 'Plateforme moderne de gestion de bibliotheque pour les reservations, emprunts et administration.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fffaf8',
    theme_color: '#C41C3B',
    icons: [
      {
        src: '/app-icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/app-icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}