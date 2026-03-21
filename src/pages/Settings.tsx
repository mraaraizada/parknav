import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Map, Zap, Moon, Globe, Info, ChevronRight, Settings as SettingsIcon, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/Navigation/BottomNav';

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-blue-500' : 'bg-slate-200'}`}
    >
      <motion.div
        animate={{ x: value ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
      />
    </button>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: true,
    liveUpdates: true,
    evFilter: false,
    darkMode: false,
    locationTracking: true,
    soundAlerts: false,
    autoBook: false,
    analytics: true,
  });

  const set = (key: keyof typeof settings) => (val: boolean) =>
    setSettings(prev => ({ ...prev, [key]: val }));

  const sections = [
    {
      title: 'Notifications',
      icon: Bell,
      color: 'bg-amber-100 text-amber-600',
      items: [
        { key: 'notifications', label: 'Push Notifications', sub: 'Booking confirmations and updates' },
        { key: 'soundAlerts', label: 'Sound Alerts', sub: 'Audio cues for navigation' },
      ],
    },
    {
      title: 'Map & Navigation',
      icon: Map,
      color: 'bg-blue-100 text-blue-600',
      items: [
        { key: 'liveUpdates', label: 'Live Updates', sub: 'Real-time availability refresh' },
        { key: 'locationTracking', label: 'Location Tracking', sub: 'Required for nearby spots' },
      ],
    },
    {
      title: 'Preferences',
      icon: Zap,
      color: 'bg-green-100 text-green-600',
      items: [
        { key: 'evFilter', label: 'EV Charging Only', sub: 'Show only EV-compatible spots' },
        { key: 'autoBook', label: 'Smart Booking', sub: 'Auto-book best available spot' },
      ],
    },
    {
      title: 'Appearance',
      icon: Moon,
      color: 'bg-indigo-100 text-indigo-600',
      items: [
        { key: 'darkMode', label: 'Dark Mode', sub: 'Use dark theme' },
        { key: 'analytics', label: 'Share Analytics', sub: 'Help improve ParkNav' },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 px-4 py-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center hover:bg-slate-100 rounded-xl transition-colors">
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center">
              <SettingsIcon size={16} color="white" />
            </div>
            <h1 className="font-bold text-slate-800 text-lg">Settings</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20 px-4 py-4 space-y-4">
        {sections.map((section, si) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-50">
              <div className={`w-8 h-8 ${section.color} rounded-xl flex items-center justify-center`}>
                <section.icon size={15} />
              </div>
              <span className="font-semibold text-slate-800 text-sm">{section.title}</span>
            </div>
            {section.items.map((item, ii) => (
              <div
                key={item.key}
                className={`flex items-center px-4 py-3.5 ${ii < section.items.length - 1 ? 'border-b border-slate-50' : ''}`}
              >
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-800">{item.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{item.sub}</div>
                </div>
                <Toggle
                  value={settings[item.key as keyof typeof settings]}
                  onChange={set(item.key as keyof typeof settings)}
                />
              </div>
            ))}
          </motion.div>
        ))}

        {/* App info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {[
            { icon: Globe, label: 'Language', value: 'English (India)', hasArrow: true },
            { icon: Info, label: 'App Version', value: 'v2.4.1', hasArrow: false },
          ].map((item, i) => (
            <div key={item.label} className={`flex items-center gap-3 px-4 py-3.5 ${i === 0 ? 'border-b border-slate-50' : ''}`}>
              <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center">
                <item.icon size={15} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-800">{item.label}</div>
              </div>
              <span className="text-sm text-slate-400">{item.value}</span>
              {item.hasArrow && <ChevronRight size={16} className="text-slate-300" />}
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="settings" />
    </div>
  );
}
