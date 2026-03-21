
import type { ParkingSpot } from '@/types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Car, ZoomIn, ZoomOut, Crosshair } from 'lucide-react';
import { useState, useEffect } from 'react';

interface MapViewProps {
  onSpotClick?: (spot: ParkingSpot) => void;
  selectedSpot?: ParkingSpot | null;
  userLocation?: { latitude: number; longitude: number } | null;
  nearbySpots?: ParkingSpot[];
}

const MapView = ({ onSpotClick, selectedSpot, userLocation, nearbySpots }: MapViewProps) => {
  const [carPosition, setCarPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [mapScale, setMapScale] = useState(1);

  // Initialize car position to center when component mounts
  useEffect(() => {
    if (userLocation) {
      setCarPosition({ x: 0, y: 0 });
    }
  }, [userLocation]);

  const handleZoomIn = () => {
    setMapScale(prev => Math.min(prev + 0.2, 3));
    toast.info("Zooming in...");
  };

  const handleZoomOut = () => {
    setMapScale(prev => Math.max(prev - 0.2, 0.5));
    toast.info("Zooming out...");
  };

  const handleCenterLocation = () => {
    if (!userLocation) {
      toast.error("Unable to find your location");
      return;
    }
    // Reset car position to center
    setCarPosition({ x: 0, y: 0 });
    toast.info("Centering to your location...");
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="relative w-full h-full bg-[#1A1F2C] rounded-lg overflow-hidden">
      {/* Dark Mode Map Background */}
      <div 
        className="absolute inset-0"
        style={{ transform: `scale(${mapScale})`, transition: 'transform 0.3s ease-out' }}
      >
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Map Grid Pattern */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
            </pattern>
            <pattern id="roads" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            </pattern>
            <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#2A3441', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#1A1F2C', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#mapGradient)" />
          <rect width="100" height="100" fill="url(#grid)" />
          <rect width="100" height="100" fill="url(#roads)" />
        </svg>
      </div>

      {/* Map Controls */}
      <div className="absolute right-4 top-4 flex flex-col gap-2">
        {/* Zoom Controls */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <ZoomIn size={20} />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <ZoomOut size={20} />
        </motion.button>

        {/* Center Location Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCenterLocation}
          className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <Crosshair size={20} />
        </motion.button>
      </div>

      {/* Movable User Location (Car) */}
      {userLocation && (
        <motion.div
          drag
          dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          initial={{ x: 0, y: 0 }}
          animate={{ 
            x: carPosition.x, 
            y: carPosition.y,
            scale: isDragging ? 1.2 : 1
          }}
          onDragTransitionEnd={() => {
            setCarPosition({ 
              x: parseFloat(getComputedStyle(document.querySelector('.car-icon')!).transform.split(',')[4] || '0'), 
              y: parseFloat(getComputedStyle(document.querySelector('.car-icon')!).transform.split(',')[5] || '0')
            });
          }}
          whileDrag={{ scale: 1.2 }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-30"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative car-icon"
          >
            <Car className="w-8 h-8 text-parknav-blue" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-500/20 rounded-full animate-pulse" />
          </motion.div>
        </motion.div>
      )}

      {/* Nearby Parking Spots with Random Placement */}
      <AnimatePresence>
        {nearbySpots?.map((spot) => {
          const angle = Math.random() * Math.PI * 2;
          const distance = 80 + Math.random() * 80; // Random distance between 80-160px
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;

          return (
            <motion.button
              key={spot.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                x,
                y
              }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => onSpotClick?.(spot)}
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group ${
                selectedSpot?.id === spot.id ? 'z-20' : 'z-10'
              }`}
              whileHover={{ scale: 1.1 }}
            >
              <div className="relative">
                <MapPin 
                  className={`w-6 h-6 ${
                    selectedSpot?.id === spot.id 
                      ? 'text-parknav-orange' 
                      : 'text-white'
                  }`} 
                />
                <motion.div
                  animate={{ 
                    scale: selectedSpot?.id === spot.id ? [1, 1.2, 1] : 1
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full ${
                    selectedSpot?.id === spot.id 
                      ? 'bg-parknav-orange/20' 
                      : 'bg-white/20'
                  }`}
                />
              </div>
              
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity w-32">
                <p className="text-xs font-semibold text-white truncate">{spot.name}</p>
                <p className="text-xs text-gray-400">{spot.distance}</p>
              </div>
            </motion.button>
          );
        })}
      </AnimatePresence>

      {/* Map Info Legend */}
      <div className="absolute bottom-4 left-4 bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg p-3">
        <div className="flex items-center space-x-2">
          <Car className="w-4 h-4 text-parknav-blue" />
          <span className="text-sm font-medium text-white">Your Location (Drag to Move)</span>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <MapPin className="w-4 h-4 text-parknav-orange" />
          <span className="text-sm font-medium text-white">Available Spots</span>
        </div>
      </div>
    </div>
  );
};

export default MapView;
