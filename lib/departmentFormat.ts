export const DepartmentFormat = (department: string) => {
  switch (department) {
    case 'SOFTWAREENGINEERING':
      return 'Software Engineering';
    case 'TOURISMANDMANAGEMENT':
      return 'Tourism Management';
    case 'ARCHITECTURE':
      return 'Architecture ';
    default:
      return '';
  }
};
