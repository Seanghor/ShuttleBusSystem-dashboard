import { deleteScheduleProps } from '@/types/schedule';

export const deleteScheduleApi = async (props: deleteScheduleProps) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE}/schedule/${props.scheduleId}`,
      {
        method: 'DELETE',
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
  } catch (error) {
    console.log(error);
  }
};
