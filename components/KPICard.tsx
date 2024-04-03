import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { MdDone } from 'react-icons/md';

interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  amount: number;
}

export default function KPICard(props: KPICardProps) {
  const { icon, label, amount } = props;
  return (
    <Card className='w-30'>
      <CardHeader className='bg-primary rounded-t-xl flex items-center text-center text-white '>
        {icon}
      </CardHeader>
      <CardContent className='bg-input'>
        <div className='flex flex-col justify-center items-center px-5'>
          <h1 className='py-5 text-primary'>{amount}</h1>
          <h4 className='text-primary'>{label}</h4>
        </div>
      </CardContent>
    </Card>
  );
}
