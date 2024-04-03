import { deletePickupPointApiProps } from "@/types/location"

export const deletePickupLocation = async (props: deletePickupPointApiProps) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE}/subLocation/${props.pickupLocationId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + props.token
        },
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
