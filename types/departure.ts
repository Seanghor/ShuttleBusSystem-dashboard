export interface getAllDepartureProps {
  token: string | undefined;
  dataPerPage: number;
  currentPage: number;
}

export interface getAllDepartureWithNoPaginationProps {
  token: string | undefined;
}
export interface addNewDepartureProps {
  token: string | undefined;
  data: {
    fromId: string;
    destinationId: string;
    departureTime: string;
    pickupLocationId: string;
    dropLocationId: string;
  };
}

interface FromLocation {
  id: string;
  mainLocationName: string;
}

interface DestinationLocation {
  id: string;
  mainLocationName: string;
}

interface PickupLocation {
  id: string;
  subLocationName: string;
}

interface DropLocation {
  id: string;
  subLocationName: string;
}

export interface DepartureResponse {
  id: string;
  departureTime: string;
  from: FromLocation;
  destination: DestinationLocation;
  pickupLocation: PickupLocation;
  dropLocation: DropLocation;
}

export interface LocationType {
  value: string;
  label: string;
  id: string;
  SubLocation?: SubLocationType[];
}

export interface SubLocationType {
  value: string;
  label: string;
  id: string;
  subLocationName: string;
}
