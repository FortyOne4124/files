import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainPage    from './pages/MainPage';
import LoginPage   from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CabinetPage  from './pages/CabinetPage';
import BookingPage  from './pages/BookingPage';
import AdminPage    from './pages/AdminPage';

/* Защищённый маршрут — перенаправляет на /login при отсутствии токена */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/"         element={<MainPage />} />
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cabinet"  element={<PrivateRoute><CabinetPage /></PrivateRoute>} />
      <Route path="/booking"  element={<PrivateRoute><BookingPage /></PrivateRoute>} />
      <Route path="/admin"    element={<AdminPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
