import { validateScheduleProps } from '@/types/schedule';

export const validateScheduleApi = async (props: validateScheduleProps) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE}/schedule/confirm/${props.scheduleId}?confirm=${props.status}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + props.token
      }
    }
  );
  const response = await res.json();
  return {
    data: response,
    status: res.status
  };
};
