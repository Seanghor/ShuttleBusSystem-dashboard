'use client';
import DoughnutChart from '@/components/Chart';
import { IoPersonSharp } from 'react-icons/io5';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
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
import { useEffect, useState } from 'react';
import { UserResponse } from '@/types/user';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import { getCookie } from 'cookies-next';
import { getAllUserApi } from '@/services/users/getAllUser-api';
import { useRouter } from 'next/navigation';
import { getAllUserGraphApi } from '@/services/users/getAllUserGraph-api';
import { deleteUserApi } from '@/services/users/deleteUser-api';
import { useToast } from '@/components/ui/use-toast';
import { MdDeleteOutline } from 'react-icons/md';
import { getAllBatchApi } from '@/services/users/getAllBatch-api';
import { editUserApi } from '@/services/users/editUser-api';
import { addNewUserApi } from '@/services/users/addNewUser-api';
import {
  updateAdminStatusApi,
  updateUserAndStaffStatusApi
} from '@/services/users/updateUserStatus-api';
import { updateStatusByBatchApi } from '@/services/users/updateStatusByBatch-api';
import { exportStudentApi } from '@/services/users/exportStudent-api';
import KPICard from '@/components/KPICard';
import UserModel from '@/components/modal/users/userModel';
import EnableDisableUsersModel from '@/components/modal/users/enable-disableModel';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { IoSearch } from 'react-icons/io5';
import ExportUserModel from '@/components/modal/users/exportUserModel';

const UserManagement = () => {
  const [userData, setUserData] = useState<UserResponse[]>([]);
  const [userGraphData, setUserGraphData] = useState<any[]>([]);
  const [batchData, setBatchData] = useState<any[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const { toast } = useToast();

  // Filter Status
  const [filterStatus, setFilterStatus] = useState('All');

  // Search
  const [search, setSearch] = useState('');

  // Role
  const [role, setRole] = useState('STUDENT');

  // Validation

  const { push } = useRouter();

  useEffect(() => {
    const getAllUser = async () => {
      try {
        const token = getCookie('token');
        const res = await getAllUserApi({
          token: token,
          currentPage: currentPage,
          dataPerPage: dataPerPage,
          filterStatus: filterStatus,
          search: search,
          role: role
        });

        setUserData(res.data.data);

        setTotalPages(res.data.pagination.totalPage);
      } catch (err) {
        console.log(err);
        push('/server-error');
      }
    };
    getAllUser();
  }, [currentPage, dataPerPage, filterStatus, search, role, push]);

  useEffect(() => {
    const getAllUserGraph = async () => {
      try {
        const token = getCookie('token');
        const res = await getAllUserGraphApi({
          token: token
        });
        setUserGraphData(res.data);
      } catch (err) {
        console.log(err);
        push('/server-error');
      }
    };
    getAllUserGraph();
  }, [push]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Search
  const handleSearch = (event: any) => {
    setSearch(event.target.value);
    setCurrentPage(1); // Reset to the first page
  };

  // Conditional table headers based on the selected role
  const renderTableHeaders = () => {
    if (role === 'ADMIN') {
      return (
        <tr>
          <th
            scope='col'
            style={{ width: '3%' }}
            className='py-3 px-6 border-b border-r border-l border-gray-400'>
            No
          </th>
          <th
            scope='col'
            className='py-3 px-6 border-b border-r border-gray-400'>
            Username
          </th>
          <th
            scope='col'
            className='py-3 px-6 border-b border-r border-gray-400'>
            Gender
          </th>
          <th
            scope='col'
            className='py-3 px-6 border-b border-r border-gray-400'>
            Email
          </th>
          <th
            scope='col'
            className='py-3 px-6 border-b border-r border-gray-400'>
            Status
          </th>
          <th
            scope='col'
            className='py-3 px-6 border-b border-r border-gray-400'>
            Active
          </th>
          <th
            scope='col'
            className='py-3 px-6 border-b border-r border-gray-400'>
            Action
          </th>
        </tr>
      );
    } else if (role === 'STAFF') {
      return (
        <tr>
          <th
            scope='col'
            style={{ width: '3%' }}
            className='py-3 px-6 border-b border-r border-l border-gray-400'>
            No
          </th>
          <th
            scope='col'
            className='py-3 px-6 border-b border-r border-gray-400'>
            Username
          </th>
          <th
            scope='col'
            className='py-3 px-6 border-b border-r border-gray-400'>
            Gender
          </th>
          <th
            scope='col'
            className='py-3 px-6 border-b border-r border-gray-400'>
            Email
          </th>
          <th
            scope='col'
            className='py-3 px-6 border-b border-r border-gray-400'>
            Status
          </th>
          <th
            scope='col'
            className='py-3 px-6 border-b border-r border-gray-400'>
            Active
          </th>
          <th
            scope='col'
            className='py-3 px-6 border-b border-r border-gray-400'>
            Ticket
          </th>
          <th
            scope='col'
            className='py-3 px-6 border-b border-r border-gray-400'>
            Action
          </th>
        </tr>
      );
    } else {
      // Default set of headers for other roles
      return (
        <tr>
          <th
            scope='col'
            style={{ width: '3%' }}
            className='py-3 px-6 border-b border-r border-l border-gray-400'>
            No
          </th>
          <th
            scope='col'
            className='py-3 px-6 border-b border-r border-gray-400'>
            Username
          </th>
          <th
            scope='col'
            className='py-3 px-6 border-b border-r border-gray-400'>
            Gender
          </th>
          <th
            scope='col'
            className='py-3 px-6 border-b border-r border-gray-400'>
            Department
          </th>
          <th
            scope='col'
            className='py-3 px-6 border-b border-r border-gray-400'>
            Batch
          </th>
          <th
            scope='col'
            className='py-3 px-6 border-b border-r border-gray-400'>
            Email
          </th>
          <th
            scope='col'
            className='py-3 px-6 border-b border-r border-gray-400'>
            Status
          </th>
          <th
            scope='col'
            className='py-3 px-6 border-b border-r border-gray-400'>
            Active
          </th>
          <th
            scope='col'
            className='py-3 px-6 border-b border-r border-gray-400'>
            Ticket
          </th>
          <th
            scope='col'
            className='py-3 px-6 border-b border-r border-gray-400'>
            Action
          </th>
        </tr>
      );
    }
  };

  const renderTableRow = (user: UserResponse, index: number) => {
    if (role === 'ADMIN') {
      return (
        <tr
          key={user.id}
          className={
            user.enable ? 'bg-white' : 'text-gray-400 bg-opacity-60 bg-white'
          }>
          <td className='py-2 px-6 border-r border-b border-gray-400'>
            {index + 1}
          </td>
          <td className='py-2 px-6 border-r border-b border-gray-400'>
            {user.username}
          </td>
          <td className='py-2 px-6 border-r border-b border-gray-400'>
            {user?.gender ? `${user?.gender}` : 'N/A'}
          </td>
          <td className='py-2 px-6 border-r border-b border-gray-400'>
            {user.email}
          </td>
          <td className='py-2 px-6 border-r border-b border-gray-400'>
            {user.inKRR ? 'In KRR' : 'Out KRR'}
          </td>
          <td className='py-2 px-6 border-r border-b border-gray-400'>
            <button
              className={`relative inline-block w-12 h-6 rounded-full shadow-inner transition duration-300 ease-in-out ${
                user.enable ? 'bg-green-800' : 'bg-gray-200'
              }`}
              onClick={() => toggleUserStatus(user.id)}>
              <span
                className={`absolute left-0 top-0 w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-md transition duration-300 ease-in-out ${
                  user.enable
                    ? 'translate-x-full border-green-800'
                    : 'translate-x-0 border-gray-400'
                }`}></span>
            </button>
          </td>
          <td className='py-2 px-6 border-r border-b border-gray-400'>
            <div className='flex items-center gap-5'>
              <UserModel
                isEdit={true}
                batchData={batchData}
                selectedUser={user}
                onEditUser={onEditUser}
              />
            </div>
          </td>
        </tr>
      );
    } else if (role === 'STAFF') {
      return (
        <tr
          key={user.id}
          className={
            user.enable ? 'bg-white' : 'text-gray-400 bg-opacity-60 bg-white '
          }>
          <td className='py-2 px-2 border-r border-b border-gray-400 border-l text-center'>
            {(currentPage - 1) * dataPerPage + index + 1}
          </td>
          <td className='py-2 px-6 border-r border-b border-gray-400'>
            {user?.username}
          </td>
          <td className='py-2 px-6 border-r border-b border-gray-400'>
            {user?.gender ? `${user?.gender}` : 'N/A'}
          </td>

          <td className='py-2 px-6 border-r border-b border-gray-400'>
            {user?.email}
          </td>
          <td className='py-2 px-6 border-r border-b border-gray-400'>
            {user.inKRR ? 'In KRR' : 'Out KRR'}
          </td>

          <td className='py-2 px-6 border-r border-b border-gray-400'>
            <button
              className={`relative inline-block w-12 h-6 rounded-full shadow-inner transition duration-300 ease-in-out ${
                user.enable ? 'bg-green-800' : 'bg-gray-200'
              }`}
              onClick={() => toggleUserStatus(user.id)}>
              <span
                className={`absolute left-0 top-0 w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-md transition duration-300 ease-in-out ${
                  user.enable
                    ? 'translate-x-full border-green-800'
                    : 'translate-x-0 border-gray-400'
                }`}></span>
            </button>
          </td>

          <td className='py-2 px-6 border-r border-b border-gray-400'>
            {user?.ticket?.remainTicket}/36
          </td>

          <td className='py-2 px-6 border-r border-b border-gray-400'>
            <div className='flex items-center gap-5'>
              <UserModel
                isEdit={true}
                batchData={batchData}
                selectedUser={user}
                onEditUser={onEditUser}
              />

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <MdDeleteOutline className='cursor-pointer' />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      user and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteUserConfirm(user.id)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </td>
        </tr>
      );
    } else {
      return (
        <tr
          key={user.id}
          className={
            user.enable ? 'bg-white' : 'text-gray-400 bg-opacity-60 bg-white'
          }>
          <td className='py-2 px-2 border-r border-b border-gray-400 border-l text-center'>
            {(currentPage - 1) * dataPerPage + index + 1}
          </td>
          <td className='py-2 px-6 border-r border-b border-gray-400'>
            {user?.username}
          </td>
          <td className='py-2 px-6 border-r border-b border-gray-400'>
            {user?.gender ? `${user?.gender}` : 'N/A'}
          </td>
          <td className='py-2 px-6 border-r border-b border-gray-400'>
            {user?.studentInfo?.batch?.department}
          </td>
          <td className='py-2 px-6 border-r border-b border-gray-400'>
            {user?.studentInfo?.batch?.batchNum}
          </td>
          <td className='py-2 px-6 border-r border-b border-gray-400'>
            {user?.email}
          </td>
          <td className='py-2 px-6 border-r border-b border-gray-400'>
            {user?.inKRR ? 'In KRR' : 'Out KRR'}
          </td>

          <td className='py-2 px-6 border-r border-b border-gray-400'>
            <button
              className={`relative inline-block w-12 h-6 rounded-full shadow-inner transition duration-300 ease-in-out ${
                user.enable ? 'bg-green-800' : 'bg-gray-200'
              }`}
              onClick={() => toggleUserStatus(user.id)}>
              <span
                className={`absolute left-0 top-0 w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-md transition duration-300 ease-in-out ${
                  user.enable
                    ? 'translate-x-full border-green-800'
                    : 'translate-x-0 border-gray-400'
                }`}></span>
            </button>
          </td>
          <td className='py-2 px-6 border-r border-b border-gray-400'>
            {user?.ticket?.remainTicket}/36
          </td>
          <td className='py-2 px-6 border-r border-b border-gray-400'>
            <div className='flex items-center gap-5'>
              <UserModel
                isEdit={true}
                batchData={batchData}
                selectedUser={user}
                onEditUser={onEditUser}
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <MdDeleteOutline className='cursor-pointer' />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      user and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteUserConfirm(user.id)}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </td>
        </tr>
      );
    }
  };

  const getColSpan = () => {
    switch (role) {
      case 'ADMIN':
        return 7;
      case 'STAFF':
        return 8;
      default:
        return 10;
    }
  };

  const toggleUserStatus = async (userId: any) => {
    try {
      const userIndex = userData.findIndex((user) => user.id === userId);
      if (userIndex === -1) return;
      const selectedUser = userData[userIndex];
      const enableStatus = selectedUser.enable;
      const token = getCookie('token');

      if (selectedUser.role === 'ADMIN') {
        const res = await updateAdminStatusApi({
          token: token,
          status: enableStatus,
          userId: userId
        });
        if (res.status === 200) {
          toast({
            variant: 'default',
            title: 'Update Successfully',
            description: 'User status update successfully'
          });
          const updatedUsers = [...userData];
          updatedUsers[userIndex].enable = !enableStatus;
          setUserData(updatedUsers);
        } else if (res.status === 403) {
          toast({
            variant: 'destructive',
            title: 'Something went wrong',
            description: 'You do not have authorize to do so'
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Something went wrong',
            description: 'Error occurred during the request.'
          });
        }
      } else {
        const res = await updateUserAndStaffStatusApi({
          token: token,
          status: enableStatus,
          userId: userId
        });
        if (res.status === 200) {
          toast({
            variant: 'default',
            title: 'Update Successfully',
            description: 'User status update successfully'
          });
          const updatedUsers = [...userData];
          updatedUsers[userIndex].enable = !enableStatus;
          setUserData(updatedUsers);
        } else if (res.status === 403) {
          toast({
            variant: 'destructive',
            title: 'Something went wrong',
            description: 'You do not have authorize to do so'
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Something went wrong',
            description: 'Error occurred during the request.'
          });
        }
      }
    } catch (err) {
      push('/server-error');
      console.error('Failed to toggle user status:', err);
    }
  };

  const handleDeleteUserConfirm = async (userId: string) => {
    const token = getCookie('token');

    const res = await deleteUserApi({ token: token, userId: userId });
    if (res.status === 200) {
      toast({
        variant: 'default',
        title: 'Deleted Successfully',
        description: 'User deleted successfully'
      });
      const updatedUserData = userData.filter((user) => user.id !== userId);
      setUserData(updatedUserData);
    } else {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Error occurred during the request.'
      });
    }
  };

  useEffect(() => {
    const getAllBatch = async () => {
      try {
        const token = getCookie('token');
        const res = await getAllBatchApi({ token: token });
        setBatchData(res.data);
      } catch (err) {
        push('/server-error');
        console.log(err);
      }
    };
    getAllBatch();
  }, [push]);

  async function onSaveUser(
    role: string,
    email: string,
    userName: string,
    password: string,
    department: string,
    gender: string,
    inKrr: boolean,
    batchNum: number
  ) {
    const data = {
      role: role,
      email: email,
      username: userName,
      password: password,
      department: department,
      gender: gender,
      inKrr: inKrr,
      batchNum: batchNum
    };
    try {
      const token = getCookie('token');
      const res = await addNewUserApi({
        token: token,
        data: data
      });

      console.log(res);
      if (res.status === 201 || res.status === 200) {
        toast({
          variant: 'default',
          title: 'Added Successfully',
          description: 'User Add successfully'
        });

        if (role === 'STUDENT') {
          setUserData(
            [
              // NOTE: since backend dont provide this data and they dont want to change it
              {
                ...res.data.data,
                studentInfo: {
                  batch: {
                    department: department,
                    batchNum: batchNum
                  }
                },
                ticket: {
                  remainTicket: 36
                }
              },
              ...userData
            ].slice(0, dataPerPage)
          );
          
        } else if (role === 'STAFF') {
          setUserData(
            [
              // NOTE: since backend dont provide this data and they dont want to change it
              {
                ...res.data.data,

                ticket: {
                  remainTicket: 36
                }
              },
              ...userData
            ].slice(0, dataPerPage)
          );
        } else {
          setUserData([res.data.data, ...userData]);
        }
      } else if (res.status === 409) {
        toast({
          variant: 'destructive',
          title: 'Failed to create',
          description: 'Email already in use'
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Something went wrong',
          description: 'Something went'
        });
      }
    } catch (err) {
      push('/server-error');
      console.log(err);
    }
  }

  async function onEditUser(
    userId: string,
    role: string,
    email: string,
    userName: string,
    password: string,
    department: string,
    gender: string,
    inKrr: boolean,
    batchNum: number
  ) {
    const data = {
      role: role,
      email: email,
      username: userName,
      password: password,
      department: department,
      gender: gender,
      inKrr: inKrr,
      batchNum: batchNum
    };

    try {
      const token = getCookie('token');
      const res = await editUserApi({
        token: token,
        userId: userId,
        data: data
      });

      if (res.status === 200) {
        toast({
          variant: 'default',
          title: 'Edited Successfully',
          description: 'User edited successfully'
        });

        const updatedUsers = userData.map((user) => {
          if (user.id === userId) {
            return { ...user, ...res.data.data };
          }
          return user;
        });

        setUserData(updatedUsers);
      } else if (res.status === 409) {
        toast({
          variant: 'destructive',
          title: 'Failed to create',
          description: 'Email already in use'
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Something went wrong',
          description: 'Something went'
        });
      }
    } catch (err) {
      push('/server-error');
      console.log(err);
    }
  }

  async function onEnableDisableBatch(
    selectedDepartment: string,
    selectedBatch: string,
    enable: boolean
  ) {
    const data = {
      department: selectedDepartment,
      batchNum: Number(selectedBatch),
      enable: enable
    };

    try {
      const token = getCookie('token');

      const res = await updateStatusByBatchApi({
        token: token,
        data: data
      });

      if (res.status === 200) {
        toast({
          variant: 'default',
          title: 'Update Successfully',
          description: 'Update by batch successfully'
        });
        const updatedUsers = userData.map((user) => {
          if (
            user.studentInfo?.batch?.department === selectedDepartment &&
            user.studentInfo?.batch?.batchNum === Number(selectedBatch)
          ) {
            return { ...user, enable: enable };
          }
          return user;
        });
        setUserData(updatedUsers);
      } else {
        toast({
          variant: 'destructive',
          title: 'Something went wrong',
          description: 'Something went'
        });
      }
    } catch (err) {
      push('/server-error');
      console.log(err);
    }
  }

  async function onExportStudent(
    selectedDepartment: string,
    selectedBatch: string
  ) {
    try {
      const token = getCookie('token');
      const res = await exportStudentApi({
        token: token,
        selectedBatch: selectedBatch,
        selectedDepartment: selectedDepartment
      });
    } catch (err) {
      push('/server-error');
      console.log(err);
    }
  }

  return (
    <div className='px-5 pt-12'>
      <div className='grid grid-cols-1 md:grid-cols-2 items-center gap-5'>
        <h1 className='font-bold text-3xl mt-5'>User Management</h1>
        <div className='flex justify-start md:justify-end'>
          <UserModel
            isEdit={false}
            batchData={batchData}
            onSaveUser={onSaveUser}
          />
        </div>
      </div>

      <div className='mt-5 flex flex-row justify-between items-center flex-wrap gap-5'>
        <DoughnutChart />

        <div className='flex flex-row flex-wrap gap-5'>
          <div className='mr-5'>
            <Link href='/dashboard'>
              <KPICard
                icon={<IoPersonSharp className='w-8 h-8' />}
                label='Students'
                amount={
                  userGraphData.filter((item: any) => item.role === 'STUDENT')
                    .length
                }
              />
            </Link>
          </div>
          <div className='mr-5'>
            <KPICard
              icon={<IoPersonSharp className='w-8 h-8' />}
              label='Admins'
              amount={
                userGraphData.filter((item: any) => item.role === 'ADMIN')
                  .length
              }
            />
          </div>
          <div>
            <KPICard
              icon={<IoPersonSharp className='w-8 h-8' />}
              label='Staffs'
              amount={
                userGraphData.filter((item: any) => item.role === 'STAFF')
                  .length
              }
            />
          </div>
        </div>
      </div>

      <div className='mt-20 flex justify-between flex-wrap gap-5'>
        <Tabs
          defaultValue='STUDENT'
          className='w-full'
          onValueChange={(value) => {
            setRole(value);
            setCurrentPage(1);
          }}>
          <TabsList>
            <TabsTrigger value='STUDENT'>Students</TabsTrigger>
            <TabsTrigger value='ADMIN'>Admin</TabsTrigger>
            <TabsTrigger value='STAFF'>Staffs</TabsTrigger>
          </TabsList>
        </Tabs>

        <div>
          {/* Search */}
          <div className='relative block'>
            <IoSearch className='pointer-events-none w-4 h-4 absolute top-1/2 transform -translate-y-1/2 left-3 text-primary' />
            <Input
              type='search'
              name='search'
              id='search'
              placeholder='Search by name and batch'
              className='pl-10 w-[275px]'
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className='flex flex-wrap gap-5 col-span-2 justify-start md:justify-end'>
          {/* Enable status by batch */}
          <div>
            <EnableDisableUsersModel
              batchData={batchData}
              onEnableDisableBatch={onEnableDisableBatch}
            />
          </div>

          <div className='flex gap-3 justify-start xl:justify-center items-center'>
            <Label>Status: </Label>

            <Select
              defaultValue={filterStatus}
              onValueChange={(value) => {
                setFilterStatus(value);
                setCurrentPage(1);
              }}>
              <SelectTrigger className='w-[200px]'>
                <SelectValue placeholder='Select Gender' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='All'>All</SelectItem>
                <SelectItem value='inKRR'>In Kirirom</SelectItem>
                <SelectItem value='notInKRR'>Outside Kirirom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* PerPpage */}
          <div className='flex gap-3 justify-start xl:justify-center items-center'>
            <Label>Per Page: </Label>

            <Select
              defaultValue={dataPerPage.toString()}
              onValueChange={(value) => {
                setDataPerPage(Number(value));
                setCurrentPage(1);
              }}>
              <SelectTrigger className='w-[100px]'>
                <SelectValue placeholder='Select Gender' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='10'>10</SelectItem>
                <SelectItem value='25'>25</SelectItem>
                <SelectItem value='50'>50</SelectItem>
                <SelectItem value='100'>100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className='overflow-x-auto relative mt-5 z-0'>
        <table className='w-full text-sm text-left border-t-4 border-t-[#0E6431]'>
          <thead className='text-xs'>{renderTableHeaders()}</thead>
          <tbody>
            {userData.length === 0 ? (
              <tr className='bg-white border-b border-gray-400 border-r border-l hover:bg-gray-200'>
                <td colSpan={getColSpan()} className='text-center py-4'>
                  No data available
                </td>
              </tr>
            ) : (
              userData.map((user: UserResponse, index: number) =>
                renderTableRow(user, index)
              )
            )}
          </tbody>
        </table>
      </div>

      <div className='flex flex-wrap items-center justify-between mt-5 gap-5'>
        <ExportUserModel
          batchData={batchData}
          onExportStudent={onExportStudent}
        />

        <div className='flex justify-end items-center mt-5'>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
