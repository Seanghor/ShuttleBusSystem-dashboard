'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import serverError from '../../public/serverError.png';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const router = useRouter();

  const backHome = () => {
    router.push('/schedules');
  };

  return (
    <div className='flex flex-col gap-3 justify-center items-center h-screen'>
      <Image src={serverError} alt='Not Found' width={500} height={500} />
      <div className='flex flex-col items-center'>
        <p className='text-2xl font-bold text-primary'>
          We are sorry, our server is currently unavailable.
        </p>
        <p className='text-muted-foreground'>
          We are working hard to fix the issue and get back in no time. Please
          try again in a few moment
        </p>
        <Button size='lg' className='mt-5' onClick={backHome}>
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
