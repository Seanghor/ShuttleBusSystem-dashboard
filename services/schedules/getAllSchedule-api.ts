import { getAllSchedulesProps } from "@/types/schedule";

export const getAllSchedulesApi = async (props: getAllSchedulesProps) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE}/schedule`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + props.token
      }
    });
    const response = await res.json();
    return response;
};
