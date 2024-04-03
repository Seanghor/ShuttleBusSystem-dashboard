import Cookies from "js-cookie"

export interface refillAllUserModel {
    type: string
    amount: number
    include: boolean
    batchNum: number,
    department: string
}
export interface refillParticularUserModel {
    listUser: string[]
    amount: number
    include: boolean
}

export const refillAllUser = async (refill: refillAllUserModel) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE}/ticket/refill/all/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Barer ${Cookies.get("token")}`
        },
        body: JSON.stringify({
            type: refill.type,
            amount: refill.amount,
            include: refill.include,
            batchNum: refill.batchNum,
            department: refill.department,
        }),
    });
    return res;
}

export const refillParticularUser = async (refill: refillParticularUserModel) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE}/ticket/refill/particular/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Barer ${Cookies.get("token")}`
        },
        body: JSON.stringify({
            listUser: refill.listUser,
            amount: refill.amount,
            include: refill.include,
        }),
    });
    return res;
}