import { editUserProps } from '@/types/user';

export const editUserApi = async (props: editUserProps) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE}/user/${props.userId}`,
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
