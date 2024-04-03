import { LoginRequestProps } from '../../types/auth.types';

export const login = async (props: LoginRequestProps) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE}/user/login/admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(props)
  });
  return res;
};
