export type ParkingStatus = 'available' | 'limited' | 'full';

export interface ParkingFeature {
  covered: boolean;
  cctv: boolean;
  security: boolean;
  evCharging: boolean;
  handicap: boolean;
}

export interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  price: number;
  distance: number;
  rating: number;
  status: ParkingStatus;
  totalSpots: number;
  availableSpots: number;
  features: ParkingFeature;
  lat: number;
  lng: number;
  image?: string;
}

export interface BookingHistory {
  id: string;
  spotId: string;
  spotName: string;
  date: string;
  duration: number;
  totalCost: number;
  status: 'completed' | 'upcoming' | 'cancelled';
}
