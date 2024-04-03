import { getAllBusProps, getAllBusWithNoPaginationProps } from '@/types/bus';

export const getAllBusApi = async (props: getAllBusProps) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE}/bus?limit=${props.dataPerPage}&page=${props.currentPage}&search=${props.search}`,
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

export const getAllBusWithNoPaginationApi = async (
  props: getAllBusWithNoPaginationProps
) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE}/bus`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + props.token
      }
    });
    const response = await res.json();
    return response;
  } catch (error) {
    console.log(error);
  }
};
