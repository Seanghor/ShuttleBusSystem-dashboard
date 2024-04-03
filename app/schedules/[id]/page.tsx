'use client';
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScheduleTableComponent from '@/components/schedule/scheduleTable';
import KPICard from '@/components/KPICard';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import { getScheduleApi } from '@/services/schedules/getSchedule-api';
import {
  BlockingResponse,
  BookingResponse,
  CancelResponse,
  ScheduleResponseData,
  WaittingResponse,
  blockingSeatUser
} from '@/types/schedule';
import { FormatDate } from '@/lib/format_date';
import { FormatTime } from '@/lib/format_time';
import {
  LuCalendarClock,
  LuCalendarX2,
  LuCalendarCheck2,
  LuCalendarHeart,
  LuDownload
} from 'react-icons/lu';
import Pagination from '@/components/Pagination';
import AddBlockingSeatModel from '@/components/modal/schedule/AddBlockingSeatModel';
import { addBlockSeatScheduleApi } from '@/services/schedules/addBlockSeat-api';
import { useToast } from '@/components/ui/use-toast';
import { deleteBlockingSeatApi } from '@/services/schedules/deleteBlockingSeat';
import { editBlockingSeatApi } from '@/services/schedules/editBlockSeat-api';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  IoCheckmarkSharp,
  IoCheckmarkDoneSharp,
  IoSearch
} from 'react-icons/io5';
import { validateScheduleApi } from '@/services/schedules/validateSchedule-api';
import SwapTicketModel from '@/components/modal/schedule/SwapTicketModel';
import { swapTicketApi } from '@/services/schedules/swapTicket-api';
import { Input } from '@/components/ui/input';
import { exportScheduleById } from '@/services/schedules/exportScheduleById-api';
interface AvailableScreenProps {
  params: any;
}

export default function ScheduleDetailScreen(props: AvailableScreenProps) {
  const initialData: ScheduleResponseData = {
    id: '',
    departureId: '',
    date: new Date(),
    busId: '',
    availableSeat: 0,
    enable: false,
    departure: {
      id: '',
      departureTime: '',
      from: {
        id: '',
        mainLocationName: '',
        createAt: new Date(),
        updatedAt: new Date()
      },
      destination: {
        id: '',
        mainLocationName: '',
        createAt: new Date(),
        updatedAt: new Date()
      },
      pickupLocation: {
        id: '',
        mainLocationName: '',
        subLocationName: '',
        createAt: new Date(),
        updatedAt: new Date()
      },
      dropLocation: {
        id: '',
        mainLocationName: '',
        subLocationName: '',
        createAt: new Date(),
        updatedAt: new Date()
      }
    },
    booking: [],
    Waitting: [],
    Cancel: [],
    bus: {
      plateNumber: '',
      id: '',
      model: '',
      busNumber: '',
      numOfSeat: 0,
      driverName: '',
      driverContact: '',
      enable: false,
      createAt: new Date(),
      updatedAt: new Date()
    },
    guestInfor: []
  };

  const { push } = useRouter();
  const [data, setData] = useState<ScheduleResponseData>(initialData);

  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState<
    (BookingResponse | WaittingResponse | CancelResponse | BlockingResponse)[]
  >([]);

  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('booking');
  const { toast } = useToast();
  useEffect(() => {
    const getSchedule = async () => {
      try {
        const token = getCookie('token');
        const responseData = await getScheduleApi({
          token: token,
          id: props.params.id
        });
        setData(responseData.data);
      } catch (error) {
        push('/server-error');
      } finally {
        setIsLoading(false);
      }
    };

    getSchedule();
  }, [props.params.id, push]);

  useEffect(() => {
    const getFilteredData = () => {
      let baseData: (
        | BookingResponse
        | WaittingResponse
        | CancelResponse
        | BlockingResponse
      )[] = [];

      switch (tab) {
        case 'booking':
          baseData = data?.booking ?? [];
          break;
        case 'waiting':
          baseData = data?.Waitting ?? [];
          break;
        case 'cancel':
          baseData = data?.Cancel ?? [];
          break;
        case 'blocking':
          baseData = data?.guestInfor ?? [];
          break;
      }
      return baseData.filter((item) => {
        const nameOrUsername = 'user' in item ? item.user.username : item.name;
        return nameOrUsername.toLowerCase().includes(search.toLowerCase());
      });
    };
    setFilteredData(getFilteredData());
    setCurrentPage(1);
  }, [search, tab, data]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / dataPerPage);
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);

  async function onSave(user: blockingSeatUser[]) {
    const token = getCookie('token');
    const res = await addBlockSeatScheduleApi({
      token: token,
      scheduleId: props.params.id,
      user: user
    });

    if (res.status === 200) {
      toast({
        variant: 'default',
        title: 'Successful added',
        description: 'Added Blocking Seats successfully'
      });
      setData(res.data.data);
    } else if (res.status === 409) {
      toast({
        variant: 'destructive',
        title: 'No more Available seat',
        description: 'There are not available seat remaining'
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Something went'
      });
    }
  }

  async function deleteUser(userId: string) {
    const token = getCookie('token');
    const res = await deleteBlockingSeatApi({
      scheduleId: props.params.id,
      token: token,
      guestId: userId
    });

    if (res.status === 200) {
      toast({
        variant: 'default',
        title: 'Successful deleted',
        description: 'deleted Blocking Seats successfully'
      });
      const updatedGuestInfor = data?.guestInfor.filter(
        (user) => user.id !== userId
      );

      setData({ ...data, guestInfor: updatedGuestInfor });
    } else {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Something went'
      });
    }
  }
  async function editUser(userId: string, userInfo: blockingSeatUser) {
    const token = getCookie('token');
    const res = await editBlockingSeatApi({
      guestId: userId,
      token: token,
      scheduleId: props.params.id,
      data: userInfo
    });
    if (res.status === 200) {
      const updatedGuestInfo = data?.guestInfor.map((guest) => {
        if (guest.id === userId) {
          return {
            ...guest,
            name: res.data.data.name,
            gender: res.data.data.gender
          };
        }
        return guest;
      });

      setData({
        ...data,
        guestInfor: updatedGuestInfo
      });

      toast({
        variant: 'default',
        title: 'Successful updated',
        description: 'Updated Blocking Seats successfully'
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Something went'
      });
    }
  }

  async function validateSchedule(scheduleId: string, scheduleStatus: boolean) {
    const token = getCookie('token');
    const res = await validateScheduleApi({
      scheduleId: scheduleId,
      status: scheduleStatus,
      token: token
    });

    if (res.status === 200) {
      toast({
        variant: 'default',
        title: `Successful ${
          scheduleStatus === true ? 'validate' : 'invalidate'
        } this schedule`,
        description: `you are scuessfully ${
          scheduleStatus === true ? 'validate' : 'invalidate'
        } the schedule`
      });

      setData({ ...data, enable: !scheduleStatus });
    } else {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Something went'
      });
    }
  }

  async function swapTickets(bookingUserId: string, waitingUserId: string) {
    const token = getCookie('token');
    const bookingUser = data.booking.filter(
      (user) => user.id === bookingUserId
    )[0];
    const waitingUser = data.Waitting.filter(
      (user) => user.id === waitingUserId
    )[0];

    const res = await swapTicketApi({
      token: token,
      scheduleId: props.params.id,
      data: {
        fromBookedId: bookingUserId,
        withWaitingId: waitingUserId
      }
    });

    if (res.status === 200) {
      toast({
        variant: 'default',
        title: 'Swap Ticket Successfully',
        description: 'Swap Ticket between users successfully'
      });

      setData((prevData: any) => {
        const updatedBooking = prevData.booking.filter(
          (user: any) => user.id !== bookingUserId
        );
        const updatedWaiting = prevData.Waitting.filter(
          (user: any) => user.id !== waitingUserId
        );
        const bookingUser = prevData.Waitting.find(
          (user: any) => user.id === waitingUserId
        );

        return {
          ...prevData,
          booking: [...updatedBooking, bookingUser],
          Waitting: updatedWaiting
        };
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Something went'
      });
    }
  }

  async function handleExportScheduleById() {
    const token = getCookie('token');
    const res = await exportScheduleById({
      scheduleId: props.params.id,
      token: token,
      from: data.departure.from.mainLocationName,
      to: data.departure.destination.mainLocationName,
      date: data.date
    });

    if (res?.status === 200) {
      toast({
        variant: 'default',
        title: 'Download Schedule Successfully',
        description: 'Schedule download successfully.'
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Something went'
      });
    }
  }

  if (isLoading) {
    return (
      <div className='flex flex-col gap-5 items-center justify-center h-[calc(100vh-100px)]'>
        <div className='lds-ring'>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className='text-center'>
          <p>Please wait.</p>
          <p>It will just take a moment.</p>
        </div>
      </div>
    );
  }

  const handleItemsPerPageChange = (event: any) => {
    setDataPerPage(Number(event.target.value));
    setCurrentPage(1);
  };
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearch(event.target.value);
  };

  return (
    <div className='section'>
      <div className='flex flex-wrap gap-5 justify-between items-center my-10'>
        <h1 className='font-bold text-3xl'>Schedule Detail</h1>
        <div className='flex flex-wrap flex-row gap-5'>
          <SwapTicketModel
            bookingUsers={data.booking}
            waitingUsers={data.Waitting}
            onSwapTickets={swapTickets}
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size='lg'
                className='px-6 py-2'
                variant={data.enable === true ? 'default' : 'disable'}>
                {data.enable ? (
                  <IoCheckmarkSharp className='mr-5' />
                ) : (
                  <IoCheckmarkDoneSharp className='mr-5' />
                )}
                {data.enable ? 'Validate' : 'Invalidate'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently{' '}
                  {data.enable ? 'validate' : 'invalidate'} schedule.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => validateSchedule(data.id, data.enable)}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className='flex flex-wrap justify-between items-center'>
        <div className=''></div>
        <div className='flex flex-wrap gap-5 flex-row'>
          <div className='mr-5'>
            <KPICard
              icon={<LuCalendarCheck2 className='w-8 h-8' />}
              label={'Booking'}
              amount={data!.booking.length}
            />
          </div>

          <div className='mr-5'>
            <KPICard
              icon={<LuCalendarClock className='w-8 h-8' />}
              label={'Waiting'}
              amount={data!.Waitting.length}
            />
          </div>
          <div className='mr-5'>
            <KPICard
              icon={<LuCalendarX2 className='w-8 h-8' />}
              label={'Cancel'}
              amount={data!.Cancel.length}
            />
          </div>
          <KPICard
            icon={<LuCalendarHeart className='w-8 h-8' />}
            label={'Blocking'}
            amount={data!.guestInfor.length}
          />
        </div>
      </div>

      <div className='relative block mt-5'>
        <IoSearch className='pointer-events-none w-4 h-4 absolute top-1/2 transform -translate-y-1/2 left-3 text-primary' />
        <Input
          type='search'
          name='search'
          id='search'
          placeholder='Search something'
          className='pl-10 w-[275px]'
          value={search}
          onChange={handleSearchInputChange}
        />
      </div>

      <div className='mt-5'>
        <Tabs
          defaultValue='booking'
          className='w-full'
          onValueChange={(value) => setTab(value)}>
          <TabsList>
            <TabsTrigger value='booking'>Booking</TabsTrigger>
            <TabsTrigger value='waiting'>Waiting</TabsTrigger>
            <TabsTrigger value='cancel'>Cancel</TabsTrigger>
            <TabsTrigger value='blocking'>Blocking</TabsTrigger>
          </TabsList>
          <TabsContent value='booking'>
            <ScheduleTableComponent
              users={currentData}
              from={data!.departure.from.mainLocationName}
              to={data!.departure.destination.mainLocationName}
              date={FormatDate(data!.date.toString())}
              time={FormatTime(data!.departure.departureTime)}
              currentPage={currentPage}
              dataPerPage={dataPerPage}
            />
          </TabsContent>
          <TabsContent value='waiting'>
            <ScheduleTableComponent
              users={currentData}
              from={data!.departure.from.mainLocationName}
              to={data!.departure.destination.mainLocationName}
              date={FormatDate(data!.date.toString())}
              time={FormatTime(data!.departure.departureTime)}
              currentPage={currentPage}
              dataPerPage={dataPerPage}
            />
          </TabsContent>
          <TabsContent value='cancel'>
            <ScheduleTableComponent
              users={currentData}
              from={data!.departure.from.mainLocationName}
              to={data!.departure.destination.mainLocationName}
              date={FormatDate(data!.date.toString())}
              time={FormatTime(data!.departure.departureTime)}
              currentPage={currentPage}
              dataPerPage={dataPerPage}
            />
          </TabsContent>
          <TabsContent value='blocking'>
            <div className='flex flex-row items-end justify-end'>
              <AddBlockingSeatModel onSave={onSave} />
            </div>

            <ScheduleTableComponent
              users={currentData}
              from={data!.departure.from.mainLocationName}
              to={data!.departure.destination.mainLocationName}
              date={FormatDate(data!.date.toString())}
              time={FormatTime(data!.departure.departureTime)}
              type='GUEST'
              onDeleteUser={deleteUser}
              onEditUser={editUser}
              currentPage={currentPage}
              dataPerPage={dataPerPage}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className='flex flex-wrap justify-between items-center mt-5'>
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      <div className='flex flex-col gap-5 mt-10'>
        <div className='flex flex-row justify-between'>
          <Button
            className=''
            variant='default'
            onClick={handleExportScheduleById}>
            <LuDownload className='mr-5' />
            Export User
          </Button>
        </div>
      </div>
    </div>
  );
}
