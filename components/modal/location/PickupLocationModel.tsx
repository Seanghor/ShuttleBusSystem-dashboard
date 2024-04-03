import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FaPlus } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MainLocation, SubLocationModel } from '@/app/location/page';
import { MdOutlineEdit } from 'react-icons/md';
import RequiredField from '@/components/requiredField';

interface PickupLocationModelProps {
  onSavePickupLocation?: (
    pickupLocationName: string,
    mainLocationId: string
  ) => Promise<void>;
  onEditPickupLocation?: (
    mainLocationId: string,
    pickupLocationId: string,
    pickupLocationName: string
  ) => Promise<void>;
  isEdit: boolean;
  selectedMainLocation?: MainLocation;
  selectedPickupLocation?: SubLocationModel;
}

export default function PickupLocationModel(props: PickupLocationModelProps) {
  const {
    onSavePickupLocation,
    onEditPickupLocation,
    isEdit,
    selectedMainLocation,
    selectedPickupLocation
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [pickupLocationName, setPickupLocationName] = useState('');

  const handleAction = (e: any) => {
    setIsLoading(true);
    if (onSavePickupLocation) {
      onSavePickupLocation(pickupLocationName, selectedMainLocation!.id);
    }
    if (onEditPickupLocation) {
      onEditPickupLocation(
        selectedMainLocation!.id,
        selectedPickupLocation!.id,
        pickupLocationName
      );
    }

    resetData();
  };

  const resetData = () => {
    setPickupLocationName('');
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(newOpen) => {
        setIsOpen(newOpen);
        if (!newOpen) {
          setPickupLocationName('');
        }
      }}>
      <DialogTrigger>
        {isEdit === true ? (
          <MdOutlineEdit
            className='w-6 h-6 cursor-pointer'
            onClick={() =>
              setPickupLocationName(selectedPickupLocation!.subLocationName)
            }
          />
        ) : (
          <Label className='text-primary font-bold cursor-pointer'>
            Add New pickup point
          </Label>
        )}
      </DialogTrigger>
      <DialogContent className={'overflow-y-scroll max-h-[80vh]'}>
        <DialogHeader>
          {isEdit === true ? (
            <>
              <DialogTitle>Edit Pickup Location</DialogTitle>
              <div className='flex flex-col'>
                <RequiredField />
                <div className='mt-10'>
                  <Label htmlFor='departure' isRequired>
                    Edit Pickup Location
                  </Label>
                  <Input
                    placeholder='Edit pickup location name ...'
                    value={pickupLocationName}
                    onChange={(e) => setPickupLocationName(e.target.value)}
                  />
                </div>
                <div className='mt-10'>
                  <Button
                    className='w-full'
                    variant='default'
                    type='submit'
                    onClick={handleAction}
                    disabled={!pickupLocationName}>
                    Save Change
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogTitle>Add New Pickup point</DialogTitle>
              <div className='flex flex-col'>
                <RequiredField />
                <div className='mt-10'>
                  <Label htmlFor='departure' isRequired>
                    Add New pickup point
                  </Label>
                  <Input
                    placeholder='Add pickup location name ...'
                    value={pickupLocationName}
                    onChange={(e) => setPickupLocationName(e.target.value)}
                  />
                </div>
                <div className='mt-10'>
                  <Button
                    className='w-full'
                    variant='default'
                    type='submit'
                    onClick={handleAction}
                    disabled={!pickupLocationName}>
                    Add
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
