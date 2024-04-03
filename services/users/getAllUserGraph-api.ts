import { getAllUserGraphProps } from "@/types/user";

export const getAllUserGraphApi = async (props: getAllUserGraphProps) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE}/user`,
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
