import { editBlockSeatProps } from '@/types/schedule';

export const editBlockingSeatApi = async (props: editBlockSeatProps) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE}/schedule/block-seat/filter?schedule=${props.scheduleId}&guestId=${props.guestId}`,
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
