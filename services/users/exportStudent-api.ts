import { DepartmentFormat } from './../../lib/departmentFormat';
import { exportStudentProps, getAllUserProps } from '@/types/user';

export const exportStudentApi = async (props: exportStudentProps) => {
  // const res = await fetch(
  //   `${process.env.NEXT_PUBLIC_BASE}/user/pdf?role=student&department=${props.selectedDepartment}&batch=${props.selectedBatch}`,
  //   {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/pdf',
  //       Authorization: 'Bearer ' + props.token
  //     }
  //   }
  // );
  // if (!res.ok) {
  //   throw new Error('Network response was not ok');
  // }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE}/user/pdf?role=student&department=${props.selectedDepartment}&batch=${props.selectedBatch}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + props.token
        }
      }
    );

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const blob = await res.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const dateStr = new Date().toISOString().substring(0, 10);
    const fileName = `Students report for ${DepartmentFormat(
      props.selectedDepartment
    )} - Batch ${props.selectedBatch}`;

    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(blobUrl);
    a.remove();
    return res;
  } catch (error) {
    console.error('Error exporting the schedule:', error);
  }
};
