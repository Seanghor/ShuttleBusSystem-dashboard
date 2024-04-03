import { getAllStudentProps, getAllStudentChartProps } from "@/types/studnet";


export const getAllStudentApi = async (props: getAllStudentProps) => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE}/user/department/batch/filter?department=${props.department}&batch=${props.batch}&page=${props.currentPage}&limit=${props.dataPerPage}&search=${props.search}`,
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


export const getAllStudentChartApi = async (props: getAllStudentChartProps) => {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE}/user/department/batch/filter?department=${props.department}&batch=${props.batch}`,
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


