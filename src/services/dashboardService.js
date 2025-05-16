import axios from 'axios';

const API_URL = 'http://localhost:5000/api/workouts';

const getUserId = () => {
  const userId = localStorage.getItem('ID');
  if (!userId) {
    console.error('No userId found in localStorage! User might not be logged in.');
  }
  return userId;
};

export const getDashboardStats = async () => {
  try {
    const userId = getUserId();
    if (!userId) {
      throw new Error('User not logged in');
    }
    
    const response = await axios.get(`${API_URL}/dashboard/stats/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    throw error;
  }
};
