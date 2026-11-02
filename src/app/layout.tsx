import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Samrock Music Productions | Professional Afrobeats Producer",
  description: "Top-tier music production, mixing, and mastering services by Samrock. Afrobeats, Reggae, Woro, and more.",
  icons: {
    icon: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-samrock-dark text-gray-900 dark:text-white antialiased selection:bg-samrock-cyan selection:text-white transition-colors duration-300`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('theme')==='light'){document.documentElement.classList.remove('dark')}}catch(e){}`,
          }}
        />
        {children}
        <Toaster position="top-center" richColors theme="dark" closeButton />
      </body>
    </html>
  );
}