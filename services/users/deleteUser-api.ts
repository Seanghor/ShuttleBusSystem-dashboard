import { deleteUserProps } from '@/types/user';

export const deleteUserApi = async (props: deleteUserProps) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE}/user/${props.userId}`,
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
