import { editBusProps } from '@/types/bus';

export const editBusApi = async (props: editBusProps) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE}/bus/${props.busId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + props.token
    },
    body: JSON.stringify(props.data)
  });

  console.log(res)
  const response = await res.json();
  return {
    data: response,
    status: res.status
  };
};
