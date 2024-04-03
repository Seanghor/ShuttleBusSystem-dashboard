import { updateUserStatusProps } from '@/types/user';

export const updateUserAndStaffStatusApi = async (
  props: updateUserStatusProps
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE}/user/update/enableStatus/student-staff/filter?userId=${props.userId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + props.token
      },
      body: JSON.stringify({ enable: !props.status })
    }
  );
  const response = await res.json();
  return {
    data: response,
    status: res.status
  };
};

export const updateAdminStatusApi = async (props: updateUserStatusProps) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE}/user/update/enableStatus/admin/filter?userId=${props.userId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + props.token
      },
      body: JSON.stringify({ enable: !props.status })
    }
  );
  const response = await res.json();
  return {
    data: response,
    status: res.status
  };
};
