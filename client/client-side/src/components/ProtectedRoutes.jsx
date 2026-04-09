import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, userData } = useContext(AppContext);
  const location = useLocation();

  // 1. Initial State Check: If we are still booting up and checking the cookie
  // we return null to avoid a "flash" of the login page.
  if (isLoggedIn && userData === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 2. The Redirect: If user is not logged in, send them to login
  if (!isLoggedIn) {
    // state={{ from: location }} allows us to redirect them back here after they login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. The Verification Wall: Forces email verification before seeing the dashboard
  if (userData && !userData.isAccountVerified) {
    return <Navigate to="/email-verify" replace />;
  }

  // 4. Authorized: Show the protected page
  return children;
};

export default ProtectedRoute;