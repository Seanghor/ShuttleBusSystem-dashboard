import { editMainLocationApiProps } from '@/types/location';

export const editMainLocation = async (
  props: editMainLocationApiProps
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE}/mainLocation/${props.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + props.token
        },
        body: JSON.stringify({ mainLocationName: props.locationName })
      }
    );
    const response = await res.json();
    return {
      data: response,
      status: res.status
    };
    return response;
  } catch (error) {
    console.log(error);
  }
};
