
import { useState } from 'react';
import ParkingSpotCard from './ParkingSpotCard';
import { ScrollArea } from '../ui/scroll-area';
import SortButton from './SortButton';
import type { ParkingSpot } from '@/types';

interface ParkingSpotListProps {
  spots: ParkingSpot[];
  onSpotSelect?: (spot: ParkingSpot) => void;
  selectedSpot?: ParkingSpot | null;
}

const ParkingSpotList = ({ spots, onSpotSelect, selectedSpot }: ParkingSpotListProps) => {
  const [sortedSpots, setSortedSpots] = useState(spots);
  const [isSortedByDistance, setIsSortedByDistance] = useState(false);

  const handleSort = () => {
    const sorted = [...sortedSpots].sort((a, b) => {
      // If distance is a string, convert it to a number by parsing
      const getNumericDistance = (distance: string | number): number => {
        if (typeof distance === 'string') {
          // Extract the numeric part from strings like "0.8 km"
          return parseFloat(distance.replace(/[^0-9.]/g, ''));
        }
        return distance as number;
      };

      const distA = getNumericDistance(a.distance);
      const distB = getNumericDistance(b.distance);

      return isSortedByDistance ? distA - distB : distB - distA;
    });
    
    setSortedSpots(sorted);
    setIsSortedByDistance(!isSortedByDistance);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      <div className="sticky top-0 z-10 pb-4">
        <SortButton onSort={handleSort} />
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4">
          {sortedSpots.map((spot) => (
            <ParkingSpotCard 
              key={spot.id} 
              spot={spot} 
              isSelected={selectedSpot?.id === spot.id}
              onClick={() => onSpotSelect && onSpotSelect(spot)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ParkingSpotList;
