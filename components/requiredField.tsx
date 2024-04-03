import React from 'react';

export default function RequiredField() {
  return (
    <p className='text-xs text-muted-foreground italic'>
      Fields marked with <span className='text-primary font-extrabold'>*</span>{' '}
      are mandatory
    </p>
  );
}
