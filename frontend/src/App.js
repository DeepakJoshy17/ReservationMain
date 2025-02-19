

// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SessionProvider } from './context/SessionContext';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
// import AdminManage from './pages/AdminManagement';
import BookPage from './pages/BookPage';
import AdminPage from './pages/AdminPage';
import UserManagement from './pages/UserManagement';
import BoatManagement from './pages/BoatManagement';
import RouteManagement from './pages/RouteManagement';
import StopManagement from './pages/StopManagement';
import StopPricingManagement from './pages/StopPricingManagement';
import StopTimeManagement from './pages/StopTimeManagement';
import SeatManagement from './pages/SeatManagement';
import ScheduleManagement from './pages/ScheduleManagement';
import PaymentManagement from './pages/PaymentManagement';
import BookingManagement from './pages/BookingManagement';
import SeatViewPage from './pages/SeatViewPage';
import UserPaymentPage from './pages/UserPaymentPage';
import TicketPage from './pages/TicketPage';
import UserProfile from './pages/UserProfile';
import ProfileTicketView from './pages/ProfileTicketView';
import UserChat from './pages/UserChat';
import AdminChat from './pages/AdminChat';


function App() {
  return (
    <SessionProvider>
      <Router>
        <Routes>
        <Route path="/" element={<HomePage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="admin" element={<AdminPage/>} />
          <Route path="/book" element={<BookPage/>} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/boats" element={<BoatManagement />} />
          <Route path="/admin/routes" element={<RouteManagement />} />
          <Route path="/admin/route-stops" element={<StopManagement />} />
          <Route path="/admin/stop-pricings" element={<StopPricingManagement />} />
          <Route path="/admin/stop-timings" element={<StopTimeManagement />} />
          <Route path="/admin/seats" element={<SeatManagement />} />
          <Route path="/admin/schedules" element={<ScheduleManagement />} />
          <Route path="/admin/payments" element={<PaymentManagement />} />
          <Route path="/admin/bookings" element={<BookingManagement />} />
          <Route path="/admin-chat" element={<AdminChat />} />
          <Route path="/seats/:schedule_id/:start_stop_id/:end_stop_id" element={<SeatViewPage />} />

          <Route path="/seatview" element={<SeatViewPage />} />
          <Route path="/payment" element={<UserPaymentPage/>} />
          <Route path="/ticket" element={<TicketPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/ticket-view" element={<ProfileTicketView />} />
          <Route path="/user-chat" element={<UserChat />} />

        </Routes>
      </Router>
    </SessionProvider>
  );
}

export default App;

