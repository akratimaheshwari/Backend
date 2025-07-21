// /src/components/layout/MainLayout.jsx
import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  const [location, setLocation] = useState("");

  return (
    <>
      <Header location={location} setLocation={setLocation} />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
