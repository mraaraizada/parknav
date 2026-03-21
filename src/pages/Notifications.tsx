import { motion } from 'framer-motion';
import { Bell, CheckCircle2, AlertCircle, Info, Clock, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function Notifications() {
  const navigate = useNavigate();
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'success',
      title: 'Booking Confirmed',
      message: 'Your parking spot at Connaught Place has been confirmed',
      time: '5 min ago',
      read: false,
    },
    {
      id: '2',
      type: 'info',
      title: 'Parking Reminder',
      message: 'Your parking session ends in 30 minutes',
      time: '1 hour ago',
      read: false,
    },
    {
      id: '3',
      type: 'warning',
      title: 'Payment Due',
      message: 'Complete payment for your last booking',
      time: '2 hours ago',
      read: true,
    },
    {
      id: '4',
      type: 'success',
      title: 'Points Earned',
      message: 'You earned 50 loyalty points from your last booking',
      time: '1 day ago',
      read: true,
    },
    {
      id: '5',
      type: 'info',
      title: 'New Feature',
      message: 'Check out our new EV charging station finder',
      time: '2 days ago',
      read: true,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return { Icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' };
      case 'warning':
        return { Icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100' };
      default:
        return { Icon: Info, color: 'text-blue-600', bg: 'bg-blue-100' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-6">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-colors">
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center">
                <Bell size={16} color="white" />
              </div>
              <h1 className="font-bold text-slate-800 text-lg">Notifications</h1>
            </div>
          </div>
          <button className="text-sm text-blue-500 font-medium hover:text-blue-600">
            Mark all read
          </button>
        </div>
      </div>

      {/* Notifications list */}
      <div className="px-4 py-4 space-y-2">
        {notifications.map((notif, i) => {
          const { Icon, color, bg } = getIcon(notif.type);
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white rounded-2xl p-4 shadow-sm border transition-all hover:shadow-md cursor-pointer ${
                notif.read ? 'border-slate-100' : 'border-blue-200 bg-blue-50/30'
              }`}
            >
              <div className="flex gap-3">
                <div className={`w-10 h-10 ${bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <Icon size={18} className={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-800 text-sm">{notif.title}</h3>
                    {!notif.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{notif.message}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                    <Clock size={11} />
                    {notif.time}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
