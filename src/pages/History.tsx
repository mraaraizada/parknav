import { motion } from 'framer-motion';
import { Clock, CheckCircle2, XCircle, Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockBookingHistory } from '../data/mockParkingData';
import BottomNav from '../components/Navigation/BottomNav';

const STATUS_CONFIG = {
  completed: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50', label: 'Completed' },
  upcoming: { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Upcoming' },
  cancelled: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', label: 'Cancelled' },
};

export default function History() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-colors">
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center">
              <Clock size={16} color="white" />
            </div>
            <h1 className="font-bold text-slate-800 text-lg">Booking History</h1>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex-shrink-0 px-4 py-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Bookings', value: mockBookingHistory.length, color: 'text-blue-500' },
            { label: 'Completed', value: mockBookingHistory.filter(b => b.status === 'completed').length, color: 'text-green-500' },
            { label: 'Total Spent', value: `₹${mockBookingHistory.filter(b => b.status === 'completed').reduce((acc, b) => acc + b.totalCost, 0)}`, color: 'text-amber-500' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-slate-100">
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Booking list */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="space-y-3">
          {mockBookingHistory.map((booking, i) => {
            const config = STATUS_CONFIG[booking.status];
            const StatusIcon = config.icon;
            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 ${config.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <StatusIcon size={18} className={config.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-slate-800 text-sm leading-tight">{booking.spotName}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.bg} ${config.color} flex-shrink-0`}>
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} /> {booking.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {booking.duration}h
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-slate-800">₹{booking.totalCost}</span>
                      {booking.status === 'upcoming' && (
                        <button className="text-xs text-red-500 hover:text-red-600 font-medium">Cancel</button>
                      )}
                      {booking.status === 'completed' && (
                        <button className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 font-medium">
                          Rebook <ChevronRight size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <BottomNav active="history" />
    </div>
  );
}
