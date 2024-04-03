import { deleteBlockingSeatUser } from '@/types/schedule';

export const deleteBlockingSeatApi = async (props: deleteBlockingSeatUser) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE}/schedule/unblock-seat/filter?schedule=${props.scheduleId}&guestId=${props.guestId}`,
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
};
