import { exportScheduleByDateProps } from '../../types/schedule';

export const exportScheduleByDate = async (
  props: exportScheduleByDateProps
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE}/booking/pdf/date/filter?date=${props.scheduleDate}`,
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
    const fileName = `All Shuttle bus request ${props.scheduleDate}`;

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
