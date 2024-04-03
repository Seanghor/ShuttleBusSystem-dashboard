import { addNewBusProps } from '@/types/bus';

export const addNewBusApi = async (props: addNewBusProps) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE}/bus`, {
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
};
