import { updateStatusByBatchProps } from "@/types/user";

export const updateStatusByBatchApi = async (props: updateStatusByBatchProps) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE}/user/update/department-batch/filter`,
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
