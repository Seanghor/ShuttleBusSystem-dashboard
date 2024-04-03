export interface getAllStudentProps {
    token: string | undefined;
    dataPerPage: number;
    currentPage: number;
    search: string;
    department: string;
    batch: string;
}

export interface getAllStudentChartProps {
    token: string | undefined;
    department: string;
    batch: string;
}
