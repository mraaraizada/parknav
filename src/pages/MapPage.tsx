import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Filter, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockParkingSpots } from '../data/mockParkingData';
import ParkingMap from '../components/Map/ParkingMap';
import BottomNav from '../components/Navigation/BottomNav';
import type { ParkingSpot } from '../types/parking';

export default function MapPage() {
  const navigate = useNavigate();
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [search, setSearch] = useState('');

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 z-20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-colors flex-shrink-0">
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center">
              <MapPin size={16} color="white" />
            </div>
            <span className="font-bold text-slate-800">Map View</span>
          </div>
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search on map..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button className="w-9 h-9 flex items-center justify-center bg-slate-100 rounded-xl text-slate-600 hover:bg-slate-200 transition-colors flex-shrink-0">
            <Filter size={15} />
          </button>
        </div>
      </div>

      {/* Map + side panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Side panel - desktop */}
        <div className="hidden lg:flex flex-col w-80 bg-white border-r border-slate-100 overflow-y-auto">
          <div className="p-4 border-b border-slate-50">
            <h3 className="font-semibold text-slate-700 text-sm">Nearby Spots</h3>
          </div>
          <div className="p-3 space-y-2">
            {mockParkingSpots.map(spot => (
              <motion.div
                key={spot.id}
                whileHover={{ x: 3 }}
                onClick={() => setSelectedSpot(selectedSpot?.id === spot.id ? null : spot)}
                className={`p-3 rounded-xl cursor-pointer border transition-all ${
                  selectedSpot?.id === spot.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor:
                        spot.status === 'available' ? '#10B981' :
                        spot.status === 'limited' ? '#F59E0B' : '#EF4444',
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800 truncate">{spot.name}</div>
                    <div className="text-xs text-slate-400">{spot.distance}km · ₹{spot.price}/hr</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Full map */}
        <div className="flex-1 relative">
          <ParkingMap
            spots={mockParkingSpots}
            selectedSpot={selectedSpot}
            onSpotSelect={setSelectedSpot}
          />
        </div>
      </div>

      <BottomNav active="map" />
    </div>
  );
}
