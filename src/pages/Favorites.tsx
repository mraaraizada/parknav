import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Navigation, Trash2, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FavoriteSpot {
  id: string;
  name: string;
  address: string;
  distance: number;
  price: number;
}

export default function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteSpot[]>([
    { id: '1', name: 'Connaught Place Parking', address: 'Connaught Place, New Delhi', distance: 2.3, price: 60 },
    { id: '2', name: 'Select City Walk Mall', address: 'Saket, New Delhi', distance: 5.1, price: 80 },
    { id: '3', name: 'DLF Cyber Hub', address: 'Cyber City, Gurugram', distance: 12.4, price: 100 },
  ]);

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(f => f.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-6">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-colors">
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-500 rounded-xl flex items-center justify-center">
              <Star size={16} color="white" fill="white" />
            </div>
            <h1 className="font-bold text-slate-800 text-lg">Favorite Spots</h1>
          </div>
        </div>
      </div>

      {/* Favorites list */}
      <div className="px-4 py-4">
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <Star size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500">No favorite spots yet</p>
            <p className="text-sm text-slate-400 mt-1">Save your frequently visited parking spots</p>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((spot, i) => (
              <motion.div
                key={spot.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Star size={20} className="text-rose-600" fill="currentColor" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800">{spot.name}</h3>
                    <p className="text-sm text-slate-500 mt-0.5 truncate">{spot.address}</p>
                    <div className="flex items-center gap-3 mt-2 text-sm">
                      <span className="text-blue-500 font-bold">₹{spot.price}/hr</span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <MapPin size={12} /> {spot.distance} km
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="w-9 h-9 flex items-center justify-center bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
                      <Navigation size={14} />
                    </button>
                    <button
                      onClick={() => removeFavorite(spot.id)}
                      className="w-9 h-9 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
