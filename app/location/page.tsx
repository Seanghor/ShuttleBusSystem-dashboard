'use client';

import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { getCookie } from 'cookies-next';
import { getAllLocationApi } from '@/services/location/getAllLocation-api';
import { MdDeleteOutline } from 'react-icons/md';
import { addNewMainLocation } from '@/services/location/addNewMainLocation-api';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { editMainLocation } from '@/services/location/editMainLocation-api';
import PickupLocationModel from '@/components/modal/location/PickupLocationModel';
import { addNewSubLocation } from '@/services/location/addNewPickupPoint-api';
import { editPickupLocation } from '@/services/location/editPickupLocation-api';
import { deletePickupLocation } from '@/services/location/deletePickupLocation-api';
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
import MainLocationModel from '@/components/modal/location/MainLocationModel';

export interface MainLocation {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  mainLocationName: string;
  SubLocation: SubLocationModel[];
}
export interface SubLocationModel {
  id: string;
  subLocationName: string;
}

export default function LocationScreen() {
  const [locations, setLocations] = useState<MainLocation[]>([]);
  const [, setIsOpen] = useState(false);
  const [pickupLocationId, setPickupLocationId] = useState('');
  const { toast } = useToast();
  useEffect(() => {
    const getAllLocation = async () => {
      const token = getCookie('token');
      const res = await getAllLocationApi(token);

      setLocations(res.data);
    };
    getAllLocation();
  }, []);

  const convertName = (location: string) => {
    return location
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  async function handleDeletePickupPoint() {
    const token = getCookie('token');

    const res = await deletePickupLocation({
      token: token,
      pickupLocationId: pickupLocationId
    });

    if (res?.status === 200) {
      toast({
        variant: 'default',
        title: 'Deleted Successfully',
        description: 'Pickup Location deleted successfully'
      });
      setLocations((currentLocations) =>
        currentLocations.map((location) => {
          if (
            location.SubLocation.some(
              (subLoc) => subLoc.id === pickupLocationId
            )
          ) {
            return {
              ...location,
              SubLocation: location.SubLocation.filter(
                (subLoc) => subLoc.id !== pickupLocationId
              )
            };
          }
          return location;
        })
      );
    } else {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Error occurred during the request.'
      });
    }
  }

  async function onSaveMainLocation(mainLocationName: string) {
    const token = getCookie('token');

    const res = await addNewMainLocation({
      token: token,
      locationName: mainLocationName
    });

    if (res?.status === 200) {
      toast({
        variant: 'default',
        title: 'Successful added',
        description: 'Create main location successfully'
      });
      setLocations([res.data.data, ...locations]);
      setIsOpen(false);
    } else if (res?.status === 409) {
      toast({
        variant: 'destructive',
        title: 'Data already exist',
        description: 'This location already exist',
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
  async function onEditMainLocation(
    mainLocationName: string,
    mainLocationId: string
  ) {
    const token = getCookie('token');
    const res = await editMainLocation({
      id: mainLocationId,
      token: token,
      locationName: mainLocationName
    });

    if (res?.status === 200) {
      toast({
        variant: 'default',
        title: 'Successful edited',
        description: 'Edit main location successfully'
      });
      setLocations((locations) =>
        locations.map((location) => {
          if (location.id === mainLocationId) {
            return {
              ...location,
              mainLocationName: mainLocationName
            };
          }
          return location;
        })
      );
    } else if (res?.status === 409) {
      toast({
        variant: 'destructive',
        title: 'Data already exist',
        description: 'This location already exist',
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

  async function onSavePickupLocation(
    pickupLocationName: string,
    mainLocationId: string
  ) {
    const token = getCookie('token');
    const res = await addNewSubLocation({
      mainLocationId: mainLocationId,
      token: token,
      locationName: pickupLocationName
    });

    if (res?.status === 200) {
      toast({
        variant: 'default',
        title: 'Successful added',
        description: 'Create pickup location successfully'
      });

      const newSubLocation = {
        id: res?.data.data.id,
        subLocationName: res?.data.data.subLocationName
      };

      setLocations((locations) =>
        locations.map((location) => {
          if (location.id === mainLocationId) {
            return {
              ...location,
              SubLocation: [...location.SubLocation, newSubLocation]
            };
          }
          return location;
        })
      );
    } else if (res?.status === 409) {
      toast({
        variant: 'destructive',
        title: 'Data already exist',
        description: 'This location already exist',
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

  async function onEditPickupLocation(
    mainLocationId: string,
    pickupLocationId: string,
    pickupLocationName: string
  ) {
    const token = getCookie('token');
    const res = await editPickupLocation({
      token: token,
      mainLocationId: mainLocationId,
      pickupLocationName: pickupLocationName,
      pickupLocationId: pickupLocationId
    });

    if (res?.status === 200) {
      toast({
        variant: 'default',
        title: 'Successful edited',
        description: 'Edit location successfully'
      });
      setLocations((locations) =>
        locations.map((location) => {
          if (location.id === mainLocationId) {
            return {
              ...location,
              SubLocation: location.SubLocation.map((subLoc) => {
                if (subLoc.id === pickupLocationId) {
                  return {
                    ...subLoc,
                    subLocationName: pickupLocationName
                  };
                }
                return subLoc;
              })
            };
          }
          return location;
        })
      );
    } else if (res?.status === 409) {
      toast({
        variant: 'destructive',
        title: 'Data already exist',
        description: 'This location already exist',
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
      <div className='flex justify-between flex-wrap gap-5 items-center'>
        <h1 className='font-bold text-3xl'>Location Management</h1>

        <MainLocationModel
          onSaveMainLocation={onSaveMainLocation}
          isEdit={false}
        />
      </div>
      {locations.map((data: MainLocation) => (
        <div key={data.id} className='my-5'>
          <Accordion type='single' collapsible>
            <AccordionItem value='item-2'>
              <div className='flex flex-row justify-between items-center bg-primary rounded-t-lg p-2 px-5 '>
                <div className='flex flex-1 '>
                  <AccordionTrigger>
                    <h4 className='text-white'>
                      {convertName(data.mainLocationName)}
                    </h4>
                  </AccordionTrigger>
                </div>

                <MainLocationModel
                  isEdit={true}
                  selectedMainLocation={data}
                  onEditMainLocation={onEditMainLocation}
                />
              </div>

              <AccordionContent className='p-2 bg-primary/20 rounded-b-lg'>
                <div className='flex flex-row justify-end my-5 mx-5'>
                  <PickupLocationModel
                    isEdit={false}
                    onSavePickupLocation={onSavePickupLocation}
                    selectedMainLocation={data}
                  />
                </div>
                <div className='flex flex-col'>
                  {data.SubLocation.map(
                    (subLocation: SubLocationModel, index: number) => (
                      <div
                        key={subLocation.id}
                        className='flex flex-row items-center my-5 mx-5 justify-between'>
                        <h5>{convertName(subLocation.subLocationName)}</h5>
                        <div className='flex flex-row'>
                          <PickupLocationModel
                            isEdit={true}
                            selectedMainLocation={data}
                            onEditPickupLocation={onEditPickupLocation}
                            selectedPickupLocation={subLocation}
                          />
                          <div className='px-3'></div>
                          <AlertDialog>
                            <AlertDialogTrigger
                              asChild
                              onClick={() =>
                                setPickupLocationId(subLocation.id)
                              }>
                              <MdDeleteOutline className='w-6 h-6 cursor-pointer' />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete this location and remove it
                                  from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeletePickupPoint()}>
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      ))}
    </div>
  );
}
