import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/UI/Navbar';
import Footer from './components/Sections/Footer';
import Preloader from './components/UI/Preloader';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import db from './utils/db';

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app-container">
      <Preloader loading={loading} />
      {!location.pathname.startsWith('/dashboard') && !location.pathname.startsWith('/admin') && location.pathname !== '/login' && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            db.getUser() ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/admin" element={<Navigate to="/login" replace />} />
      </Routes>
      {!location.pathname.startsWith('/dashboard') && !location.pathname.startsWith('/admin') && location.pathname !== '/login' && <Footer />}
    </div>
  );
}

export default App;
