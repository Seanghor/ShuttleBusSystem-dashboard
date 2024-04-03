import { FiUser } from 'react-icons/fi';
import { MdOutlineLogout } from 'react-icons/md';
import { useState } from 'react';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import { deleteCookie } from 'cookies-next';
import Logo from '../public/logo.png';

// If Sidebar is a TypeScript component:
interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (value: boolean) => void;
  toggleSidebar: () => void; // Ensure this is included
}

const Sidebar = ({
  isSidebarOpen,
  toggleSidebar,
  setIsSidebarOpen
}: SidebarProps) => {
  const currentPath = usePathname();

  const router = useRouter();

  const removeToken = () => {
    deleteCookie('id');
    deleteCookie('token');
    router.replace('/auth/signIn');
  };
  return (
    <div className='flex h-screen'>
      {/* Sidebar */}
      <div
        className={`bg-[#0E6431] w-[300px] text-white space-y-3 fixed h-full z-10 transition-all duration-300 ease-in-out flex flex-col justify-between overflow-y-auto ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}>
        {/* Icon Close Sidebar */}
        <FaTimes
          className='h-5 w-5 absolute top-0 right-0 m-4 lg:hidden cursor-pointer'
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* logo */}
        <div className='p-10'>
          <div className='mt-5 flex justify-center'>
            {/* <img
              src='/Logo.png'
              alt='logo'
              className='w-32 h-32 md:w-40 md:h-40 object-contain'
            /> */}
            <Image
              src={Logo}
              alt='Logo'
              className='w-32 h-32 md:w-40 md:h-40 object-contain'
            />
          </div>
        </div>

        {/* Link */}
        <ul className='flex flex-col'>
          <li
            onClick={toggleSidebar}
            className={
              currentPath === '/schedules'
                ? 'text-mute border-r-4 border-primary transition-all duration-500 active bg-[#0b5027]'
                : 'hover:bg-[#0d5a2c] transition-all duration-500 text-muted'
            }>
            <Link href='/schedules'>
              <p className='font-bold text-md md:text-lg py-3 md:py-5 px-10'>
                Schedules
              </p>
            </Link>
          </li>

          <li
            onClick={toggleSidebar}
            className={
              currentPath === '/bus'
                ? 'text-mute border-r-4 border-primary transition-all duration-500 active bg-[#0b5027]'
                : 'hover:bg-[#0d5a2c] transition-all duration-500 text-muted '
            }>
            <Link href='/bus'>
              <p className='font-bold text-md md:text-lg py-3 md:py-5 px-10'>
                Bus Management
              </p>
            </Link>
          </li>

          <li
            onClick={toggleSidebar}
            className={
              currentPath === '/departure'
                ? 'text-mute border-r-4 border-primary transition-all duration-500 active bg-[#0b5027]'
                : 'hover:bg-[#0d5a2c] transition-all duration-500 text-muted '
            }>
            <Link href='/departure'>
              <p className='font-bold text-md md:text-lg py-3 md:py-5 px-10'>
                Departure Management
              </p>
            </Link>
          </li>

          <li
            onClick={toggleSidebar}
            className={
              currentPath === '/location'
                ? 'text-mute border-r-4 border-primary transition-all duration-500 active bg-[#0b5027]'
                : 'hover:bg-[#0d5a2c] transition-all duration-500 text-muted'
            }>
            <Link href='/location'>
              <p className='font-bold text-md md:text-lg py-3 md:py-5 px-10'>
                Location Management
              </p>
            </Link>
          </li>

          <li
            onClick={toggleSidebar}
            className={
              currentPath === '/users'
                ? 'text-mute border-r-4 border-primary transition-all duration-500 active bg-[#0b5027]'
                : 'hover:bg-[#0d5a2c] transition-all duration-500 text-muted '
            }>
            <Link href='/users'>
              <p className='font-bold text-md md:text-lg py-3 md:py-5 px-10'>
                User Management
              </p>
            </Link>
          </li>

          <li
            onClick={toggleSidebar}
            className={
              currentPath === '/ticket'
                ? 'text-mute border-r-4 border-primary transition-all duration-500 active bg-[#0b5027]'
                : 'hover:bg-[#0d5a2c] transition-all duration-500 text-muted '
            }>
            <Link href='/ticket'>
              <p className='font-bold text-md md:text-lg py-3 md:py-5 px-10'>
                Ticket Management
              </p>
            </Link>
          </li>
        </ul>

        <div className='p-10'>
          <div
            className='flex gap-5 mt-5 cursor-pointer items-center'
            onClick={removeToken}>
            <MdOutlineLogout className='text-xl' />
            <p className='font-bold'>Logout</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
