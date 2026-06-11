export type Station = {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  totalSlots: number;
  availableSlots: number;
};

export type ReservationFormValues = {
  plate: string;
  driverName: string;
  phone: string;
  scheduledTime: string;
  truckSize: "Pequeno" | "Médio" | "Grande";
  isFleet: boolean;
  spotsRequested: number;
};
