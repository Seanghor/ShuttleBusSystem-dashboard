import { swapTicketProps } from '@/types/schedule';

export const swapTicketApi = async (props: swapTicketProps) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE}/booking/swap/${props.scheduleId}`,
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
