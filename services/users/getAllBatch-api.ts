import { getAllBatchProps } from "@/types/user";

export const getAllBatchApi = async (props: getAllBatchProps) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE}/batch`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + props.token
    }
  });
  const response = await res.json();
  return response;
};
