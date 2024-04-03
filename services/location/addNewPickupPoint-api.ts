import { addNewPickupPointApiProps } from "@/types/location";

export const addNewSubLocation = async (props: addNewPickupPointApiProps) => {
    try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE}/subLocation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + props.token
      },
          body: JSON.stringify({
            mainLocationId: props.mainLocationId,
            subLocationName: props.locationName,
          }),
    });
    const response = await res.json();
    return {
      data: response,
      status: res.status
    };
  } catch (error) {
    console.log(error);
  }
};

