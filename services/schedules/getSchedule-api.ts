import { getScheduleProps } from '@/types/schedule';

export const getScheduleApi = async (props: getScheduleProps) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE}/schedule/${props.id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + props.token
      }
    }
  );
  const response = await res.json();
  return response;
};
