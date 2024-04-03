import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { FaToggleOff } from 'react-icons/fa';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { GetBatchPrefix } from '@/lib/getBatchPrefix';
import { Checkbox } from '@/components/ui/checkbox';
import RequiredField from '@/components/requiredField';

interface EnableDisableUserModelProps {
  batchData: any[];
  onEnableDisableBatch: (
    department: string,
    batchNumber: string,
    enableStatus: boolean
  ) => Promise<void>;
}

export default function EnableDisableUsersModel(
  props: EnableDisableUserModelProps
) {
  const { batchData, onEnableDisableBatch } = props;

  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<any>('');
  const [enable, setEnable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState(false);

  const handleAction = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    onEnableDisableBatch(selectedDepartment, selectedBatch, enable);
    setIsLoading(false);
    resetData();
  };

  const resetData = () => {
    setSelectedDepartment('');
    setSelectedBatch('');
    setEnable(false);
    setOpen(false);
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
        <Button className='' variant='default' size='lg'>
          <FaToggleOff className='mr-5' />
          Disable Users
        </Button>
      </DialogTrigger>
      <DialogContent className={'overflow-y-scroll max-h-[80vh]'}>
        <DialogHeader>
          <DialogTitle>Enable / Disable Users</DialogTitle>
          <RequiredField />
          <div className='flex flex-col'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
              <div className='flex flex-col'>
                <Label htmlFor='From' className='pb-2' isRequired>
                  Department
                </Label>

                <Select onValueChange={(value) => setSelectedDepartment(value)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select Department' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='SOFTWAREENGINEERING'>
                      Software Engineering
                    </SelectItem>
                    <SelectItem value='TOURISMANDMANAGEMENT'>
                      Tourism and Management
                    </SelectItem>
                    <SelectItem value='ARCHITECTURE'>Architecture</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='flex flex-col'>
                <Label htmlFor='From' className='pb-2' isRequired>
                  Batch
                </Label>

                <Select onValueChange={(value) => setSelectedBatch(value)}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select Batch' />
                  </SelectTrigger>
                  <SelectContent>
                    {batchData
                      .filter(
                        (batch) => batch.department === selectedDepartment
                      )
                      .map((filteredBatch) => (
                        <SelectItem
                          key={filteredBatch.id}
                          value={filteredBatch.batchNum}>
                          {`${GetBatchPrefix(selectedDepartment)}${
                            filteredBatch.batchNum
                          }`}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='flex items-center space-x-2 mt-5'>
              <Checkbox id='change password' onClick={() => setEnable(true)} />
              <label
                htmlFor='terms'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                Enable
              </label>
            </div>
            <div className='mt-10'>
              <Button
                className='w-full'
                variant='default'
                disabled={isLoading || !selectedDepartment || !selectedBatch}
                onClick={handleAction}>
                {isLoading ? 'Loading' : 'Save Change'}
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
