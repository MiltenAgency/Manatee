import './globals.css';
import DevAgentation from './agentation';

export const metadata = {
  title: 'Tidewell Home — Thoughtful renovations. Naturally.',
  description: 'Explore a considered approach to kitchens, bathrooms, and whole home renovations. Natural materials, thoughtful details, and spaces for a better everyday.',
  robots: { index: false, follow: false },
  icons: { icon: '/icon.svg' },
  openGraph: {
    title: 'Tidewell Home — A home that feels more like you.',
    description: 'Considered kitchens, quieter bathrooms, and space for your everyday. Discover the Tidewell Home studio concept.',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/tidewell-living.webp', width: 1536, height: 1024, alt: 'Tidewell Home coastal living room design concept' }],
  },
  twitter: { card: 'summary_large_image', title: 'Tidewell Home', description: 'Thoughtful renovations. Naturally.', images: ['/images/tidewell-living.webp'] },
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        {process.env.NODE_ENV === 'development' && <DevAgentation />}
      </body>
    </html>
  );
}
