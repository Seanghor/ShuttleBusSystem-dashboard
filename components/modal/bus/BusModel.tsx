import RequiredField from '@/components/requiredField';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BusResponse } from '@/types/bus';

import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { LuPencil } from 'react-icons/lu';

interface BusModelProps {
  onSave?: (
    driverName: string,
    driverContact: string,
    model: string,
    seats: string,
    plateNumber: string
  ) => Promise<void>;
  onEdit?: (
    driverName: string,
    driverContact: string,
    model: string,
    seats: string,
    plateNumber: string,
    enable: boolean,
    busId: string
  ) => Promise<void>;
  isEdit: boolean;
  selectedBus?: BusResponse;
}

export default function BusModel(props: BusModelProps) {
  const { onSave, onEdit, isEdit, selectedBus } = props;
  const [driverName, setDriverName] = useState('');
  const [driverContact, setDriverContact] = useState('');
  const [model, setModel] = useState('');
  const [seats, setSeats] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [enable, setEnable] = useState<boolean>(false);
  const [selectedBusId, setSelectedBusId] = useState('');

  const handleAction = (e: any) => {
    setIsLoading(true);
    if (onSave) {
      onSave(driverName, driverContact, model, seats, plateNumber);
    }
    if (onEdit) {
      onEdit(
        driverName,
        driverContact,
        model,
        seats,
        plateNumber,
        enable,
        selectedBusId
      );
    }
    setOpen(false);
    resetData();
    setIsLoading(false);
  };

  const resetData = () => {
    setDriverName('');
    setDriverContact('');
    setModel('');
    setSeats('');
    setPlateNumber('');
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) {
          resetData();
        }
      }}>
      <DialogTrigger asChild>
        {isEdit === true ? (
          <LuPencil
            className='cursor-pointer'
            onClick={() => {
              setDriverName(selectedBus!.driverName);
              setDriverContact(selectedBus!.driverContact);
              setModel(selectedBus!.model);
              setSeats(selectedBus!.numOfSeat.toString());
              setPlateNumber(selectedBus!.plateNumber);
              setEnable(selectedBus!.enable);
              setSelectedBusId(selectedBus!.id);
            }}
          />
        ) : (
          <Button className='' variant='default' size='lg'>
            <FaPlus className='mr-5' />
            Add New Bus
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className={'overflow-y-scroll max-h-[80vh]'}>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Bus' : 'Add New Bus'}</DialogTitle>

          <div className='flex flex-col'>
            <RequiredField />
            <h5 className='font-bold mt-10'>Driver Information</h5>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
              <div>
                <Label htmlFor='driver name' isRequired>
                  Driver Name
                </Label>
                <Input
                  className='pb-2'
                  placeholder='Enter driver Name ...'
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor='driver contact' isRequired>
                  Driver Contacts
                </Label>
                <Input
                  className='pb-2'
                  placeholder='Enter driver Contact ...'
                  value={driverContact}
                  onChange={(e) => setDriverContact(e.target.value)}
                  required
                />
              </div>
            </div>
            <h5 className='font-bold mt-10'>Bus Information</h5>
            <div className='mt-5'>
              <Label htmlFor='Model' isRequired>
                Model
              </Label>
              <Input
                className='pb-2'
                placeholder='Enter Bus Model ...'
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
              <div>
                <Label htmlFor='Seats' isRequired>
                  Seat
                </Label>
                <Input
                  className='pb-2'
                  placeholder='Enter number of seat ...'
                  value={seats}
                  type='number'
                  required
                  onChange={(e) => setSeats(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor='Plate number' isRequired>
                  Plate number
                </Label>
                <Input
                  className='pb-2'
                  placeholder='Enter plate number ...'
                  value={plateNumber}
                  type='text'
                  required
                  onChange={(e) => setPlateNumber(e.target.value)}
                />
              </div>
            </div>
            <div className='flex justify-between mt-10 gap-5'>
              <Button
                type='submit'
                className='w-full'
                disabled={
                  !driverName ||
                  !driverContact ||
                  !model ||
                  !seats ||
                  !plateNumber
                }
                variant='default'
                onClick={handleAction}>
                {isLoading ? 'Loading' : isEdit ? 'Save Change' : 'Add'}
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
