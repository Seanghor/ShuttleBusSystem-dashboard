import { getAllUserProps, getAllUserChartProps } from '@/types/user';

export const getAllUserApi = async (props: getAllUserProps) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE}/user?limit=${props.dataPerPage}&page=${props.currentPage}&status=${props.filterStatus}&search=${props.search}&role=${props.role}`,
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


export const getAllUserChartApi = async (props: getAllUserChartProps) => {
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
