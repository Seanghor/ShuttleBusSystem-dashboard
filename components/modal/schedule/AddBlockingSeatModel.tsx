import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MdDeleteOutline } from 'react-icons/md';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { blockingSeatUser } from '@/types/schedule';
import RequiredField from '@/components/requiredField';
import { Label } from '@/components/ui/label';

interface AddBlockSeatModelProps {
  onSave: (user: blockingSeatUser[]) => Promise<void>;
}
export default function AddBlockingSeatModel(props: AddBlockSeatModelProps) {
  const [users, setUsers] = useState<{ name: string; gender: string }[]>([
    { name: '', gender: '' }
  ]);
  const [numberOfUser, setNumberOfUser] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    props.onSave(users);
    setIsLoading(false);
    handleClose();
    setIsOpen(false);
  };

  const deleteUser = (userNo: number) => {
    const updatedUsers = users.filter((_, index) => index !== userNo);
    setUsers(updatedUsers);
    setNumberOfUser((prev) => prev - 1);
    const adjustedUsers = updatedUsers.map((user, index) => {
      if (index >= userNo) {
        return { ...user, gender: users[index]?.gender || '' };
      }
      return user;
    });
    setUsers(adjustedUsers);
  };

  const handleGenderChange = (userNo: number, gender: string) => {
    const updatedUsers = [...users];
    updatedUsers[userNo].gender = gender;
    setUsers(updatedUsers);
  };

  const handleClose = () => {
    setUsers([{ name: '', gender: '' }]);
    setNumberOfUser(1);
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(newOpen) => {
        setIsOpen(newOpen);
        if (!newOpen) {
          handleClose();
        }
      }}>
      <DialogTrigger asChild>
        <Button variant='default'>Add Blocking Seats</Button>
      </DialogTrigger>

      <DialogContent className={'overflow-y-scroll max-h-[80vh]'}>
        <DialogHeader>
          <DialogTitle>Add Blocking Seats</DialogTitle>

          <div className='flex flex-col'>
            <RequiredField />
            <div className='flex flex-col'>
              <h5 className='font-bold mt-10'>Blocking seat Information</h5>
            </div>

            {Array.from({ length: numberOfUser }, (_, userNo) => (
              <div className='flex flex-col my-5' key={userNo}>
                <div className='flex flex-row justify-between items-center'>
                  <p>Blocking Seat {userNo + 1}</p>
                  <Button
                    className='w-1/4 items-end'
                    variant='destructive'
                    onClick={() => {
                      if (numberOfUser === 1) {
                        handleClose();
                        setIsOpen(false);
                      } else {
                        deleteUser(userNo);
                      }
                    }}>
                    <MdDeleteOutline className='w-5 h-5' />
                  </Button>
                </div>

                <div className='flex flex-row justify-between items-center mt-5 mb-5'>
                  <div className='flex flex-col'>
                    <Label isRequired className='pb-2'>
                      Guest name
                    </Label>
                    <Input
                      className=' mr-5'
                      placeholder='Name'
                      value={users[userNo].name}
                      onChange={(e) => {
                        const updatedUsers = [...users];
                        updatedUsers[userNo].name = e.target.value;
                        setUsers(updatedUsers);
                      }}
                    />
                  </div>

                  <div className='flex flex-col'>
                    <Label isRequired className='pb-2'>
                      Gender
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        handleGenderChange(userNo, value as string)
                      }>
                      <SelectTrigger className='w-[180px]'>
                        <SelectValue placeholder='Gender' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='MALE'>Male</SelectItem>
                        <SelectItem value='FEMALE'>Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <hr className='border-t border-primary/50' />
              </div>
            ))}

            <div className='flex flex-row items-end justify-end '>
              <Button
                className='w-1/4 items-end'
                variant='default'
                disabled={
                  !users[numberOfUser - 1].name ||
                  !users[numberOfUser - 1].gender
                }
                onClick={() => {
                  setNumberOfUser((prev) => prev + 1);
                  setUsers((prev) => [...prev, { name: '', gender: '' }]);
                }}>
                Add Other
              </Button>
            </div>

            <div className='mt-10'>
              <Button
                className='w-full'
                variant='default'
                // type='submit'
                onClick={() => handleSave()}
                disabled={
                  isLoading || users.some((user) => !user.name || !user.gender)
                }>
                Add
              </Button>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
