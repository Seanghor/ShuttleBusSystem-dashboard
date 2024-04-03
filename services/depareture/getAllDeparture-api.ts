import {
  getAllDepartureProps,
  getAllDepartureWithNoPaginationProps
} from '@/types/departure';

export const getAllDepartureApi = async (props: getAllDepartureProps) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE}/departure?limit=${props.dataPerPage}&page=${props.currentPage}`,
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
  } catch (error) {
    console.log(error);
  }
};

export const getAllDepartureNoPaginationApi = async (
  props: getAllDepartureWithNoPaginationProps
) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE}/departure`, {
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
