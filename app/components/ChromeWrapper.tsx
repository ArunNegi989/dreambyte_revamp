'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/app/Layout/Header/page';
import Footer from '@/app/Layout/Footer/page';
import FloatingActionButtons from '@/app/components/Homepage/Floatingactionbuttons/page';
import BotpressWidget from '@/app/components/BotpressWidget';

// Routes jaha header/footer/widgets nahi chahiye
const NO_CHROME_ROUTES = ['/login', '/signup'];

export default function ChromeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideChrome = NO_CHROME_ROUTES.some(
    (route) => pathname === route || pathname?.startsWith(`${route}/`)
  );

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <BotpressWidget />
      <FloatingActionButtons />
      <Footer />
    </>
  );
}