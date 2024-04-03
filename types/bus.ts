export interface BusResponse {
  status: string;
  id: string;
  driverName: string;
  driverContact: string;
  model: string;
  enable: boolean;
  numOfSeat: number;
  plateNumber: string;
  createAt: Date;
  updatedAt: Date;
}

export interface getAllBusProps {
  token: string | undefined;
  dataPerPage: number;
  currentPage: number;
  search: any;
}
export interface getAllBusWithNoPaginationProps {
  token: string | undefined;
}
export interface addNewBusProps {
  token: string | undefined;
  data: {
    driverName: string;
    driverContact: string;
    model: string;
    plateNumber: string;
    numOfSeat: number;
  };
}


export interface editBusProps {
  token: string | undefined;
  busId: string | undefined;
  data: {
    driverName: string;
    driverContact: string;
    model: string;
    plateNumber: string;
    numOfSeat: number;
    enable: boolean | undefined;
  };
}
export interface editStatusProps {
  busId: string | undefined;
  token: string | undefined;
  data: {
    driverName: string;
    driverContact: string;
    model: string;
    plateNumber: string;
    numOfSeat: number;
    enable: boolean | undefined;
  };
}
