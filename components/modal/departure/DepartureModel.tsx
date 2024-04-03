import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FaPlus } from 'react-icons/fa';
import { MainLocation } from '@/app/location/page';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import RequiredField from '@/components/requiredField';

interface DepartureModalProps {
  allLocation: MainLocation[];
  onSave: (
    selectedFromMainLocationId: string,
    selectedToMainLocationId: string,
    selectedPickupSubLocationId: string,
    selectedDropLocationId: string,
    time: string
  ) => Promise<void>;
}
export default function DepartureModel(props: DepartureModalProps) {
  const { allLocation, onSave } = props;

  const [selectedFromMainLocationId, setSelectedFromMainLocationId] =
    useState('');
  const [selectedToMainLocationId, setSelectedToMainLocationId] = useState('');
  const [selectedPickupSubLocationId, setSelectedPickupSubLocationId] =
    useState('');
  const [selectedDropLocationId, setSelectDropLocationId] = useState('');

  const [time, setTime] = useState('');
  const [open, setOpen] = useState(false);

  const [option, setOption] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    onSave(
      selectedFromMainLocationId,
      selectedToMainLocationId,
      selectedPickupSubLocationId,
      selectedDropLocationId,
      time
    );
    setOpen(false);
    resetData();
    setIsLoading(false);
  };

  const resetData = () => {
    setSelectedFromMainLocationId('');
    setSelectedToMainLocationId('');
    setSelectedPickupSubLocationId('');
    setSelectDropLocationId('');
    setTime('');
  };

  useEffect(() => {
    const options = [];
    for (let hour = 1; hour <= 24; hour++) {
      for (let minute = 0; minute < 60; minute += 5) {
        if (hour === 24 && minute !== 0) continue;
        options.push(
          `${hour.toString().padStart(2, '0')}:${minute
            .toString()
            .padStart(2, '0')}`
        );
      }
    }
    setOption(options);
  }, []);

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
        <Button className='' variant='default' size='lg'>
          <FaPlus className='mr-5' />
          Add New Departure
        </Button>
      </DialogTrigger>
      <DialogContent className={'overflow-y-scroll max-h-[80vh]'}>
        <DialogHeader>
          <DialogTitle> Add New Departure</DialogTitle>

          <div className='flex flex-col'>
            <RequiredField />
            <h5 className='font-bold mt-10'>Destination Information</h5>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
              <div className='flex flex-col'>
                <Label htmlFor='From' className='pb-2' isRequired>
                  From
                </Label>
                <Select
                  onValueChange={(value) => {
                    setSelectedFromMainLocationId(value);
                  }}>
                  <SelectTrigger className='w-full '>
                    <SelectValue placeholder='Select From Location' />
                  </SelectTrigger>
                  <SelectContent>
                    {allLocation
                      .filter(
                        (data: MainLocation) =>
                          data.id !== selectedToMainLocationId
                      )
                      .map((data: MainLocation, index: number) => (
                        <SelectItem key={index} value={data.id}>
                          {data.mainLocationName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='flex flex-col'>
                <Label htmlFor='To' className='pb-2' isRequired>
                  To
                </Label>
                <Select
                  onValueChange={(value) => {
                    setSelectedToMainLocationId(value);
                  }}>
                  <SelectTrigger className='w-full '>
                    <SelectValue placeholder='Select To Location' />
                  </SelectTrigger>
                  <SelectContent>
                    {allLocation
                      .filter(
                        (data: MainLocation) =>
                          data.id !== selectedFromMainLocationId
                      )
                      .map((data: MainLocation, index: number) => (
                        <SelectItem key={index} value={data.id}>
                          {data.mainLocationName}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='flex flex-col'>
                <Label htmlFor='driver name' isRequired className='pb-2'>
                  Pickup Location
                </Label>
                <Select
                  onValueChange={(value) => {
                    setSelectedPickupSubLocationId(value);
                  }}>
                  <SelectTrigger className='w-full '>
                    <SelectValue placeholder='Select To Location' />
                  </SelectTrigger>
                  <SelectContent>
                    {allLocation
                      .filter((data) => data.id === selectedFromMainLocationId)
                      .flatMap((data) =>
                        data.SubLocation.map((subLocation) => (
                          <SelectItem
                            key={subLocation.id}
                            value={subLocation.id}>
                            {subLocation.subLocationName}
                          </SelectItem>
                        ))
                      )}
                  </SelectContent>
                </Select>
              </div>

              <div className='flex flex-col'>
                <Label htmlFor='driver name' isRequired className='pb-2'>
                  Drop off Location
                </Label>
                <Select
                  onValueChange={(value) => {
                    setSelectDropLocationId(value);
                  }}>
                  <SelectTrigger className='w-full '>
                    <SelectValue placeholder='Select To Location' />
                  </SelectTrigger>
                  <SelectContent>
                    {allLocation
                      .filter((data) => data.id === selectedToMainLocationId)
                      .flatMap((data) =>
                        data.SubLocation.map((subLocation) => (
                          <SelectItem
                            key={subLocation.id}
                            value={subLocation.id}>
                            {subLocation.subLocationName}
                          </SelectItem>
                        ))
                      )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className='flex flex-col'>
            <h5 className='font-bold mt-10'>Departure Information</h5>

            <div className='flex flex-col mt-5'>
              <Label htmlFor='driver name' isRequired className='pb-2'>
                Departure time
              </Label>
              <Select
                onValueChange={(value) => {
                  setTime(value);
                }}>
                <SelectTrigger className='w-full '>
                  <SelectValue placeholder='Select departure time' />
                </SelectTrigger>
                <SelectContent>
                  {option.map((data) => (
                    <SelectItem key={data} value={data}>
                      {data}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='mt-10'>
              <Button
                className='w-full'
                variant='default'
                disabled={
                  !selectedDropLocationId ||
                  !selectedFromMainLocationId ||
                  !selectedToMainLocationId ||
                  !selectedPickupSubLocationId ||
                  (!time && !isLoading)
                }
                onClick={handleSave}>
                {isLoading ? 'Loading' : 'Add'}
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
