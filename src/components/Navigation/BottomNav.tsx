import { Link } from 'react-router-dom';
import { Home, Map, Clock, User, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { icon: Home, label: 'Dashboard', path: '/dashboard', key: 'dashboard' },
  { icon: Map, label: 'Map', path: '/map', key: 'map' },
  { icon: Clock, label: 'History', path: '/history', key: 'history' },
  { icon: User, label: 'Profile', path: '/profile', key: 'profile' },
  { icon: Settings, label: 'Settings', path: '/settings', key: 'settings' },
];

export default function BottomNav({ active }: { active: string }) {
  return (
    <nav className="flex-shrink-0 bg-white border-t border-slate-100 flex sm:hidden z-20">
      {NAV_ITEMS.map(item => (
        <Link
          key={item.key}
          to={item.path}
          className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors ${
            active === item.key ? 'text-blue-500' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <item.icon size={20} strokeWidth={active === item.key ? 2.5 : 1.8} />
          <span className="text-[10px] font-medium">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
