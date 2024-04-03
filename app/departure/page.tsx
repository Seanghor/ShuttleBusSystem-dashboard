'use client';

import { DepartureResponse } from '@/types/departure';
import Pagination from '../../components/Pagination';
import { useState, useEffect } from 'react';

import { getAllDepartureApi } from '@/services/depareture/getAllDeparture-api';
import { getCookie } from 'cookies-next';
import { getAllMainLocationApi } from '@/services/depareture/getAllMainLocation.api';
import { addNewDepartureApi } from '@/services/depareture/addNewDeparture-api';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import DepartureModel from '@/components/modal/departure/DepartureModel';
import { MainLocation } from '../location/page';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

type TimeOption = {
  value: string;
  label: string;
};

const DepartureManagement = () => {
  const [departureData, setDepartureData] = useState<DepartureResponse[]>([]);

  const [allLocation, setAllLocation] = useState<MainLocation[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage, setDataPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const getAllDeparture = async () => {
      const token = getCookie('token');
      const res = await getAllDepartureApi({
        dataPerPage: dataPerPage,
        currentPage,
        token: token
      });
      setDepartureData(res.data.data);
      setTotalPages(res.data.pagination.totalPages);
    };

    const getAllMainLocation = async () => {
      const token = getCookie('token');
      const res = await getAllMainLocationApi(token);
      setAllLocation(res.data);
    };

    getAllMainLocation();
    getAllDeparture();
  }, [currentPage, dataPerPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (event: any) => {
    setDataPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  function formatTimes(time: string | Date) {
    if (!time) return '';

    const date = new Date(time);
    const minute = date.getUTCMinutes();
    const second = date.getUTCSeconds();
    let hour = minute;
    let amPm = 'AM';

    if (minute >= 13) {
      hour = minute - 12;
      amPm = 'PM';
    }

    const formattedHour = String(hour).padStart(2, '0');
    const formattedMinute = String(second).padStart(2, '0');

    return `${formattedHour}:${formattedMinute} ${amPm}`;
  }

  async function onSave(
    selectedFromMainLocationId: string,
    selectedToMainLocationId: string,
    selectedPickupSubLocationId: string,
    selectedDropLocationId: string,
    time: string
  ) {
    const token = getCookie('token');

    const newData = {
      fromId: selectedFromMainLocationId,
      destinationId: selectedToMainLocationId,
      departureTime: time,
      pickupLocationId: selectedPickupSubLocationId,
      dropLocationId: selectedDropLocationId
    };

    const response = await addNewDepartureApi({ token: token, data: newData });
    if (response?.status === 200) {
      toast({
        variant: 'default',
        title: 'Successful added',
        description: 'Create departure successfully'
      });
      setDepartureData(
        [response.data.data, ...departureData].slice(0, dataPerPage)
      );
    } else if (response?.status === 409) {
      toast({
        variant: 'destructive',
        title: 'Data already exist',
        description: 'This departure already exist',
        action: <ToastAction altText='Try again'>Thank you</ToastAction>
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Error occurred during the request.'
      });
    }
  }

  return (
    <div className='section'>
      <div className='flex gap-5 flex-wrap justify-between items-center'>
        <h1 className='font-bold text-3xl'>Departure Management</h1>
        <div>
          <DepartureModel allLocation={allLocation} onSave={onSave} />
        </div>
      </div>
      <div className='flex items-center gap-5 mt-10 justify-end'>
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
                Pickup Location
              </th>
              <th
                scope='col'
                className='py-3 px-6 border-b border-r border-gray-400'>
                Dropoff Location
              </th>
              <th
                scope='col'
                className='py-3 px-6 border-b border-r border-gray-400'>
                Departure Time
              </th>
            </tr>
          </thead>
          <tbody>
            {departureData.map(
              (departure: DepartureResponse, index: number) => (
                <tr key={departure.id} className='bg-white border-b'>
                  <td className='py-2 px-2 border-r border-b border-gray-400 border-l text-center'>
                    {(currentPage - 1) * dataPerPage + index + 1}
                  </td>
                  <td className='py-2 px-6 border-r border-b border-gray-400'>
                    {departure.from?.mainLocationName}
                  </td>
                  <td className='py-2 px-6 border-r border-b border-gray-400'>
                    {departure?.destination.mainLocationName}
                  </td>
                  <td className='py-2 px-6 border-r border-b border-gray-400'>
                    {departure?.pickupLocation.subLocationName}
                  </td>
                  <td className='py-2 px-6 border-r border-b border-gray-400'>
                    {departure?.dropLocation.subLocationName}
                  </td>
                  <td className='py-2 px-6 border-r border-b border-gray-400'>
                    {formatTimes(departure.departureTime)}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className='flex justify-end items-center mt-5'>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default DepartureManagement;
