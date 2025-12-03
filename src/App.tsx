import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import QrCodePage from './pages/QrCodePage';
import GamePage from './pages/GamePage';
import LeaderboardPage from './pages/LeaderboardPage';
import LandingPage from './pages/LandingPage';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/qr-code"
            element={
              <ProtectedRoute>
                <QrCodePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <LeaderboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game/:gameId"
            element={
              <ProtectedRoute>
                <GamePage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
