import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { IoSwapVertical } from 'react-icons/io5';
import { BookingResponse } from '@/types/schedule';
import RequiredField from '@/components/requiredField';
import { Label } from '@/components/ui/label';

interface SwapTicketModelProps {
  bookingUsers: BookingResponse[];
  waitingUsers: BookingResponse[];
  onSwapTickets?: (bookingUserId: string, waitingUserId: string) => void;
}
export default function SwapTicketModel(props: SwapTicketModelProps) {
  const { bookingUsers, waitingUsers, onSwapTickets } = props;

  const [bookingUserId, setBookingUserId] = useState('');
  const [waitingUserId, setWaitingUserId] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSwapTickets = () => {
    if (onSwapTickets) {
      setIsLoading(true);
      onSwapTickets(bookingUserId, waitingUserId);
      setIsLoading(false);
    }
  };
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(newOpen) => {
        setIsOpen(newOpen);
        if (!newOpen) {
          setBookingUserId(''), setWaitingUserId('');
        }
      }}>
      <DialogTrigger asChild>
        <Button className='py-2 px-6' variant='default' size='lg'>
          <IoSwapVertical className='mr-5' /> Swap Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className={'overflow-y-scroll max-h-[80vh]'}>
        <DialogHeader>
          <DialogTitle>Swap ticket</DialogTitle>
          <RequiredField />
          <div className='flex flex-col'>
            <div className='flex flex-col mt-10'>
              <Label htmlFor='driver name' isRequired className='pb-2'>
                Booking Users
              </Label>
              <Select
                onValueChange={(value) => {
                  setBookingUserId(value);
                }}>
                <SelectTrigger className='w-full '>
                  <SelectValue placeholder='Select Booking user' />
                </SelectTrigger>
                <SelectContent>
                  {bookingUsers.map((user: BookingResponse, index) => (
                    <SelectItem key={index} value={user.id}>
                      {user.user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className='flex flex-row justify-center py-5'>
                <IoSwapVertical />
              </div>

              <Label htmlFor='driver name' isRequired className='pb-2'>
                Waiting Users
              </Label>
              <Select
                onValueChange={(value) => {
                  setWaitingUserId(value);
                }}>
                <SelectTrigger className='w-full '>
                  <SelectValue placeholder='Select Waiting user' />
                </SelectTrigger>
                <SelectContent>
                  {waitingUsers.map((user: BookingResponse, index) => (
                    <SelectItem key={index} value={user.id}>
                      {user.user.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className='w-full mt-10'>
                <Button
                  className='w-full'
                  variant='default'
                  disabled={
                    isLoading === true ||
                    bookingUserId === '' ||
                    waitingUserId === ''
                  }
                  onClick={() => handleSwapTickets()}>
                  Create
                </Button>
              </div>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
