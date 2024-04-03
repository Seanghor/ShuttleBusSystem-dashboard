'use client';
import { BusResponse } from '@/types/bus';
import { useEffect, useState } from 'react';
import Pagination from '@/components/Pagination';

import { getCookie } from 'cookies-next';
import { getAllBusApi } from '@/services/Bus/getAllBus-api';
import { useRouter } from 'next/navigation';
import { editBusApi } from '@/services/Bus/editBus-api';
import { useToast } from '@/components/ui/use-toast';
import { addNewBusApi } from '@/services/Bus/addNewBus-api';
import { editStatusApi } from '@/services/Bus/editStatus-api';

import BusModel from '@/components/modal/bus/BusModel';
import { Input } from '@/components/ui/input';
import { IoSearch } from 'react-icons/io5';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
export default function BusScreen() {
  const [busData, setBusData] = useState<BusResponse[]>([]);
  const [search, setSearch] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const { push } = useRouter();

  const { toast } = useToast();
  useEffect(() => {
    const getAllBus = async () => {
      try {
        const token = getCookie('token');
        const res = await getAllBusApi({
          token: token,
          currentPage: currentPage,
          dataPerPage: dataPerPage,
          search: search
        });

        setBusData(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
      } catch (error) {
        push('/server-error');
      }
    };
    getAllBus();
  }, [currentPage, dataPerPage, push, search]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (event: any) => {
    setDataPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const toggleBusStatus = async (
    busId: string,
    currentStatus: boolean,
    model: string,
    plateNumber: string,
    seats: number,
    driverName: string,
    driverNumber: string
  ) => {
    try {
      const token = getCookie('token');
      const res = await editStatusApi({
        token: token,
        busId: busId,
        data: {
          model: model,
          plateNumber: plateNumber,
          numOfSeat: seats,
          driverName: driverName,
          driverContact: driverNumber,
          enable: !currentStatus
        }
      });
      if (res.status === 200) {
        const updatedBusData = busData.map((bus) => {
          toast({
            variant: 'default',
            title: 'Successful updated',
            description: 'Updated bus status successfully'
          });
          if (bus.id === busId) {
            return {
              ...bus,
              enable: !currentStatus
            };
          }
          return bus;
        });
        setBusData(updatedBusData);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to update',
        description: 'Sorry cant update status the bus'
      });
    }
  };

  async function onSave(
    driverName: string,
    driverContact: string,
    model: string,
    seats: string,
    plateNumber: string
  ) {
    const token = await getCookie('token');
    const res = await addNewBusApi({
      token: token,
      data: {
        driverName: driverName,
        driverContact: driverContact,
        model: model,
        plateNumber: plateNumber,
        numOfSeat: parseInt(seats, 10)
      }
    });

    if (res.status === 200) {
      toast({
        variant: 'default',
        title: 'Successful added',
        description: 'Added bus successfully'
      });
      if (busData.length < dataPerPage) {
        setBusData([res.data.data, ...busData].slice(0, dataPerPage));
      }
      if (busData.length === dataPerPage) {
        setTotalPages(totalPages + 1);
      }
    } else if (res.status === 409) {
      toast({
        variant: 'destructive',
        title: 'Duplicated bus',
        description: 'Bus already exist'
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Something went'
      });
    }
  }

  const handleSearch = (event: any) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  async function onEdit(
    driverName: string,
    driverContact: string,
    model: string,
    seats: string,
    plateNumber: string,
    enable: boolean,
    busId: string
  ) {
    const token = getCookie('token');
    const res = await editBusApi({
      token: token,
      busId: busId,
      data: {
        driverName: driverName,
        driverContact: driverContact,
        model: model,
        plateNumber: plateNumber,
        numOfSeat: parseInt(seats, 10),
        enable: enable
      }
    });

    if (res.status === 200) {
      toast({
        variant: 'default',
        title: 'Successful edited',
        description: 'Edit bus successfully'
      });
      const updatedBusData = busData.map((bus) => {
        if (bus.id === busId) {
          return {
            ...bus,
            driverName: driverName,
            driverContact: driverContact,
            model: model,
            plateNumber: plateNumber,
            numOfSeat: parseInt(seats, 10)
          };
        }
        return bus;
      });

      setBusData(updatedBusData);
    } else if (res.status === 409) {
      toast({
        variant: 'destructive',
        title: 'Failed to update',
        description: 'Sorry cant update the bus'
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Something went'
      });
    }
  }

  return (
    <div className='section'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 items-center'>
        <h1 className='font-bold text-3xl mt-5'>Bus Management</h1>
        <div className='flex justify-start md:justify-end'>
          <BusModel onSave={onSave} isEdit={false} />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 mt-10 gap-5'>
        <div className='relative block'>
          <IoSearch className='pointer-events-none w-4 h-4 absolute top-1/2 transform -translate-y-1/2 left-3 text-primary' />
          <Input
            type='search'
            name='search'
            id='search'
            placeholder='Search something'
            className='pl-10 w-[275px]'
            value={search}
            onChange={handleSearch}
          />
        </div>

        <div className='flex justify-start md:justify-end items-center gap-5 '>
          <Label>Per Page: </Label>

          <Select
            defaultValue={dataPerPage.toString()}
            onValueChange={(value) => {
              setDataPerPage(Number(value));
              setCurrentPage(1);
            }}>
            <SelectTrigger className='w-[100px]'>
              <SelectValue placeholder='Select item per page' />
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

      {/* Table */}
      <div className='overflow-x-auto relative mt-5 z-0'>
        <table className='w-full text-sm text-center border-t-4 border-t-[#0E6431]'>
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
                Model
              </th>
              <th
                scope='col'
                className='py-3 px-6 border-b border-r border-gray-400'>
                Plate Number
              </th>
              <th
                scope='col'
                className='py-3 px-6 border-b border-r border-gray-400'>
                Number of Seats
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
          </thead>
          <tbody>
            {busData.map((bus: BusResponse, index: number) => (
              <tr
                key={bus.id}
                className={
                  bus.enable
                    ? 'bg-white'
                    : 'text-gray-400 bg-opacity-60 bg-white'
                }>
                <td className='py-2 px-2 border-r border-b border-gray-400 border-l text-center'>
                  {(currentPage - 1) * dataPerPage + index + 1}
                </td>
                <td className='py-2 px-6 border-r border-b border-gray-400'>
                  {bus?.driverName}
                </td>
                <td className='py-2 px-6 border-r border-b border-gray-400'>
                  {bus?.driverContact}
                </td>
                <td className='py-2 px-6 border-r border-b border-gray-400'>
                  {bus?.model}
                </td>
                <td className='py-2 px-6 border-r border-b border-gray-400'>
                  {bus?.plateNumber}
                </td>
                <td className='py-2 px-6 border-r border-b border-gray-400'>
                  {bus?.numOfSeat}
                </td>

                <td className='py-2 px-6 border-r border-b border-gray-400'>
                  <button
                    className={`relative inline-block w-12 h-6 rounded-full shadow-inner transition duration-300 ease-in-out ${
                      bus.enable ? 'bg-green-800' : 'bg-gray-200'
                    }`}
                    onClick={() =>
                      toggleBusStatus(
                        bus.id,
                        bus.enable,
                        bus.model,
                        bus.plateNumber,
                        bus.numOfSeat,
                        bus.driverName,
                        bus.driverContact
                      )
                    }>
                    <span
                      className={`absolute left-0 top-0 w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-md transition duration-300 ease-in-out ${
                        bus.enable
                          ? 'translate-x-full border-green-800'
                          : 'translate-x-0 border-gray-400'
                      }`}></span>
                  </button>
                </td>

                <td className='py-2 px-6 border-r border-b border-gray-400'>
                  <BusModel isEdit={true} selectedBus={bus} onEdit={onEdit} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='flex justify-end items-center mt-5'>
        {/* Pagination Buttons */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
