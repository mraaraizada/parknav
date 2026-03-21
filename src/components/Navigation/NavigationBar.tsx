
import { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Home, History, User, Settings } from 'lucide-react';

const navItems = [
  { title: 'Home', icon: Home, path: '/dashboard' },
  { title: 'History', icon: History, path: '/history' },
  { title: 'Profile', icon: User, path: '/profile' },
  { title: 'Settings', icon: Settings, path: '/settings' }
];

const NavigationBar = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border flex justify-around items-center px-2 z-20">
      {navItems.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          className={({ isActive }) => {
            if (isActive && activeTab !== index) {
              setActiveTab(index);
            }
            return 'relative';
          }}
        >
          {({ isActive }) => (
            <div className="flex flex-col items-center justify-center w-16">
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-parknav-orange"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              
              <div className={`p-2 rounded-full transition-colors ${isActive ? 'text-parknav-orange' : 'text-gray-400'}`}>
                <item.icon size={24} />
              </div>
              
              <span className={`text-sm mt-1 font-medium transition-colors ${isActive ? 'text-parknav-deep-blue' : 'text-gray-400'}`}>
                {item.title}
              </span>
            </div>
          )}
        </NavLink>
      ))}
    </div>
  );
};

export default NavigationBar;
