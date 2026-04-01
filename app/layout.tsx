import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';

export const metadata: Metadata = {
  title: {
    default:  'PulseTrack — Behavioural Consistency Platform',
    template: '%s | PulseTrack',
  },
  description:
    'Automatically track your behavioural consistency through wearable data. No manual entry. No dashboards. Just meaningful weekly insights.',
  keywords: ['wearable', 'behaviour tracking', 'fitbit', 'withings', 'wellness', 'consistency'],
  authors: [{ name: 'PulseTrack' }],
  openGraph: {
    type:        'website',
    title:       'PulseTrack — Behavioural Consistency Platform',
    description: 'Automatically track your behavioural consistency through wearable data.',
    siteName:    'PulseTrack',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
