'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import notFoundImage from '../public/notFound.png';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const router = useRouter();

  const backHome = () => {
    router.push('/schedules');
  };

  return (
    <div className='flex flex-col gap-3 justify-center items-center h-screen'>
      <Image src={notFoundImage} alt='Not Found' width={500} height={500} />
      <div className='flex flex-col items-center'>
        <p className='text-2xl font-bold text-primary'>Page not found</p>
        <p className='text-muted-foreground'>
          It seems we cannot found what you are looking for
        </p>
        <Button size='lg' className='mt-5' onClick={backHome}>
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
