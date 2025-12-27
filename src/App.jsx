import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MainLayout } from './components/Layout/MainLayout';
import { FloorPlan } from './components/Map/FloorPlan';
import { Onboarding } from './components/UI/Onboarding';
import './index.css';

const AppContent = () => {
  const { user, loading } = useApp();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Cargando Oficina Virtual...</p>
      </div>
    );
  }

  return (
    <>
      {!user && <Onboarding />}
      <MainLayout>
        {user && <FloorPlan />}
      </MainLayout>
    </>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
