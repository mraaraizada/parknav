import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Splash from './pages/Splash';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import History from './pages/History';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Vehicles from './pages/Vehicles';
import Favorites from './pages/Favorites';
import Notifications from './pages/Notifications';
import PaymentMethods from './pages/PaymentMethods';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/history" element={<History />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/payment-methods" element={<PaymentMethods />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
