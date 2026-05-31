import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Auth Pages
import Login from './pages/Auth/Login.jsx';

// Layouts
import MainLayout from './layouts/MainLayout.jsx';

// Protected Routes Component
import ProtectedRoute from './routes/ProtectedRoute.jsx';

// Placeholder pages (to be created)
const Dashboard = () => <div className="p-8"><h1 className="text-3xl font-bold">Dashboard</h1><p className="text-dark-400 mt-4">Welcome to GymBro! Select a feature from the menu.</p></div>;
const Progress = () => <div className="p-8"><h1 className="text-3xl font-bold">Progress Tracking</h1><p className="text-dark-400 mt-4">Track your fitness journey with photos and measurements.</p></div>;
const Workouts = () => <div className="p-8"><h1 className="text-3xl font-bold">Workouts</h1><p className="text-dark-400 mt-4">Create and manage your custom workouts.</p></div>;
const Nutrition = () => <div className="p-8"><h1 className="text-3xl font-bold">Nutrition</h1><p className="text-dark-400 mt-4">Log meals and track your macros.</p></div>;
const Goals = () => <div className="p-8"><h1 className="text-3xl font-bold">Goals</h1><p className="text-dark-400 mt-4">Set and achieve your fitness goals.</p></div>;
const Profile = () => <div className="p-8"><h1 className="text-3xl font-bold">Profile</h1><p className="text-dark-400 mt-4">Manage your account settings.</p></div>;

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
          
          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="progress" element={<Progress />} />
            <Route path="workouts" element={<Workouts />} />
            <Route path="nutrition" element={<Nutrition />} />
            <Route path="goals" element={<Goals />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
