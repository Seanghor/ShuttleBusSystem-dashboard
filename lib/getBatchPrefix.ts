export const GetBatchPrefix = (department: any) => {
  switch (department) {
    case 'SOFTWAREENGINEERING':
      return 'SE-B';
    case 'TOURISMANDMANAGEMENT':
      return 'TM-B';
    case 'ARCHITECTURE':
      return 'ARC-B';
    default:
      return '';
  }
};
