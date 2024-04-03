import moment from 'moment';

export function FormatTime(dateString: string | Date): string {
  const oldDate = new Date(dateString);
  const date = new Date(
    oldDate.getDay(),
    oldDate.getMonth(),
    oldDate.getFullYear(),
    oldDate.getHours() - 7,
    oldDate.getMinutes()
  );
  const newDate = moment(date).format('h:mm A');
  return newDate;
}
