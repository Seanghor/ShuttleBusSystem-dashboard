import {
  BookingResponse,
  blockingSeatUser,
  BlockingResponse
} from '@/types/schedule';
import React from 'react';
import { MdDeleteOutline, MdSearchOff } from 'react-icons/md';
import { MdOutlineEdit } from 'react-icons/md';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import EditBlockingSeatModel from '../modal/schedule/editBlockingSeatModel';

interface ScheduleTableComponentProps {
  users: (BookingResponse | BlockingResponse)[];
  from: string;
  to: string;
  date: string;
  time: string;
  type?: string;
  onDeleteUser?: (guestId: string) => void;
  onEditUser?: (userId: string, userInfo: blockingSeatUser) => void;
  currentPage: number;
  dataPerPage: number;
}

export default function ScheduleTableComponent(
  props: ScheduleTableComponentProps
) {
  const {
    users,
    from,
    to,
    date,
    time,
    type,
    onDeleteUser,
    onEditUser,
    currentPage,
    dataPerPage
  } = props;
  const handleDeleteUser = (userId: string) => {
    if (onDeleteUser) {
      onDeleteUser(userId); // Pass userId to onDeleteUser prop
    }
  };
  const handleEditUser = (userId: string, userInfo: blockingSeatUser) => {
    if (onEditUser) {
      onEditUser(userId, userInfo); // Pass userId and userInfo to onEditUser prop
    }
  };

  const startIndex = (currentPage - 1) * dataPerPage;

  return props.users.length === 0 ? (
    <div className='flex justify-center items-center w-full h-full flex-col mt-10'>
      <MdSearchOff className='text-6xl text-primary' />
      <h4 className='text-primary'>Not found</h4>
    </div>
  ) : (
    <div className='overflow-x-auto relative mt-10 z-0'>
      <table className='w-full text-sm text-center border-t-4 border-t-primary'>
        <thead className='text-xs'>
          <tr>
            <th className='w-[5%] py-3 px-6 border-b border-r border-l border-gray-400'>
              No
            </th>
            <th className='py-3 px-6 border-b border-r border-gray-400'>
              Username
            </th>
            <th className='py-3 px-6 border-b border-r border-gray-400'>
              From
            </th>
            <th className='py-3 px-6 border-b border-r border-gray-400'>To</th>
            <th className='py-3 px-6 border-b border-r border-gray-400'>
              Departure Date
            </th>
            <th className='py-3 px-6 border-b border-r border-gray-400'>
              Departure Time
            </th>
            {type === 'GUEST' && (
              <th className='py-3 px-6 border-b border-r border-gray-400'>
                Action
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {users.map((user: any, index: any) => (
            <tr key={index}>
              <td className='py-2 px-6 border-b border-r border-l border-gray-400'>
                {startIndex + index + 1}
              </td>
              <td className='py-2 px-6 border-b border-r border-gray-400'>
                {type === 'GUEST' ? user.name : user.user?.username}
              </td>
              <td className='py-2 px-6 border-b border-r border-gray-400'>
                {from}
              </td>
              <td className='py-2 px-6 border-b border-r border-gray-400'>
                {to}
              </td>
              <td className='py-2 px-6 border-b border-r border-gray-400'>
                {date}
              </td>
              <td className='py-2 px-6 border-b border-r border-gray-400'>
                {time}
              </td>

              {type === 'GUEST' && (
                <td className='py-2 px-6 border-r border-b border-gray-400'>
                  <div className='flex flex-row justify-center items-center'>
                    <EditBlockingSeatModel
                      name={user.name}
                      gender={user.gender}
                      id={user.id}
                      editUser={handleEditUser}
                    />
                    <div className='px-1'></div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <MdDeleteOutline className={'cursor-pointer'} />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete this user and remove it from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(user.id)}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
