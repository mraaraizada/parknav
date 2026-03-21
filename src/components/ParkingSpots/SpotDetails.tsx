
import type { ParkingSpot } from '@/types';

interface SpotDetailsProps {
  spot: ParkingSpot;
  onClose: () => void;
  onBook?: () => void;
}

const SpotDetails = ({ spot, onClose, onBook }: SpotDetailsProps) => {
  return (
    <div className="bg-soft-purple p-6 rounded-lg shadow-md">
      <h2 className="text-vivid-purple text-2xl font-bold mb-4">{spot.name}</h2>
      
      <div className="space-y-3">
        <p className="text-secondary-purple flex items-center">
          <span className="mr-2">📍</span>
          {spot.address}
        </p>
        
        {spot.availability && (
          <p className="text-dark-purple flex items-center">
            <span className="mr-2">💺</span>
            Available Spots: 
            <span className="font-bold ml-2 text-primary-purple">
              {spot.availability.available}/{spot.availability.total}
            </span>
          </p>
        )}
        
        {spot.pricing && (
          <p className="text-tertiary-purple flex items-center">
            <span className="mr-2">💰</span>
            Price: 
            <span className="font-bold ml-2 text-primary-purple">
              ₹{spot.pricing.hourly}/hour
            </span>
          </p>
        )}
        
        {spot.features && (
          <div className="mt-4">
            <h3 className="text-dark-purple font-semibold mb-2">Features:</h3>
            <ul className="list-disc list-inside text-secondary-purple">
              {spot.features.map((feature, index) => (
                <li key={index} className="text-tertiary-purple">{feature}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {onBook && (
        <button 
          onClick={onBook}
          className="mt-4 w-full bg-parknav-blue text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Book Now
        </button>
      )}
      
      <button 
        onClick={onClose} 
        className="mt-2 w-full bg-primary-purple text-white py-2 rounded-lg hover:bg-secondary-purple transition-colors"
      >
        Close
      </button>
    </div>
  );
};

export default SpotDetails;

