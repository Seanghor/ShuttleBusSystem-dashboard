import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FaPlus } from 'react-icons/fa';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import { getAllDepartureNoPaginationApi } from '@/services/depareture/getAllDeparture-api';
import { FormatTime } from '@/lib/format_time';
import { DepartureResponse } from '@/types/departure';
import { getAllBusWithNoPaginationApi } from '@/services/Bus/getAllBus-api';
import { BusResponse } from '@/types/bus';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { MdOutlineEdit } from 'react-icons/md';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { FormatDate } from '@/lib/format_date';
import { ScheduleResponseData } from '@/types/schedule';
import RequiredField from '@/components/requiredField';

interface ScheduleModelProps {
  isEdit: boolean;
  onSave?: (
    selectedDepartureId: string,
    selectedBusId: string,
    date: string
  ) => Promise<void>;
  onEdit?: (
    selectedDepartureId: string,
    selectedBusId: string,
    date: string,
    scheduleId: string
  ) => Promise<void>;
  selectedSchedule?: ScheduleResponseData;
}

export default function ScheduleModel(props: ScheduleModelProps) {
  const { isEdit, onSave, selectedSchedule, onEdit } = props;

  const [departureList, setDepartureList] = useState<DepartureResponse[]>([]);
  const [busList, setBusList] = useState<BusResponse[]>([]);

  const [selectedScheduleId, setSelectedScheduleId] = useState('');
  const [selectedDepartureId, setSelectedDepartureId] = useState('');
  const [selectedBusId, setSelectedBusId] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [time, setTime] = useState('');
  const [driverName, setDriverName] = useState<string | undefined>('');
  const [driverContact, setDriverContact] = useState<string | undefined>('');
  const [model, setModel] = useState<string | undefined>('');
  const [plateNumber, setPlateNumber] = useState<string | undefined>('');
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { push } = useRouter();

  useEffect(() => {
    const getAllDeparture = async () => {
      const token = getCookie('token');
      const responseData = await getAllDepartureNoPaginationApi({
        token: token
      });
      const data = await responseData.data;

      data.forEach(
        (departure: DepartureResponse) =>
          (departure.departureTime = FormatTime(departure.departureTime))
      );
      setDepartureList(data);
      try {
      } catch (error) {
        push('/server-error');
      }
    };

    const getAllBus = async () => {
      const token = getCookie('token');
      const responseData = await getAllBusWithNoPaginationApi({ token: token });
      const data = await responseData.data;
      setBusList(data);
    };

    getAllDeparture();
    getAllBus();
  }, [push]);

  const handleSave = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    if (onSave) {
      onSave(
        selectedDepartureId,
        selectedBusId,
        new Date(date!.getTime() + 7 * 60 * 60000).toISOString()
      );
      resetData();
      setOpen(false);
    }
    if (onEdit) {
      onEdit(
        selectedScheduleId,
        selectedDepartureId,
        selectedBusId,
        new Date(date!.getTime() + 7 * 60 * 60000).toISOString()
      );
      resetData();
      setOpen(false);
    }
    setIsLoading(false);
  };

  const resetData = () => {
    setSelectedScheduleId('');
    setSelectedDepartureId('');
    setSelectedBusId('');
    setFrom('');
    setTo('');
    setPickupLocation('');
    setDropLocation('');
    setTime('');
    setDriverName('');
    setDriverContact('');
    setModel('');
    setPlateNumber('');
    setDate(undefined);
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
        {isEdit === true ? (
          <MdOutlineEdit
            className='cursor-pointer'
            onClick={() => {
              setFrom(selectedSchedule!.departure.from.mainLocationName);
              setSelectedScheduleId(selectedSchedule!.id);
              setSelectedDepartureId(selectedSchedule!.departure.id);
              setTo(selectedSchedule!.departure.destination.mainLocationName);
              setPickupLocation(
                selectedSchedule!.departure.pickupLocation.subLocationName
              );
              setDropLocation(
                selectedSchedule!.departure.dropLocation.subLocationName
              );
              setDate(new Date(selectedSchedule!.date));
              setTime(FormatTime(selectedSchedule!.departure.departureTime));
              setDriverContact(
                selectedSchedule?.bus
                  ? selectedSchedule?.bus.driverContact
                  : 'N/A'
              );
              setDriverName(
                selectedSchedule?.bus ? selectedSchedule?.bus.driverName : 'N/A'
              );
              setModel(
                selectedSchedule?.bus ? selectedSchedule?.bus.model : 'N/A'
              );
              setPlateNumber(
                selectedSchedule?.bus
                  ? selectedSchedule?.bus.plateNumber
                  : 'N/A'
              );
            }}
          />
        ) : (
          <Button className='' variant='default' size='lg'>
            <FaPlus className='mr-5' />
            Add New Schedule
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className={'overflow-y-scroll max-h-[80vh]'}>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Schedule' : 'Add Schedule'}</DialogTitle>
          <form onSubmit={handleSave}>
            <div className='flex flex-col'>
              <RequiredField />
              <h5 className='font-bold mt-10'>Driver Information</h5>
              <div className='gap-5 mt-5'>
                <div className='flex flex-col'>
                  <Label htmlFor='driver name' className='pb-2' isRequired>
                    Departure
                  </Label>
                  <Select
                    defaultValue={selectedSchedule?.departure.id}
                    onValueChange={(value) => {
                      setSelectedDepartureId(value),
                        setFrom(
                          departureList.find(
                            (departure: DepartureResponse) =>
                              departure.id === value
                          )?.from.mainLocationName ?? ''
                        );
                      setTo(
                        departureList.find(
                          (departure: DepartureResponse) =>
                            departure.id === value
                        )?.destination.mainLocationName ?? ''
                      );
                      setPickupLocation(
                        departureList.find(
                          (departure: DepartureResponse) =>
                            departure.id === value
                        )?.pickupLocation.subLocationName ?? ''
                      );
                      setDropLocation(
                        departureList.find(
                          (departure: DepartureResponse) =>
                            departure.id === value
                        )?.dropLocation.subLocationName ?? ''
                      );
                      setTime(
                        departureList.find(
                          (departure: DepartureResponse) =>
                            departure.id === value
                        )?.departureTime ?? ''
                      );
                    }}>
                    <SelectTrigger className='w-full '>
                      <SelectValue placeholder='Select Departure' />
                    </SelectTrigger>
                    <SelectContent>
                      {departureList.map((item: DepartureResponse, index) => (
                        <SelectItem key={index} value={item.id}>
                          {item?.from?.mainLocationName?.toLocaleUpperCase()} -
                          {item?.destination?.mainLocationName?.toLocaleUpperCase()}{' '}
                          | {item.departureTime}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
                    <div className='flex flex-col'>
                      <Label htmlFor='driver name' className='pb-2'>
                        Bus
                      </Label>
                      <Select
                        defaultValue={selectedSchedule?.bus?.id}
                        onValueChange={(value) => {
                          setSelectedBusId(value),
                            setDriverName(
                              busList.find(
                                (bus: BusResponse) => bus.id === value
                              )?.driverName ?? ''
                            );
                          setDriverContact(
                            busList.find((bus: BusResponse) => bus.id === value)
                              ?.driverContact ?? ''
                          );
                          setModel(
                            busList.find((bus: BusResponse) => bus.id === value)
                              ?.model ?? ''
                          );
                          setPlateNumber(
                            busList.find((bus: BusResponse) => bus.id === value)
                              ?.plateNumber ?? ''
                          );
                        }}>
                        <SelectTrigger className='w-full '>
                          <SelectValue placeholder='Select Bus' />
                        </SelectTrigger>
                        <SelectContent>
                          {busList
                            .filter((bus: BusResponse) => bus.enable === true)
                            .map((bus: BusResponse, index: number) => (
                              <SelectItem key={index} value={bus.id}>
                                {bus.model} - Seat {bus.numOfSeat}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='flex flex-col'>
                      <Label htmlFor='driver name' className='pb-2' isRequired>
                        Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'justify-start text-left font-normal',
                              !date && 'text-muted-foreground'
                            )}>
                            <CalendarIcon className='mr-2 h-4 w-4' />
                            {date ? (
                              format(date, 'PPP')
                            ) : (
                              <span>Select Schedule Date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0'>
                          <Calendar
                            fromDate={new Date()}
                            mode='single'
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            defaultMonth={date}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>

              <h5 className='font-bold mt-10'>Destination Information</h5>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
                <div className='flex flex-col'>
                  <Label htmlFor='driver name' className='pb-2'>
                    From
                  </Label>
                  <Input disabled={true} value={from} />
                </div>

                <div className='flex flex-col'>
                  <Label htmlFor='driver name' className='pb-2'>
                    To
                  </Label>
                  <Input disabled={true} value={to} />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
                <div className='flex flex-col'>
                  <Label htmlFor='driver name' className='pb-2'>
                    Pick Up Location
                  </Label>
                  <Input disabled={true} value={pickupLocation} />
                </div>

                <div className='flex flex-col'>
                  <Label htmlFor='driver name' className='pb-2'>
                    Drop Off Location
                  </Label>
                  <Input disabled={true} value={dropLocation} />
                </div>
              </div>

              <h5 className='font-bold mt-10'>Departure Information</h5>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
                <div className='flex flex-col'>
                  <Label htmlFor='driver name' className='pb-2'>
                    Departure Time
                  </Label>
                  <Input disabled={true} value={time} />
                </div>

                <div className='flex flex-col'>
                  <Label htmlFor='driver name' className='pb-2'>
                    Departure Date
                  </Label>
                  <Input
                    disabled={true}
                    value={
                      date !== undefined
                        ? FormatDate(date.toLocaleString())
                        : ''
                    }
                  />
                </div>
              </div>

              <h5 className='font-bold mt-10'>Bus Information</h5>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
                <div className='flex flex-col'>
                  <Label htmlFor='driver name' className='pb-2'>
                    Driver Name
                  </Label>
                  <Input disabled={true} value={driverName} />
                </div>

                <div className='flex flex-col'>
                  <Label htmlFor='driver name' className='pb-2'>
                    Driver Contact
                  </Label>
                  <Input disabled={true} value={driverContact} />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-5'>
                <div className='flex flex-col'>
                  <Label htmlFor='driver name' className='pb-2'>
                    Model
                  </Label>
                  <Input disabled={true} value={model} />
                </div>

                <div className='flex flex-col'>
                  <Label htmlFor='driver name' className='pb-2'>
                    Plate Number
                  </Label>
                  <Input disabled={true} value={plateNumber} />
                </div>
              </div>
            </div>
            <div className='mt-10'>
              <Button
                className='w-full'
                variant='default'
                disabled={!selectedDepartureId || (!date && !isLoading)}
                type='submit'>
                {isLoading ? 'Loading' : isEdit ? 'Save Change' : 'Add'}
              </Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
