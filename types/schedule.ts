export interface getAllSchedulesProps {
  token: string | undefined;
}
export interface getScheduleProps {
  token: string | undefined;
  id: string;
}

export interface importScheduleApiProps {
  token: string | undefined;
  file: any;
}

export interface blockingSeatUser {
  name: string;
  gender: string;
}
export interface deleteBlockingSeatUser {
  token: string | undefined;
  scheduleId: string;
  guestId: string;
}

export interface addBlockSeatScheduleProps {
  token: string | undefined;
  user: blockingSeatUser[];
  scheduleId: string;
}
export interface createScheduleProps {
  token: string | undefined;
  data: {
    departureId: string;
    busId: string | null;
    date: string | Date | undefined;
  };
}
export interface editScheduleProps {
  scheduleId: string;
  token: string | undefined;
  data: {
    departureId: string;
    busId: string | null;
    date: string | Date | undefined;
  };
}

export interface editBlockSeatProps {
  scheduleId: string;
  token: string | undefined;
  guestId: string;
  data: {
    name: string;
    gender: string;
  };
}
export interface validateScheduleProps {
  token: string | undefined;
  scheduleId: string;
  status: boolean;
}
export interface deleteScheduleProps {
  scheduleId: string;
  token: string | undefined;
}
export interface ScheduleRowTable {
  key: string;
  driverName: string;
  driverNumber: string;
  from: string;
  to: string;
  departureDate: string | Date;
  departureTime: string;
  seat: number;
  booked: number;
  waiting: number;
  operation: string;
}

interface FromLocation {
  id: string;
  mainLocationName: string;
  createAt: Date;
  updatedAt: Date;
}
interface DestinationLocation {
  id: string;
  mainLocationName: string;
  createAt: Date;
  updatedAt: Date;
}
interface PickupLocation {
  id: string;
  mainLocationName: string;
  subLocationName: string;
  createAt: Date;
  updatedAt: Date;
}
interface DropLocation {
  id: string;
  mainLocationName: string;
  subLocationName: string;
  createAt: Date;
  updatedAt: Date;
}

interface BusResponse {
  plateNumber: any;
  id: string;
  model: string;
  busNumber: string;
  numOfSeat: number;
  driverName: string;
  driverContact: string;
  enable: boolean;
  createAt: Date;
  updatedAt: Date;
}

export interface BookingResponse {
  id: string;
  user: {
    username: string;
  };
}

export interface WaittingResponse {
  id: string;
  user: {
    username: string;
  };
}

export interface CancelResponse {
  id: string;
  user: {
    username: string;
  };
}
export interface BlockingResponse {
  id: string;
  name: string;
  gender: string;
  scheduleId: string;
  updatedAt: string;
  user_type: string;
}

export interface ScheduleResponseData {
  id: string;
  departureId: string;
  date: Date | string;
  busId: string;
  availableSeat: number;
  enable: boolean;
  departure: {
    id: string;
    departureTime: string;
    from: FromLocation;
    destination: DestinationLocation;
    pickupLocation: PickupLocation;
    dropLocation: DropLocation;
  };
  booking: BookingResponse[];
  Waitting: WaittingResponse[];
  Cancel: CancelResponse[];
  bus: BusResponse;
  guestInfor: BlockingResponse[];
}

export interface ScheduleDropDownDto {
  id: string;
  departure: string;
  departureTime: string | Date;
}

export interface CreateScheduleDto {
  departureId: string;
  busId: string | null;
  date: string | Date;
}

export interface UpdateScheduleDto {
  departureId: string;
  busId: string | null;
  date: string | Date;
}

export interface swapTicketProps {
  scheduleId: string;
  data: {
    fromBookedId: string;
    withWaitingId: string;
  };
  token: string | undefined;
}

export interface exportScheduleByIdProps {
  scheduleId: string;
  token: string | undefined;
  from: string;
  to: string;
  date: Date | string;
}
export interface exportScheduleByDateProps {
  scheduleDate: string;
  token: string | undefined;
}
