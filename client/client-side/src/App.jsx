import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';


import Landing from './pages/Landing';
/*



import Analyze from './pages/Analyze';  
import SavedPlans from './pages/SavedPlans';*/

// Components
import ProtectedRoute from './components/ProtectedRoutes';

const App = () => {
  return (
    <div className="min-h-screen bg-white font-inter">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        theme="light"
      />

      <Routes>
        {/* --- Public Routes --- */}
       // <Route path="/" element={<Landing/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/email-verify" element={<EmailVerify />} />

        {/* --- Protected Routes (The "Auth Wall") --- */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        

        {/* --- 404 Redirect --- */}
      //  <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;