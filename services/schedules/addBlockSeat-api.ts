import { addBlockSeatScheduleProps } from '@/types/schedule';

export const addBlockSeatScheduleApi = async (
  props: addBlockSeatScheduleProps
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE}/schedule/block-seat/filter?schedule=${props.scheduleId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + props.token
      },
      body: JSON.stringify(props.user)
    }
  );
  const response = await res.json();
  return {
    data: response,
    status: res.status
  };
};
