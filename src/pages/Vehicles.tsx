import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Plus, Edit3, Trash2, X, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Vehicle {
  id: string;
  name: string;
  number: string;
  type: 'car' | 'bike' | 'suv';
  color: string;
}

export default function Vehicles() {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: '1', name: 'Honda City', number: 'DL 01 AB 1234', type: 'car', color: 'Silver' },
    { id: '2', name: 'Royal Enfield', number: 'DL 02 CD 5678', type: 'bike', color: 'Black' },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ name: '', number: '', type: 'car' as const, color: '' });

  const addVehicle = () => {
    if (newVehicle.name && newVehicle.number) {
      setVehicles([...vehicles, { ...newVehicle, id: Date.now().toString() }]);
      setNewVehicle({ name: '', number: '', type: 'car', color: '' });
      setShowAddModal(false);
    }
  };

  const deleteVehicle = (id: string) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-6">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-colors">
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center">
              <Car size={16} color="white" />
            </div>
            <h1 className="font-bold text-slate-800 text-lg">My Vehicles</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <Plus size={16} />
            Add
          </button>
        </div>
      </div>

      {/* Vehicle list */}
      <div className="px-4 py-4 space-y-3">
        {vehicles.map((vehicle, i) => (
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Car size={22} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">{vehicle.name}</h3>
                <p className="text-sm text-slate-500 mt-0.5">{vehicle.number}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg capitalize">{vehicle.type}</span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg">{vehicle.color}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                  <Edit3 size={14} className="text-slate-600" />
                </button>
                <button
                  onClick={() => deleteVehicle(vehicle.id)}
                  className="w-8 h-8 flex items-center justify-center bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={14} className="text-red-500" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Vehicle Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-slate-800">Add Vehicle</h2>
                <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Vehicle Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Honda City"
                    value={newVehicle.name}
                    onChange={e => setNewVehicle({ ...newVehicle, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Registration Number</label>
                  <input
                    type="text"
                    placeholder="DL 01 AB 1234"
                    value={newVehicle.number}
                    onChange={e => setNewVehicle({ ...newVehicle, number: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Vehicle Type</label>
                  <select
                    value={newVehicle.type}
                    onChange={e => setNewVehicle({ ...newVehicle, type: e.target.value as 'car' | 'bike' | 'suv' })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="car">Car</option>
                    <option value="bike">Bike</option>
                    <option value="suv">SUV</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Color</label>
                  <input
                    type="text"
                    placeholder="e.g., Silver"
                    value={newVehicle.color}
                    onChange={e => setNewVehicle({ ...newVehicle, color: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <button
                onClick={addVehicle}
                className="w-full mt-6 py-3.5 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors"
              >
                Add Vehicle
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
