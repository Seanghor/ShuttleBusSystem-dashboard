import { editStatusProps } from '@/types/bus';

export const editStatusApi = async (props: editStatusProps) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE}/bus/${props.busId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + props.token
      },
      body: JSON.stringify(props.data)
    }
  );
  const response = await res.json();
  return {
    data: response,
    status: res.status
  };
};
