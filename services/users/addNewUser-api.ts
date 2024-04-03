import { addNewUserProps } from "@/types/user";

export const addNewUserApi = async (props: addNewUserProps) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE}/user`, {
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
