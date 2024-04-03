import { addNewDepartureProps } from '../../types/departure';

export const addNewDepartureApi = async (props: addNewDepartureProps) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE}/departure`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + props.token
      },
      body: JSON.stringify(props.data)
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
