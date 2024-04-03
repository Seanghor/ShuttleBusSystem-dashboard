import { ForgetPasswordProps } from '../../types/auth.types';

export const forgetPassword = async (props: ForgetPasswordProps) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE}/user/request/reset-password/admin`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(props)
    }
  );

  return res;
};
