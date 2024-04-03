import Cookies from "js-cookie";

export const getAllBatch = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE}/batch`, {
        method: "GET",
        headers: {
            Authorization: `Barer ${Cookies.get("token")}`
        },
    },);
    const data = await res.json();

    return data;
};

export const getBatchByDepartment = async (department: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE}/batch/department/${department}`, {
        method: "GET",
        headers: {
            Authorization: `Barer ${Cookies.get("token")}`
        },
    },);
    const data = await res.json();

    return data;
}