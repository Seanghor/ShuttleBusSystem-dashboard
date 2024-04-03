export interface addNewMainLocationApiProps {
  token: string | undefined;
  locationName: string;
}

export interface editMainLocationApiProps {
  id: string,
  locationName: string,
  token: string | undefined
}

export interface addNewPickupPointApiProps {
  mainLocationId: string,
  locationName: string,
  token: string | undefined,
}

export interface editPickupPointApiProps {
  token: string | undefined,
  pickupLocationId: string,
  pickupLocationName: string,
  mainLocationId: string,
}

export interface deletePickupPointApiProps {
  token: string | undefined,
  pickupLocationId: string,
}