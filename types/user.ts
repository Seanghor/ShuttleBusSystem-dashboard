export interface UserResponse {
  id: string;
  email: string;
  username: string;
  role: string;
  gender: string;
  inKRR: boolean;
  password: string;
  phone: string;
  enable: boolean;
  ticket: {
    id: string;
    remainTicket: number;
    ticketLimitInhand: number;
    updatedAt: string;
  };
  studentInfo: {
    id: string;
    batch: {
      id: string;
      department: string;
      batchNum: number;
    };
  };
  staffInfo: any; // Update the type if applicable
  adminInfo: any; // Update the type if applicable
  superAdminInfo: any; // Update the type if applicable
}

export interface getAllUserProps {
  token: string | undefined;
  dataPerPage: number;
  currentPage: number;
  filterStatus: string;
  search: string;
  role: string;
}

export interface getAllUserChartProps {
  token: string | undefined;
}

export interface exportUserProps {
  token: string | undefined,
  selectedDepartment: string,
  selectedBatch: string,
}


export interface getAllUserGraphProps {
  token: string | undefined;
}
export interface deleteUserProps {
  token: string | undefined;
  userId: string;
}
export interface getAllBatchProps {
  token: string | undefined;
}

export interface editUserProps {
  token: string | undefined;
  userId: string;
  data: any;
}

export interface addNewUserProps {
  token: string | undefined;
  data: any;
}

export interface updateUserStatusProps {
  token: string | undefined;
  status: boolean;
  userId: string;
}

export interface updateStatusByBatchProps {
  token: string | undefined;
  data: any;
}

export interface exportStudentProps {
  selectedDepartment: string;
  selectedBatch: string;
  token: string | undefined;
}
