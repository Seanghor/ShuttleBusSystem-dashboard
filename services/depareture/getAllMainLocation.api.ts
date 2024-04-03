export const getAllMainLocationApi = async (token: string | undefined) => {
  try {
    console.log(token);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE}/mainLocation`, {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token }
    });
    const response = await res.json();
    return response;
  } catch (error) {
    console.log(error);
  }
};
