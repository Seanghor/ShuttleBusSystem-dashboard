import { addNewMainLocationApiProps } from '@/types/location';

export const addNewMainLocation = async (props: addNewMainLocationApiProps) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE}/mainLocation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + props.token
      },
      body: JSON.stringify({ mainLocationName: props.locationName })
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
