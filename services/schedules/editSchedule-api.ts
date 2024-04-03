import { editScheduleProps } from '@/types/schedule';

export const editSchedule = async (props: editScheduleProps) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE}/schedule/${props.scheduleId}`,
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
