import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Star, Car, CreditCard, Bell, Shield,
  ChevronRight, Edit3, LogOut, Award, ChevronLeft
} from 'lucide-react';
import BottomNav from '../components/Navigation/BottomNav';

export default function Profile() {
  const navigate = useNavigate();
  const menuItems = [
    { icon: Car, label: 'My Vehicles', sub: '2 vehicles registered', color: 'bg-blue-100 text-blue-600', path: '/vehicles' },
    { icon: CreditCard, label: 'Payment Methods', sub: 'UPI, Visa •••• 4321', color: 'bg-green-100 text-green-600', path: '/payment-methods' },
    { icon: Bell, label: 'Notifications', sub: 'All notifications on', color: 'bg-amber-100 text-amber-600', path: '/notifications' },
    { icon: Shield, label: 'Privacy & Security', sub: '2FA enabled', color: 'bg-indigo-100 text-indigo-600', path: '/settings' },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-colors">
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center">
                <Car size={16} color="white" />
              </div>
              <h1 className="font-bold text-slate-800 text-lg">Profile</h1>
            </div>
          </div>
          <button className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors">
            <Edit3 size={15} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {/* Profile card */}
        <div className="mx-4 mt-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold">
              U
            </div>
            <div>
              <h2 className="text-xl font-bold">User</h2>
              <p className="text-blue-100 text-sm">user@email.com</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Award size={14} className="text-amber-300" />
                <span className="text-xs text-blue-100">Gold Member</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-white/20">
            {[
              { label: 'Bookings', value: '47' },
              { label: 'Hours Parked', value: '128' },
              { label: 'Points', value: '2,340' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-blue-100 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Loyalty points */}
        <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-800">Loyalty Points</span>
            <span className="text-xs text-blue-500 font-medium">2,340 pts</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '78%' }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1.5">
            <span>Gold</span>
            <span>660 pts to Platinum</span>
          </div>
        </div>

        {/* Menu items */}
        <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {menuItems.map((item, i) => (
            <Link
              key={item.label}
              to={item.path}
              className={`w-full flex items-center gap-3 p-4 text-left hover:bg-slate-50 transition-colors ${
                i < menuItems.length - 1 ? 'border-b border-slate-50' : ''
              }`}
            >
              <div className={`w-10 h-10 ${item.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                <item.icon size={18} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-slate-800">{item.label}</div>
                <div className="text-xs text-slate-400">{item.sub}</div>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </Link>
          ))}
        </div>

        {/* Logout */}
        <div className="mx-4 mt-4 mb-4">
          <button className="w-full flex items-center justify-center gap-2 py-3.5 border border-red-200 text-red-500 rounded-2xl font-medium hover:bg-red-50 transition-colors text-sm">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>

      <BottomNav active="profile" />
    </div>
  );
}
