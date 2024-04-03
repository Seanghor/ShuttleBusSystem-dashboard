import Cookies from "js-cookie";

export const getAllUser = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE}/user`, {
        method: "GET",
        headers: {
            Authorization: `Barer ${Cookies.get("token")}`
        },
    });
    const data = await res.json();

    return data;
};

export const getOneUser = async (id: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE}/user/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Barer ${Cookies.get("token")}`
        },
    });
    const response = await res.json();

    return res;
}

export const addNewUser = async (userData: any) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE}/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Barer ${Cookies.get("token")}`
        },
        body: JSON.stringify(userData),
    });
    return res;
};

export const deleteUser = async (id: any) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE}/user/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Barer ${Cookies.get("token")}`
        },
    });
    return res;
};

export const updateUser = async (
    user_id: any,
    role: string,
    email: string,
    username: string,
    password: string | null,
    department: string,
    phone: string,
    batchNum: number,
    inKrr: boolean,
    gender: string,
    enable: boolean,
) => {

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE}/user/${user_id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Barer ${Cookies.get("token")}`
        },
        body: JSON.stringify({
            role: role,
            email: email,
            username: username,
            password: password || null,
            department: department || null,
            phone: phone || null,
            batchNum: Number(batchNum) || null,
            inKrr: inKrr,
            gender: gender,
            enable: enable,
        }),

    });
    return res;
};


