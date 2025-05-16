import { useEffect } from 'react';
import './App.css';
import Home from './components/Home/Home';
import { Route, Routes } from 'react-router';
import Signin from './components/Signin/Signin';
import Signup from './components/Signup/Signup';
import UserProfile from './components/UserProfile/UserProfile';
import FitnessGoals from './components/FitnessGoals/FitnessGoals';
import History from './components/History/History';
import FitnessTips from './components/FitnessTips/FitnessTips';
import WorkoutApp from './components/Workout/WorkoutApp';
import Dashboard from './components/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoutes/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Fitness-goals"
        element={
          <ProtectedRoute>
            <FitnessGoals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/History"
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tips"
        element={
          <ProtectedRoute>
            <FitnessTips />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workout"
        element={
          <ProtectedRoute>
            <WorkoutApp />
          </ProtectedRoute>
        }
      />
      <Route
        path="/progress"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>

  );
}

export default App;
