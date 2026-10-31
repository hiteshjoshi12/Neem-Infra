export default function manifest() {
  return {
    name: 'Saudagar Properties',
    short_name: 'Saudagar Properties',
    description: 'Premier Real Estate Consultant in DLF Gurugram',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f172a',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}

