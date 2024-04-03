import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { MdOutlineEdit } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { blockingSeatUser } from '@/types/schedule';
import { Label } from '@/components/ui/label';
import RequiredField from '@/components/requiredField';

interface EditBlockingSeatModelProps {
  name: string;
  gender: string;
  id: string;
  editUser: (userId: string, userInfo: blockingSeatUser) => void;
}

export default function EditBlockingSeatModel(
  props: EditBlockingSeatModelProps
) {
  const [user, setUser] = useState<{ name: string; gender: string }>({
    name: props.name,
    gender: props.gender
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setUser({ name: props.name, gender: props.gender });
  }, [props.name, props.gender]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prevUser) => ({ ...prevUser, name: e.target.value }));
  };

  const handleGenderChange = (value: string) => {
    setUser((prevUser) => ({ ...prevUser, gender: value }));
  };

  const handleEditBlockingSeat = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    props.editUser(props.id, { name: user.name, gender: user.gender });
    setIsLoading(false);
    setUser({ name: '', gender: '' });
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(newOpen) => {
        setIsOpen(newOpen);
      }}>
      <DialogTrigger>
        <MdOutlineEdit className='cursor-pointer' />
      </DialogTrigger>
      <DialogContent className={'overflow-y-scroll max-h-[80vh]'}>
        <DialogHeader>
          <DialogTitle>Edit Blocking Seats</DialogTitle>
          <RequiredField />
          <form onSubmit={handleEditBlockingSeat}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
              <div className='flex flex-col'>
                <Label isRequired className='pb-2'>
                  Guest name
                </Label>
                <Input
                  className=''
                  placeholder='Name'
                  value={user.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className='flex flex-col'>
                <Label isRequired className='pb-2'>
                  Gender
                </Label>
                <Select
                  onValueChange={handleGenderChange}
                  defaultValue={user.gender}>
                  <SelectTrigger>
                    <SelectValue defaultValue={user.gender}>
                      {user.gender || 'Gender'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='MALE'>Male</SelectItem>
                    <SelectItem value='FEMALE'>Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='mt-10'>
              <Button
                className='w-full'
                variant='default'
                type='submit'
                disabled={isLoading}>
                Edit
              </Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
