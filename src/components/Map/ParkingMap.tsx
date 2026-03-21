import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, X, Star, Navigation, Car, Video, Shield, Zap } from 'lucide-react';
import type { ParkingSpot } from '../../types/parking';

interface Props {
  spots: ParkingSpot[];
  selectedSpot: ParkingSpot | null;
  onSpotSelect: (spot: ParkingSpot | null) => void;
}

const STATUS_COLORS: Record<string, string> = {
  available: '#10B981',
  limited: '#F59E0B',
  full: '#EF4444',
};

// Normalize lat/lng to 0..100 range for layout on the fake map canvas
function normalize(spots: ParkingSpot[]) {
  const lats = spots.map(s => s.lat);
  const lngs = spots.map(s => s.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const padX = 10;
  const padY = 10;

  return spots.map(s => ({
    ...s,
    px: padX + ((s.lng - minLng) / (maxLng - minLng || 1)) * (100 - padX * 2),
    py: padY + ((maxLat - s.lat) / (maxLat - minLat || 1)) * (100 - padY * 2),
  }));
}

export default function ParkingMap({ spots, selectedSpot, onSpotSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const positioned = normalize(spots);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-100 to-blue-50 overflow-hidden">
      {/* Fake map grid */}
      <div className="absolute inset-0">
        {/* Horizontal grid lines */}
        {[...Array(10)].map((_, i) => (
          <div key={`h-${i}`} className="absolute w-full border-t border-slate-200/60" style={{ top: `${i * 10}%` }} />
        ))}
        {/* Vertical grid lines */}
        {[...Array(12)].map((_, i) => (
          <div key={`v-${i}`} className="absolute h-full border-l border-slate-200/60" style={{ left: `${i * 9}%` }} />
        ))}

        {/* Roads */}
        <div className="absolute w-full h-4 bg-white/50 top-1/3" style={{ top: '40%' }} />
        <div className="absolute w-full h-3 bg-white/40" style={{ top: '65%' }} />
        <div className="absolute h-full w-5 bg-white/50" style={{ left: '30%' }} />
        <div className="absolute h-full w-4 bg-white/40" style={{ left: '60%' }} />
        <div className="absolute h-full w-3 bg-white/30" style={{ left: '80%' }} />

        {/* Blocks / buildings */}
        {[
          { l: '5%', t: '10%', w: 70, h: 50 },
          { l: '15%', t: '20%', w: 50, h: 40 },
          { l: '35%', t: '10%', w: 60, h: 35 },
          { l: '65%', t: '15%', w: 80, h: 55 },
          { l: '5%', t: '50%', w: 65, h: 45 },
          { l: '35%', t: '55%', w: 55, h: 40 },
          { l: '65%', t: '50%', w: 70, h: 50 },
          { l: '10%', t: '75%', w: 60, h: 45 },
          { l: '40%', t: '78%', w: 50, h: 35 },
          { l: '70%', t: '72%', w: 65, h: 48 },
        ].map((b, i) => (
          <div
            key={i}
            className="absolute rounded-sm bg-slate-300/30 border border-slate-300/20"
            style={{ left: b.l, top: b.t, width: b.w, height: b.h }}
          />
        ))}

        {/* Map label */}
        <div className="absolute top-3 left-3 bg-white/80 backdrop-blur rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm border border-slate-200/60">
          Delhi NCR
        </div>

        {/* Zoom controls */}
        <div className="absolute right-3 top-3 flex flex-col bg-white shadow-md rounded-xl overflow-hidden border border-slate-200">
          <button className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-50 text-lg font-bold border-b border-slate-100">+</button>
          <button className="w-9 h-9 flex items-center justify-center text-slate-600 hover:bg-slate-50 text-lg font-bold">−</button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur rounded-xl p-3 shadow-md border border-slate-200 text-xs">
          <div className="font-semibold text-slate-700 mb-1.5">Availability</div>
          {[
            { color: '#10B981', label: 'Available' },
            { color: '#F59E0B', label: 'Limited' },
            { color: '#EF4444', label: 'Full' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5 mb-1 last:mb-0">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: l.color }} />
              <span className="text-slate-600">{l.label}</span>
            </div>
          ))}
        </div>

        {/* User location */}
        <motion.div
          className="absolute z-10"
          style={{ left: '48%', top: '42%', transform: 'translate(-50%, -50%)' }}
        >
          <div className="relative">
            <div className="w-5 h-5 bg-blue-500 rounded-full border-2 border-white shadow-lg z-10 relative" />
            <div className="absolute inset-0 w-5 h-5 bg-blue-400 rounded-full animate-ping opacity-60" />
          </div>
        </motion.div>
      </div>

      {/* Parking markers */}
      {positioned.map(spot => (
        <motion.div
          key={spot.id}
          className="absolute z-20 cursor-pointer"
          style={{ left: `${spot.px}%`, top: `${spot.py}%`, transform: 'translate(-50%, -100%)' }}
          onMouseEnter={() => setHovered(spot.id)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onSpotSelect(selectedSpot?.id === spot.id ? null : spot)}
          animate={{ scale: selectedSpot?.id === spot.id ? 1.2 : hovered === spot.id ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="flex flex-col items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white"
              style={{ backgroundColor: STATUS_COLORS[spot.status] }}
            >
              {spot.availableSpots}
            </div>
            <div
              className="w-2 h-2 rotate-45 -mt-1"
              style={{ backgroundColor: STATUS_COLORS[spot.status] }}
            />
          </div>

          {/* Tooltip on hover */}
          <AnimatePresence>
            {hovered === spot.id && selectedSpot?.id !== spot.id && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border border-slate-100 p-3 w-48 pointer-events-none z-30"
              >
                <div className="text-xs font-semibold text-slate-800 mb-1 leading-tight">{spot.name}</div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-bold text-blue-500">₹{spot.price}/hr</span>
                  <span>{spot.distance}km</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {/* Selected spot detail panel */}
      <AnimatePresence>
        {selectedSpot && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-30"
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{selectedSpot.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedSpot.address}</p>
                </div>
                <button
                  onClick={() => onSpotSelect(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors flex-shrink-0"
                >
                  <X size={13} />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-3 text-sm">
                <span className="font-bold text-blue-500 text-lg">₹{selectedSpot.price}/hr</span>
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <MapPin size={11} /> {selectedSpot.distance} km
                </span>
                <span className="text-slate-400 text-xs flex items-center gap-1">
                  <Star size={11} className="fill-amber-400 text-amber-400" /> {selectedSpot.rating}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                {selectedSpot.features.covered && <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-lg"><Car size={9} /> Covered</span>}
                {selectedSpot.features.cctv && <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-lg"><Video size={9} /> CCTV</span>}
                {selectedSpot.features.security && <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-lg"><Shield size={9} /> Security</span>}
                {selectedSpot.features.evCharging && <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg"><Zap size={9} /> EV</span>}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2.5 bg-blue-500 text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-colors" disabled={selectedSpot.status === 'full'}>
                  {selectedSpot.status === 'full' ? 'Spot Full' : 'Book Now'}
                </button>
                <button className="flex items-center gap-1 px-3 py-2.5 border border-slate-200 text-slate-600 text-xs font-medium rounded-xl hover:bg-slate-50 transition-colors">
                  <Navigation size={13} /> Directions
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
