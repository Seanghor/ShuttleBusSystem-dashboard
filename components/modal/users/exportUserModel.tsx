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
import { LuDownload } from 'react-icons/lu';
import RequiredField from '@/components/requiredField';
import { Label } from '@/components/ui/label';
import { GetBatchPrefix } from '@/lib/getBatchPrefix';
interface ExportUserModelProps {
  batchData: any[];
  onExportStudent: (department: string, batchNumber: string) => Promise<void>;
}
export default function ExportUserModel(props: ExportUserModelProps) {
  const { batchData, onExportStudent } = props;
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<any>('');
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleAction = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    onExportStudent(selectedDepartment, selectedBatch);
    setIsLoading(false);
    resetData();
  };

  const resetData = () => {
    setSelectedDepartment('');
    setSelectedBatch('');
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
      <DialogTrigger>
        <Button className='' variant='default' size='lg'>
          <LuDownload className='mr-5' />
          Export Users
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export users</DialogTitle>
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

            <div className='mt-10'>
              <Button
                className='w-full'
                variant='default'
                disabled={isLoading || !selectedDepartment || !selectedBatch}
                onClick={handleAction}>
                {isLoading ? 'Loading' : 'Export'}
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
