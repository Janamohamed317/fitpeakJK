import axios from 'axios';

const API_URL = 'http://localhost:5000/api/workouts';

const getUserId = () => {
  const userId = localStorage.getItem('ID');
  if (!userId) {
    console.error('No userId found in localStorage! User might not be logged in.');
  }
  return userId;
};

export const createWorkout = async (workoutData) => {
  try {
    const userId = getUserId();
    const response = await axios.post(API_URL, {
      ...workoutData,
      userId
    });
    return response.data;
  } catch (error) {
    console.error('Error creating workout:', error);
    throw error;
  }
};

export const getUserWorkouts = async () => {
  try {
    const userId = getUserId();
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching workouts:', error);
    throw error;
  }
};

export const getWorkoutById = async (workoutId) => {
  try {
    const response = await axios.get(`${API_URL}/${workoutId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching workout:', error);
    throw error;
  }
};

export const deleteWorkout = async (workoutId) => {
  try {
    const response = await axios.delete(`${API_URL}/${workoutId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting workout:', error);
    throw error;
  }
};

export const completeWorkout = async (workoutId) => {
  try {
    const userId = getUserId();
    const response = await axios.patch(`${API_URL}/${workoutId}/complete`, { userId });
    return response.data;
  } catch (error) {
    console.error('Error completing workout:', error);
    throw error;
  }
};

export const getWorkoutsByCategory = async (category) => {
  try {
    const userId = getUserId();
    const response = await axios.get(`${API_URL}/category/${category}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching workouts by category:', error);
    throw error;
  }
};
