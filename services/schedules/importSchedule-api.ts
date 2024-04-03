import { importScheduleApiProps } from '@/types/schedule';

export const importScheduleApi = async (props: importScheduleApiProps) => {
  const formData = new FormData();
  formData.append('file', props.file);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE}/schedule/import`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + props.token
    },
    body: props.file
  });
  const response = await res.json();
  return {
    data: response,
    status: res.status
  };
};
