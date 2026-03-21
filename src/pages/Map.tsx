
import { useState } from 'react';
import MapView from '@/components/Map/MapView';
import NavigationBar from '@/components/Navigation/NavigationBar';
import { delhiCenter } from '@/data/mockData';

const MapPage = () => {
  const [userLocation] = useState(delhiCenter);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow-sm z-10">
        <div className="flex justify-between items-center px-4 py-3">
          <h1 className="text-xl font-bold">
            <span className="text-parknav-orange">Map</span>
            <span className="text-parknav-blue"> View</span>
          </h1>
        </div>
      </header>

      <main className="flex-1 relative">
        <MapView userLocation={userLocation} />
      </main>

      <NavigationBar />
    </div>
  );
};

export default MapPage;
