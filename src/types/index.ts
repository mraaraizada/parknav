export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  vehicles: Vehicle[];
  paymentMethods: PaymentMethod[];
  bookingHistory?: BookingHistory[];
  favorites: string[];
  history?: BookingHistoryItem[];
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  licensePlate: string;
  type?: string;
  color?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'paypal' | 'card' | 'upi';
  accountNumber?: string;
  expiryDate?: string;
  name?: string;
  lastFour?: string;
  isDefault?: boolean;
}

export interface BookingHistory {
  id: string;
  spotId: string;
  startTime: Date;
  endTime: Date;
  totalCost: number;
  status: 'active' | 'completed' | 'cancelled';
  spotName?: string;
  date?: string;
  duration?: string;
  amount?: number;
}

export interface BookingHistoryItem {
  id: string;
  spotId: string;
  spotName: string;
  date: string;
  duration: string;
  amount: number;
  status: 'active' | 'completed' | 'cancelled';
}

export interface ParkingSpot {
  id: string;
  name: string;
  address: string;
  distance: number | string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  pricing?: {
    hourly: number;
    daily: number;
  };
  availability?: {
    total: number;
    available: number;
  };
  rating?: number;
  reviews?: number;
  features?: string[];
  eta?: string;
  distanceValue?: number;
  price?: number;
  available?: boolean;
  totalSpots?: number;
  occupiedSpots?: number;
}
