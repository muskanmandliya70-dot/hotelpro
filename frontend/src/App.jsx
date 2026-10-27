import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import DemoCredentialsBar from './components/DemoCredentialsBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import RoomsPage from './pages/RoomsPage';
import RoomDetailsPage from './pages/RoomDetailsPage';
import BookingCheckoutPage from './pages/BookingCheckoutPage';
import GuestDashboard from './pages/GuestDashboard';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          {/* Quick Evaluator Role Switcher */}
          <DemoCredentialsBar />
          
          {/* Luxury Navigation Header */}
          <Navbar />

          {/* Main Routing Viewport */}
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/rooms/:id" element={<RoomDetailsPage />} />
              
              {/* Guest Booking & Dashboard */}
              <Route
                path="/book/:roomId"
                element={
                  <ProtectedRoute allowedRoles={['guest', 'staff', 'admin']}>
                    <BookingCheckoutPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['guest', 'staff', 'admin']}>
                    <GuestDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Staff Portal */}
              <Route
                path="/staff"
                element={
                  <ProtectedRoute allowedRoles={['staff', 'admin']}>
                    <StaffDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Admin Console */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Authentication */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* 404 Fallback */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
