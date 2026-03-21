
import type { ParkingSpot } from '@/types';
import { Star, Clock, MapPin, ShieldCheck, Zap, Droplets, ParkingCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ParkingSpotCardProps {
  spot: ParkingSpot;
  isSelected?: boolean;
  onClick?: () => void;
}

const ParkingSpotCard = ({ spot, isSelected = false, onClick }: ParkingSpotCardProps) => {
  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'security':
        return <ShieldCheck size={16} className="text-green-600" />;
      case 'ev-charging':
        return <Zap size={16} className="text-blue-500" />;
      case 'car-wash':
        return <Droplets size={16} className="text-blue-400" />;
      default:
        return <ParkingCircle size={16} className="text-parknav-blue" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={`
        relative rounded-lg overflow-hidden shadow-md mb-3 
        ${isSelected ? 'ring-2 ring-parknav-orange' : 'hover:shadow-lg'}
        bg-white dark:bg-gray-800 cursor-pointer transition-all duration-300
      `}
    >
      {/* Availability indicator with improved contrast */}
      {spot.availability && (
        <div 
          className={`
            absolute top-3 right-3 text-xs font-bold rounded-full px-2 py-1 z-10
            ${spot.availability.available > 10 
              ? 'bg-green-600 text-white' 
              : spot.availability.available > 0 
                ? 'bg-orange-600 text-white'
                : 'bg-red-600 text-white'
            }
          `}
        >
          {spot.availability.available} spots
        </div>
      )}

      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-parknav-deep-blue dark:text-white">{spot.name}</h3>
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
              <MapPin size={14} className="inline mr-1 text-parknav-blue" />
              <span className="truncate">{spot.address}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-lg font-bold text-parknav-orange">₹{spot.pricing?.hourly ?? 0}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">per hour</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center">
            <Star 
              size={16} 
              className={`${(spot.rating ?? 0) >= 4 ? 'text-yellow-500' : 'text-gray-400'} fill-current`} 
            />
            <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              {spot.rating ?? 0} ({spot.reviews ?? 0})
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Clock size={16} className="mr-1 text-parknav-blue" />
            <span className="font-medium text-gray-600 dark:text-gray-300">{spot.distance}</span>
            {spot.eta && (
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({spot.eta})</span>
            )}
          </div>
        </div>

        {spot.features && spot.features.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {spot.features.slice(0, 3).map((feature, index) => (
              <div 
                key={index}
                className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 text-xs"
              >
                {getFeatureIcon(feature)}
                <span className="ml-1 capitalize text-gray-700 dark:text-gray-200">{feature.replace(/-/g, ' ')}</span>
              </div>
            ))}
            {spot.features.length > 3 && (
              <div className="bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 text-xs text-gray-600 dark:text-gray-300">
                +{spot.features.length - 3} more
              </div>
            )}
          </div>
        )}
      </div>

      {isSelected && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-parknav-blue text-white p-3 flex justify-between items-center"
        >
          <span className="font-medium">Selected</span>
          <button 
            className="bg-white text-parknav-blue font-bold rounded-full px-3 py-1 text-sm"
            onClick={(e) => {
              e.stopPropagation();
              // Book now functionality would go here
              alert('Booking feature would open here!');
            }}
          >
            Book Now
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ParkingSpotCard;
