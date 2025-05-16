import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/workouts';

const getUserId = () => {
  return localStorage.getItem('ID');
};

export const getUserWorkoutHistory = async () => {
  try {
    const userId = getUserId();
    if (!userId) {
      throw new Error('User not logged in');
    }
    
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching workout history:', error);
    throw error;
  }
};

export const getWorkoutStatistics = async () => {
  try {
    const userId = getUserId();
    if (!userId) {
      throw new Error('User not logged in');
    }
    
    const response = await axios.get(`${API_URL}/statistics/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching workout statistics:', error);
    throw error;
  }
};

export const exportWorkoutHistoryToCSV = (workouts) => {
  if (!workouts || workouts.length === 0) {
    return null;
  }
  
  const headers = ['Date', 'Workout Type', 'Duration (min)', 'Calories Burned'];
  
  const rows = workouts.map(workout => [
    workout.date,
    workout.category || workout.type,
    workout.duration,
    workout.calories
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  return url;
};
