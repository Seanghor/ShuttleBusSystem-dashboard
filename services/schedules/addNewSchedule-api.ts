import { createScheduleProps } from '@/types/schedule';

export const addNewSchedule = async (props: createScheduleProps) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE}/schedule`, {
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
