'use client';
import React, { useEffect, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';

import { getAllSchedulesApi } from '@/services/schedules/getAllSchedule-api';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ScheduleResponseData } from '@/types/schedule';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from '@radix-ui/react-icons';
import { TiDelete } from 'react-icons/ti';
import { FormatDate } from '@/lib/format_date';
import { FormatTime } from '@/lib/format_time';
import { MdDeleteOutline } from 'react-icons/md';
import Pagination from '@/components/Pagination';
import { IoCheckmarkSharp, IoCheckmarkDoneSharp } from 'react-icons/io5';
import ScheduleModel from '@/components/modal/schedule/ScheduleModel';
import { addNewSchedule } from '@/services/schedules/addNewSchedule-api';
import { useToast } from '@/components/ui/use-toast';
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
import { deleteScheduleApi } from '@/services/schedules/deleteSchedule-api';
import { editSchedule } from '@/services/schedules/editSchedule-api';
import { LuDownload } from 'react-icons/lu';
import ImportFileModel from '@/components/modal/schedule/importFileModel';
import { importScheduleApi } from '@/services/schedules/importSchedule-api';
import { exportScheduleByDate } from '@/services/schedules/exportScheduleByDate-api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
export default function SchedulePage() {
  const { push } = useRouter();

  const [data, setData] = useState<ScheduleResponseData[]>([]);
  const [filteredData, setFilteredData] = useState<ScheduleResponseData[]>([]);
  const [availableDates, setAvailableDate] = useState<Date[]>([]);
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(10);

  useEffect(() => {
    const getAllSchedule = async () => {
      try {
        const token = getCookie('token');
        const responseData = await getAllSchedulesApi({ token: token });

        const data = responseData?.data;
        await data?.sort((a: any, b: any) =>
          b.date > a.date ? 1 : b.date < a.date ? -1 : 0
        );
        setAvailableDate(data.map((item: any) => new Date(item.date)));
        setData(data);
      } catch (error) {
        push('/server-error');
      }
    };
    getAllSchedule();
  }, [push]);

  const totalPages = Math.ceil(
    (range ? filteredData.length : data.length) / dataPerPage
  );

  async function onSave(
    selectedDepartureId: string,
    selectedBusId: string,
    date: string
  ) {
    const token = getCookie('token');
    const res = await addNewSchedule({
      token: token,
      data: {
        departureId: selectedDepartureId,
        date: date,
        busId: selectedBusId
      }
    });
    if (res.status === 200) {
      toast({
        variant: 'default',
        title: 'Successful added',
        description: 'Added Schedule successfully'
      });
      setData(
        [res.data.data, ...data].sort(
          (a, b) =>
            b.date.localeCompare(a.date) ||
            b.departure.departureTime.localeCompare(a.departure.departureTime)
        )
      );
    } else if (res.status === 409) {
      toast({
        variant: 'destructive',
        title: 'Duplicate schedule',
        description: 'Sorry cant add schedule'
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Something went'
      });
    }
  }

  async function onEdit(
    selectedScheduleId: string,
    selectedDepartureId: string,
    selectedBusId: string,
    date: string
  ) {
    const token = getCookie('token');
    const res = await editSchedule({
      scheduleId: selectedScheduleId,
      token: token,
      data: {
        departureId: selectedDepartureId,
        date: date,
        busId: selectedBusId
      }
    });

    if (res.status === 200) {
      toast({
        variant: 'default',
        title: 'Successful edit',
        description: 'Edit Schedule successfully'
      });

      const updatedData = data.map((item) => {
        if (item.id === res.data.data.id) {
          return { ...item, ...res.data.data };
        }
        return item;
      });
      updatedData.sort(
        (a, b) =>
          b.date.localeCompare(a.date) ||
          b.departure.departureTime.localeCompare(a.departure.departureTime)
      );
      setData(updatedData);
    } else if (res.status === 409) {
      toast({
        variant: 'destructive',
        title: 'Duplicate schedule',
        description: 'Sorry cant update schedule'
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Something went'
      });
    }
  }

  const indexOfLastItem = currentPage * dataPerPage;
  const indexOfFirstItem = indexOfLastItem - dataPerPage;
  const currentItems = (range ? filteredData : data).slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber: any) => setCurrentPage(pageNumber);

  useEffect(() => {
    if (range && range.from) {
      const fromDate = new Date(range.from);
      let toDate: Date;
      if (range.to) {
        toDate = new Date(range.to);
      } else {
        toDate = new Date(range.from);
      }

      toDate.setHours(23, 59, 59, 999);

      const filtered = data.filter((schedule) => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate >= fromDate && scheduleDate <= toDate;
      });

      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [range, data]);

  const isDateDisabled = (date: any) => {
    return !availableDates.some(
      (availableDates) => date.toDateString() === availableDates.toDateString()
    );
  };

  async function handleDeleteSchedule(scheduleId: string) {
    const token = getCookie('token');
    const res = await deleteScheduleApi({ token: token, scheduleId });
    if (res?.status == 200 || res?.status == 201) {
      toast({
        variant: 'default',
        title: 'Deleted Successfully',
        description: 'Schedule deleted successfully'
      });
      setData(data.filter((schedule) => schedule.id !== scheduleId));
    } else {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Error occurred during the request.'
      });
    }
  }

  async function handleImportSchedule(file: any) {
    const token = getCookie('token');
    const formData = new FormData();
    formData.append('file', file);
    const res = await importScheduleApi({ token: token, file: formData });
    if (res.status === 200) {
      if (res.data.data.failToCreate.length > 0) {
        const failRows = res.data.data.failToCreate
          .map((entry: { row: any }) => entry.row)
          .join(', ');
        toast({
          variant: 'destructive',
          title: 'Duplicated schedules',
          description: `Schedule in row(s) ${failRows} are already existed`
        });
      }

      if (res.data.data.successCreate.length > 0) {
        const successRows = res.data.data.successCreate
          .map((entry: { row: any }) => entry.row)
          .join(', ');
        toast({
          variant: 'default',
          title: 'Created Successfully',
          description: `Schedules in row(s) ${successRows} are created successfully`
        });
        const newSchedules = res.data.data.successCreate.map(
          (item: any) => item.detail
        );
        setData(
          [...newSchedules, ...data].sort(
            (a, b) =>
              b.date.localeCompare(a.date) ||
              b.departure.departureTime.localeCompare(a.departure.departureTime)
          )
        );
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Error occurred during the request.'
      });
    }
  }

  async function handleExportScheduleByDate() {
    const token = getCookie('token');

    if (range && range.from) {
      const date = range.from;
      const res = await exportScheduleByDate({
        scheduleDate: new Date(
          date.getTime() - date.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split('T')[0],
        token: token
      });
    }
  }

  return (
    <div className='section'>
      <div className='flex justify-between items-center flex-wrap'>
        <h1 className='font-bold text-3xl'>Schedule Management</h1>
        <div className='flex flex-wrap gap-5 mt-5 items-center'>
          <ImportFileModel handleImportSchedule={handleImportSchedule} />

          <ScheduleModel isEdit={false} onSave={onSave} />
        </div>
      </div>
      <div className='flex flex-wrap items-center pt-5 justify-between'>
        <div className='flex flex-row items-center'>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id='date'
                variant={'outline'}
                className={cn(
                  'w-[250px] justify-start text-left font-normal',
                  !range && 'text-muted-foreground'
                )}>
                <CalendarIcon className='mr-2 h-4 w-4' />
                {range?.from ? (
                  range.to ? (
                    <>
                      {format(range.from, 'LLL dd, y')} -{' '}
                      {format(range.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(range.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                initialFocus
                mode='range'
                disabled={isDateDisabled}
                selected={range}
                onSelect={setRange}
                numberOfMonths={1}
                captionLayout='dropdown'
              />
            </PopoverContent>
          </Popover>

          <TiDelete
            className='h-6 w-6 ml-2 text-primary'
            onClick={() => setRange(undefined)}
          />
        </div>

        <div className='flex justify-start md:justify-end items-center gap-5 mt-5'>
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

      <div className='flex flex-col'>
        <div className='w-full  flex justify-end items-center'></div>
        <div className='overflow-x-auto relative mt-5 z-0'>
          <table className='w-full text-sm text-center border-t-4 border-t-primary'>
            <thead className='text-xs'>
              <tr>
                <th
                  scope='col'
                  className='w-[5%] py-3 px-6 border-b border-r border-l border-gray-400'>
                  No
                </th>
                <th
                  scope='col'
                  className='py-3 px-6 border-b border-r border-gray-400'>
                  Driver Name
                </th>
                <th
                  scope='col'
                  className='py-3 px-6 border-b border-r border-gray-400'>
                  Driver Contact
                </th>
                <th
                  scope='col'
                  className='py-3 px-6 border-b border-r border-gray-400'>
                  From
                </th>
                <th
                  scope='col'
                  className='py-3 px-6 border-b border-r border-gray-400'>
                  To
                </th>
                <th
                  scope='col'
                  className='py-3 px-6 border-b border-r border-gray-400'>
                  Date
                </th>
                <th
                  scope='col'
                  className='py-3 px-6 border-b border-r border-gray-400'>
                  Time
                </th>
                <th
                  scope='col'
                  className='py-3 px-6 border-b border-r border-gray-400'>
                  Seat
                </th>
                <th
                  scope='col'
                  className='py-3 px-6 border-b border-r border-gray-400'>
                  Booked
                </th>
                <th
                  scope='col'
                  className='py-3 px-6 border-b border-r border-gray-400'>
                  Waiting
                </th>
                <th
                  scope='col'
                  className='py-3 px-6 border-b border-r border-gray-400'>
                  Operation
                </th>
                <th
                  scope='col'
                  className='py-3 px-6 border-b border-r border-gray-400'></th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((schedule, index) => (
                <tr
                  onClick={() => push(`schedules/${schedule.id}`)}
                  key={schedule.id}
                  className={`${
                    schedule.enable
                      ? 'bg-white'
                      : 'text-gray-400 bg-opacity-60 bg-white'
                  } 
                      hover:bg-gray-100 cursor-pointer`}>
                  <td className='py-2 px-2 border-r border-b  border-gray-400 border-l text-center'>
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className='py-2 px-6 border-r border-b  border-gray-400'>
                    {schedule?.bus === null ? 'N/A' : schedule?.bus?.driverName}
                  </td>
                  <td className='py-2 px-6 border-r border-b  border-gray-400'>
                    {schedule?.bus === null
                      ? 'N/A'
                      : schedule?.bus?.driverContact}
                  </td>
                  <td className='py-2 px-6 border-r border-b items-center  border-gray-400'>
                    {schedule?.departure?.from?.mainLocationName}
                  </td>
                  <td className='py-2 px-6 border-r border-b  border-gray-400'>
                    {schedule?.departure?.destination?.mainLocationName}
                  </td>
                  <td className='py-2 px-6 border-r border-b  border-gray-400'>
                    {FormatDate(schedule?.date?.toLocaleString())}
                  </td>
                  <td className='py-2 px-6 border-r border-b  border-gray-400'>
                    {FormatTime(schedule.departure.departureTime)}
                  </td>
                  <td className='py-2 px-6 border-r border-b  border-gray-400'>
                    {schedule?.availableSeat}
                  </td>
                  <td className='py-2 px-6 border-r border-b  border-gray-400'>
                    {schedule?.booking?.length + schedule?.guestInfor?.length}
                  </td>
                  <td className='py-2 px-6 border-r border-b  border-gray-400'>
                    {schedule?.Waitting?.length}
                  </td>
                  <td
                    className='py-2 px-6 border-r border-b border-gray-400'
                    onClick={(e) => e.stopPropagation()}>
                    <div className='flex flex-row justify-center items-center'>
                      <ScheduleModel
                        isEdit={true}
                        selectedSchedule={schedule}
                        onEdit={onEdit}
                      />
                      <div className='px-1'></div>

                      {schedule.booking.length +
                        schedule.Waitting.length +
                        schedule.Cancel.length +
                        schedule.guestInfor.length ===
                      0 ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <MdDeleteOutline
                              className={
                                schedule.booking.length +
                                  schedule.Waitting.length +
                                  schedule.Cancel.length +
                                  schedule.guestInfor.length ===
                                0
                                  ? 'cursor-pointer'
                                  : 'text-gray-400'
                              }
                            />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete schedule and remove it from
                                our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteSchedule(schedule.id)
                                }>
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <MdDeleteOutline className={'text-gray-400'} />
                      )}
                    </div>
                  </td>
                  <td
                    className='py-2 px-6 border-r border-b border-gray-400'
                    onClick={(e) => e.stopPropagation()}>
                    {schedule.enable ? (
                      <IoCheckmarkSharp />
                    ) : (
                      <IoCheckmarkDoneSharp />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='flex flex-wrap justify-between items-center mt-5'>
          <Button
            className='mb-5'
            variant='default'
            onClick={handleExportScheduleByDate}
            disabled={range && range.from ? false : true}>
            <LuDownload className='mr-5' />
            Export Schedule
          </Button>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
          />
        </div>
      </div>
    </div>
  );
}
