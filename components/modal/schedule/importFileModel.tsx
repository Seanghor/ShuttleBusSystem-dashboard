import React, { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LuUpload } from 'react-icons/lu';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import RequiredField from '@/components/requiredField';

interface ImportFileModelProps {
  handleImportSchedule: (file: any) => Promise<void>;
}

export default function ImportFileModel(props: ImportFileModelProps) {
  const [selectedFile, setSelectedFile] = useState();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleUploadFile = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    if (selectedFile) {
      props.handleImportSchedule(selectedFile);
    }

    setIsLoading(false);
    setOpen(false);
  };

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
      }}>
      <DialogTrigger>
        <Button className='' variant='default' size='lg'>
          <LuUpload className='mr-5' />
          Import Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className={'overflow-y-scroll max-h-[80vh]'}>
        <DialogHeader>
          <DialogTitle>Import schedule</DialogTitle>
          <RequiredField />
          <div className='flex flex-col'>
            <div className='grid w-full  items-center gap-1.5 pt-5'>
              <Label htmlFor='picture' isRequired>
                Schedule file
              </Label>
              <Input
                id='picture'
                type='file'
                accept='.xlsx, .xls'
                onChange={handleFileChange}
              />
            </div>

            <Button
              className='w-ful mt-5 '
              variant='default'
              size='lg'
              onClick={handleUploadFile}
              disabled={!selectedFile}>
              {isLoading ? 'Loading' : 'Upload'}
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
