'use client';
import { Suspense, useState } from 'react';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { MdOutlineMenu, MdClose } from 'react-icons/md';
import Sidebar from '@/components/Sidebar';
// import PropTypes from "prop-types";
import { usePathname } from 'next/navigation';
import Loading from './loading';
import { FaBars } from 'react-icons/fa';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: any) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const currentPath = usePathname();
  const headerPatterns = [
    /^\/schedules$/,
    /^\/departure$/,
    /^\/bus$/,
    /^\/location$/,
    /^\/users$/,
    /^\/users$/,
    /^\/dashboard$/,
    /^\/ticket$/,
    /^\/schedules\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
  ];

  const showHeader = headerPatterns.some((pattern) =>
    pattern.test(currentPath)
  );

  const isLoginPage = currentPath === '/auth/signIn';

  const isPathNotInHeaderPatterns = !headerPatterns.some((pattern) =>
    pattern.test(currentPath)
  );
  const mainContentClasses = isPathNotInHeaderPatterns
    ? 'flex-1 overflow-auto'
    : 'flex-1 px-2 lg:px-10 ml-0 lg:ml-72 overflow-auto';

  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className='relative flex gap-5'>
          {showHeader && (
            <Sidebar
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          )}

          <div className={mainContentClasses}>
            {!isLoginPage && (
              <div className='py-4 lg:hidden'>
                <FaBars
                  className='h-5 w-5 cursor-pointer'
                  onClick={() => setIsSidebarOpen(true)}
                />
              </div>
            )}
            <Toaster />
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </div>
        </div>
      </body>
    </html>
  );
}
