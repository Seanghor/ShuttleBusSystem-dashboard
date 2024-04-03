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
import { MainLocation } from '@/app/location/page';
import RequiredField from '@/components/requiredField';

interface MainLocationModelProps {
  onSaveMainLocation?: (mainLocationName: string) => Promise<void>;
  onEditMainLocation?: (
    mainLocationName: string,
    mainLocationId: string
  ) => Promise<void>;
  isEdit: boolean;
  selectedMainLocation?: MainLocation;
}
export default function MainLocationModel(props: MainLocationModelProps) {
  const {
    onSaveMainLocation,
    onEditMainLocation,
    isEdit,
    selectedMainLocation
  } = props;
  const [isOpen, setIsOpen] = useState(false);

  const [mainLocationName, setMainLocationName] = useState('');

  const handleAction = (e: any) => {
    if (onSaveMainLocation) {
      onSaveMainLocation(mainLocationName);
    }
    if (onEditMainLocation) {
      onEditMainLocation(mainLocationName, selectedMainLocation!.id);
    }
    resetData();
  };

  const resetData = () => {
    setMainLocationName('');
    setIsOpen(false);
  };
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(newOpen) => {
        setIsOpen(newOpen);
        if (!newOpen) {
          setMainLocationName('');
        }
      }}>
      <DialogTrigger>
        {isEdit === true ? (
          <Label
            onClick={() =>
              setMainLocationName(selectedMainLocation!.mainLocationName)
            }
            className='text-white'>
            Edit
          </Label>
        ) : (
          <Button className='' variant='default' size='lg'>
            <FaPlus className='mr-5' />
            Add New Location
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className={'overflow-y-scroll max-h-[80vh]'}>
        <DialogHeader>
          {isEdit === true ? (
            <>
              <DialogTitle>Edit Location</DialogTitle>
              <div className='flex flex-col'>
                <RequiredField />
                <div className='mt-10'>
                  <Label htmlFor='Location' isRequired>
                    Edit Location
                  </Label>
                  <Input
                    placeholder='Edit main location name ...'
                    value={mainLocationName}
                    onChange={(e) => setMainLocationName(e.target.value)}
                  />
                </div>
                <div className='mt-10'>
                  <Button
                    className='w-full'
                    variant='default'
                    type='submit'
                    onClick={handleAction}
                    disabled={!mainLocationName}>
                    Save Change
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogTitle>Add New Location</DialogTitle>
              <div className='flex flex-col'>
                <RequiredField />
                <div className='mt-10'>
                  <Label htmlFor='Location' isRequired>
                    Add New Location
                  </Label>
                  <Input
                    placeholder='Add main location name ...'
                    value={mainLocationName}
                    onChange={(e) => setMainLocationName(e.target.value)}
                  />
                </div>
                <div className='mt-10'>
                  <Button
                    className='w-full'
                    variant='default'
                    type='submit'
                    onClick={handleAction}
                    disabled={!mainLocationName}>
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
