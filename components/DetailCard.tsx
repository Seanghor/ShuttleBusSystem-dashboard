import React from 'react';
import { Card } from './ui/card';
interface DetailCardProps {
  title: string;
  icon: React.ReactNode;
  number: number;
}

export default function DetailCard(props: DetailCardProps) {
  const { title, icon, number } = props;

  return (
    <Card className='w-52 h-52 flex flex-col rounded-xl bg-input'>
      <div className='bg-primary rounded-t-xl flex flex-col text-center justify-center items-center text-white py-2 text-4xl'>
        {icon}
      </div>
      <div className='flex flex-col items-center justify-center h-full bg-input'>
        <h1 className='mb-5 text-primary'>{number}</h1>
        <p className='text-muted-foreground'>{title} </p>
      </div>
    </Card>
  );
}
