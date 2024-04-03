import React from 'react';

const Loading = () => {
  return (
    <div className='flex flex-col gap-5 items-center justify-center h-[calc(100vh-100px)]'>
      <div className='lds-ring'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className='text-center'>
        <p className='text-primary font-bold'>Please wait.</p>
        <p className='text-muted-foreground'>It will just take a moment.</p>
      </div>
    </div>
  );
};

export default Loading;
