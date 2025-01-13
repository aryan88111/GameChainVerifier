import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WagerProvider } from './context/WagerContext';
import { GameProvider } from './context/GameContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Games from './pages/Games';
import Wagers from './components/Wagers';
import CreateWager from './pages/CreateWager';
import LiveGames from './pages/LiveGames';
import Profile from './pages/Profile';

const queryClient = new QueryClient();

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth(true);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/api/login" />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <GameProvider>
            <WagerProvider>
              <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <Navbar />
                <Routes>
                  <Route path="/api/login" element={<Login />} />
                  <Route path="/api/register" element={<Register />} />
                  <Route path="/api/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                  <Route path="/api/games" element={<PrivateRoute><Games /></PrivateRoute>} />
                  <Route path="/api/wagers" element={<PrivateRoute><Wagers /></PrivateRoute>} />
                  <Route path="/api/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                  <Route path="/api/wagers/create" element={<PrivateRoute><CreateWager /></PrivateRoute>} />
                  <Route path="/api/live-games" element={<PrivateRoute><LiveGames /></PrivateRoute>} />
                  <Route path="/" element={<Navigate to="/api/dashboard" replace />} />
                </Routes>
              </div>
            </WagerProvider>
          </GameProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
