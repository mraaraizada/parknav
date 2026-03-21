
import type { ParkingSpot, UserProfile } from '@/types';

export const delhiParkingSpots: ParkingSpot[] = [
  {
    id: 'p1',
    name: 'Connaught Place Secure Parking',
    address: 'Block A, Connaught Place, New Delhi',
    location: {
      latitude: 28.6315,
      longitude: 77.2167
    },
    pricing: {
      hourly: 60,
      daily: 400
    },
    availability: {
      total: 120,
      available: 45
    },
    distance: '0.8 km',
    rating: 4.2,
    reviews: 124,
    features: ['covered', 'security', 'cctv', 'ev-charging'],
    eta: '5 mins',
    // Add backward compatibility fields
    price: 60,
    available: true,
    totalSpots: 120,
    occupiedSpots: 75,
    coordinates: {
      lat: 28.6315,
      lng: 77.2167
    }
  },
  {
    id: 'p2',
    name: 'Janpath Parking Zone',
    address: 'Janpath Road, New Delhi',
    location: {
      latitude: 28.6258,
      longitude: 77.2198
    },
    pricing: {
      hourly: 40,
      daily: 300
    },
    availability: {
      total: 80,
      available: 12
    },
    distance: '1.2 km',
    rating: 3.8,
    reviews: 98,
    features: ['open', 'security', 'cctv'],
    eta: '8 mins',
    // Add backward compatibility fields
    price: 40,
    available: true,
    totalSpots: 80,
    occupiedSpots: 68,
    coordinates: {
      lat: 28.6258,
      lng: 77.2198
    }
  },
  {
    id: 'p3',
    name: 'Palika Bazaar Parking',
    address: 'Palika Bazaar, Connaught Place, New Delhi',
    location: {
      latitude: 28.6307,
      longitude: 77.2199
    },
    pricing: {
      hourly: 50,
      daily: 350
    },
    availability: {
      total: 200,
      available: 76
    },
    distance: '0.5 km',
    rating: 4.0,
    reviews: 215,
    features: ['underground', 'security', 'cctv', 'two-wheeler'],
    eta: '3 mins',
    // Add backward compatibility fields
    price: 50,
    available: true,
    totalSpots: 200,
    occupiedSpots: 124,
    coordinates: {
      lat: 28.6307,
      lng: 77.2199
    }
  },
  {
    id: 'p4',
    name: 'Khan Market Parking Complex',
    address: 'Khan Market, New Delhi',
    location: {
      latitude: 28.6006,
      longitude: 77.2272
    },
    pricing: {
      hourly: 80,
      daily: 500
    },
    availability: {
      total: 60,
      available: 8
    },
    distance: '3.5 km',
    rating: 4.5,
    reviews: 187,
    features: ['covered', 'security', 'cctv', 'valet', 'car-wash'],
    eta: '15 mins',
    // Add backward compatibility fields
    price: 80,
    available: true,
    totalSpots: 60,
    occupiedSpots: 52,
    coordinates: {
      lat: 28.6006,
      lng: 77.2272
    }
  },
  {
    id: 'p5',
    name: 'Karol Bagh Metro Parking',
    address: 'Karol Bagh Metro Station, New Delhi',
    location: {
      latitude: 28.6442,
      longitude: 77.1901
    },
    pricing: {
      hourly: 30,
      daily: 200
    },
    availability: {
      total: 150,
      available: 64
    },
    distance: '4.2 km',
    rating: 3.5,
    reviews: 132,
    features: ['covered', 'metro-connected', 'cctv'],
    eta: '18 mins',
    // Add backward compatibility fields
    price: 30,
    available: true,
    totalSpots: 150,
    occupiedSpots: 86,
    coordinates: {
      lat: 28.6442,
      lng: 77.1901
    }
  },
  {
    id: 'p6',
    name: 'Saket Mall Parking',
    address: 'Select Citywalk Mall, Saket, New Delhi',
    location: {
      latitude: 28.5285,
      longitude: 77.2207
    },
    pricing: {
      hourly: 70,
      daily: 450
    },
    availability: {
      total: 500,
      available: 230
    },
    distance: '10.5 km',
    rating: 4.3,
    reviews: 310,
    features: ['covered', 'security', 'cctv', 'valet', 'ev-charging', 'car-wash'],
    eta: '35 mins',
    // Add backward compatibility fields
    price: 70,
    available: true,
    totalSpots: 500,
    occupiedSpots: 270,
    coordinates: {
      lat: 28.5285,
      lng: 77.2207
    }
  },
  {
    id: 'p7',
    name: 'Nehru Place Parking',
    address: 'Nehru Place, New Delhi',
    location: {
      latitude: 28.5503,
      longitude: 77.2505
    },
    pricing: {
      hourly: 50,
      daily: 300
    },
    availability: {
      total: 180,
      available: 42
    },
    distance: '8.7 km',
    rating: 3.7,
    reviews: 145,
    features: ['covered', 'security', 'cctv'],
    eta: '30 mins',
    // Add backward compatibility fields
    price: 50,
    available: true,
    totalSpots: 180,
    occupiedSpots: 138,
    coordinates: {
      lat: 28.5503,
      lng: 77.2505
    }
  },
  {
    id: 'p8',
    name: 'India Gate Circle Parking',
    address: 'India Gate, New Delhi',
    location: {
      latitude: 28.6129,
      longitude: 77.2295
    },
    pricing: {
      hourly: 50,
      daily: 350
    },
    availability: {
      total: 100,
      available: 22
    },
    distance: '2.8 km',
    rating: 4.1,
    reviews: 178,
    features: ['open', 'security', 'cctv'],
    eta: '12 mins',
    // Add backward compatibility fields
    price: 50,
    available: true,
    totalSpots: 100,
    occupiedSpots: 78,
    coordinates: {
      lat: 28.6129,
      lng: 77.2295
    }
  }
];

export const mockUser: UserProfile = {
  id: 'u1',
  name: 'Rahul Sharma',
  email: 'user@gmail.com',
  phone: '+91 98765 43210',
  vehicles: [
    {
      id: 'v1',
      type: 'car',
      make: 'Maruti Suzuki',
      model: 'Swift',
      color: 'Red',
      licensePlate: 'DL01AB1234'
    },
    {
      id: 'v2',
      type: 'bike',
      make: 'Honda',
      model: 'Activa',
      color: 'Blue',
      licensePlate: 'DL01CD5678'
    }
  ],
  paymentMethods: [
    {
      id: 'pm1',
      type: 'card',
      name: 'HDFC Credit Card',
      lastFour: '4567',
      expiryDate: '05/25',
      isDefault: true
    },
    {
      id: 'pm2',
      type: 'upi',
      name: 'GPay UPI',
      isDefault: false
    }
  ],
  bookingHistory: [], // Add empty bookingHistory to satisfy type
  favorites: ['p1', 'p4', 'p6'],
  history: [
    {
      id: 'b1',
      spotId: 'p1',
      spotName: 'Connaught Place Secure Parking',
      date: '2024-04-18',
      duration: '2 hours',
      amount: 120,
      status: 'completed'
    },
    {
      id: 'b2',
      spotId: 'p4',
      spotName: 'Khan Market Parking Complex',
      date: '2024-04-17',
      duration: '3 hours',
      amount: 240,
      status: 'completed'
    },
    {
      id: 'b3',
      spotId: 'p6',
      spotName: 'Saket Mall Parking',
      date: '2024-04-18',
      duration: '4 hours',
      amount: 280,
      status: 'active'
    },
    {
      id: 'b4',
      spotId: 'p2',
      spotName: 'Janpath Parking Zone',
      date: '2024-04-16',
      duration: '1 hour',
      amount: 40,
      status: 'cancelled'
    },
    {
      id: 'b5',
      spotId: 'p3',
      spotName: 'Palika Bazaar Parking',
      date: '2024-04-18',
      duration: '5 hours',
      amount: 250,
      status: 'active'
    },
    {
      id: 'b6',
      spotId: 'p7',
      spotName: 'Nehru Place Parking',
      date: '2024-04-15',
      duration: '2 hours',
      amount: 100,
      status: 'cancelled'
    },
    {
      id: 'b7',
      spotId: 'p8',
      spotName: 'India Gate Circle Parking',
      date: '2024-04-17',
      duration: '3 hours',
      amount: 150,
      status: 'completed'
    }
  ]
};

export const delhiCenter = {
  latitude: 28.6139,
  longitude: 77.2090
};
