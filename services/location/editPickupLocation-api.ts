import { editPickupPointApiProps } from '@/types/location';

export const editPickupLocation = async (props: editPickupPointApiProps) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE}/subLocation/${props.pickupLocationId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + props.token
        },
        body: JSON.stringify({
          mainLocationId: props.mainLocationId,
          subLocationName: props.pickupLocationName
        })
      }
    );
    const response = await res.json();
    return {
      data: response,
      status: res.status
    };
  } catch (error) {
    console.log(error);
  }
};
