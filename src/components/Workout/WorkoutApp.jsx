import React, { useState, useEffect, useCallback } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faHeartbeat, faPlusCircle, faList, faChartBar,
  faChartLine, faDumbbell, faFire, faBolt,
  faCalendarCheck, faSave, faTrash, faMedal,
  faTag, faClock, faCalendar, faCalendarDay,
  faChevronUp, faChevronDown, faTrashAlt,
  faInfoCircle, faCheckCircle, faExclamationCircle,
  faExclamationTriangle, faRunning, faBiking, faSwimmer, faPray
} from '@fortawesome/free-solid-svg-icons';
import styles from './workout.module.css';
import { Header, Notification } from './UI.jsx';
import { ChartSection, StatsSection, WorkoutForm, WorkoutList } from './WorkoutComponents.jsx';
import Footer from '../Footer/Footer.jsx';
import Navbar from '../Navbar/Navbar.jsx';
import { getUserWorkouts, createWorkout, deleteWorkout, completeWorkout } from '../../services/workoutService';
import './workoutButtons.css';

library.add(
  faHeartbeat, faPlusCircle, faList, faChartBar,
  faChartLine, faDumbbell, faFire, faBolt,
  faCalendarCheck, faSave, faTrash, faMedal,
  faTag, faClock, faCalendar, faCalendarDay,
  faChevronUp, faChevronDown, faTrashAlt,
  faInfoCircle, faCheckCircle, faExclamationCircle,
  faExclamationTriangle, faRunning, faBiking, faSwimmer, faPray
);

function WorkoutApp() {
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [chartPeriod, setChartPeriod] = useState('all');

  const filterWorkouts = useCallback((search, sort, period) => {
    let filtered = [...workouts];

    if (search) {
      filtered = filtered.filter(workout =>
        workout.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (period !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      filtered = filtered.filter(workout => {
        const workoutDate = new Date(workout.date);
        if (period === 'week') {
          return workoutDate >= startOfWeek;
        } else if (period === 'month') {
          return workoutDate >= startOfMonth;
        }
        return true;
      });
    }

    switch (sort) {
      case 'newest':
        filtered.sort((a, b) => b.timestamp - a.timestamp);
        break;
      case 'oldest':
        filtered.sort((a, b) => a.timestamp - b.timestamp);
        break;
      case 'calories-high':
        filtered.sort((a, b) => b.calories - a.calories);
        break;
      case 'calories-low':
        filtered.sort((a, b) => a.calories - b.calories);
        break;
      default:
        break;
    }

    setFilteredWorkouts(filtered);
  }, [workouts]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await getUserWorkouts();
        if (data && data.length > 0) {
          const formattedWorkouts = data.map(workout => {
            return {
              id: workout.workoutId,
              name: workout.title,
              duration: workout.duration || 0,
              calories: parseFloat(workout.calories) || 100,
              date: workout.date,
              timestamp: new Date(workout.date).getTime(),
              completed: workout.completed,
              category: workout.category,
              exercises: workout.exercises,
              description: workout.description
            };
          });
          setWorkouts(formattedWorkouts);
          setFilteredWorkouts(formattedWorkouts);
        } else {
          console.log('No workouts found for this user');
          setWorkouts([]);
          setFilteredWorkouts([]);
        }
      } catch (error) {
        console.error('Error fetching workouts:', error);
        showNotification('Failed to fetch workouts', 'error');
      }
    };
    fetchWorkouts();
  }, []);

  useEffect(() => {
    filterWorkouts(searchTerm, sortOption, chartPeriod);
  }, [workouts, searchTerm, sortOption, chartPeriod, filterWorkouts]);

  const handleAddWorkout = async (workout) => {
    try {
      const apiWorkout = {
        userId: localStorage.getItem('userId') || 'user123',
        title: workout.name,
        description: workout.description || `Description for: ${workout.name}`,
        duration: workout.duration,
        date: workout.date,
        completed: false,
        calories: workout.calories,
        category: workout.category || 'other',
        exercises: [
          {
            name: workout.name,
            sets: 3,
            reps: 10,
            weight: 0
          }
        ]
      };

      const response = await createWorkout(apiWorkout);
      const newWorkout = {
        id: response.workoutId,
        name: response.title,
        calories: parseFloat(response.calories) || parseFloat(workout.calories) || 0,
        date: response.date,
        timestamp: new Date(response.date).getTime(),
        completed: response.completed,
        category: response.category,
        exercises: response.exercises,
        description: response.description
      };

      setWorkouts(prev => [newWorkout, ...prev]);
      setNotification({ message: 'Workout added!', type: 'success' });
    } catch (error) {
      console.error('Error adding workout:', error);
      if (error.response) {
        setNotification({ message: `Failed to add workout: ${error.response.data.message || error.message}`, type: 'error' });
      } else {
        setNotification({ message: 'Failed to add workout', type: 'error' });
      }
    }
  };

  const handleDeleteWorkout = async (id) => {
    try {
      await deleteWorkout(id);
      setWorkouts(prev => prev.filter(workout => workout.id !== id));
      setNotification({ message: 'Workout deleted!', type: 'success' });
    } catch (error) {
      console.error('Error deleting workout:', error);
      setNotification({ message: 'Failed to delete workout', type: 'error' });
    }
  };

  const handleCompleteWorkout = async (id) => {
    try {
      await completeWorkout(id);
      setWorkouts(prev => prev.map(workout =>
        workout.id === id ? { ...workout, completed: true } : workout
      ));

      setNotification({ message: 'Workout marked as completed!', type: 'success' });

      const refreshedWorkouts = await getUserWorkouts();
      if (refreshedWorkouts && refreshedWorkouts.length > 0) {
        const formattedWorkouts = refreshedWorkouts.map(workout => ({
          id: workout.workoutId,
          name: workout.title,
          duration: workout.duration || 0,
          calories: parseFloat(workout.calories) || 100,
          date: workout.date,
          timestamp: new Date(workout.date).getTime(),
          completed: workout.completed,
          category: workout.category,
          exercises: workout.exercises,
          description: workout.description
        }));
        setWorkouts(formattedWorkouts);
      }
    } catch (error) {
      console.error('Error completing workout:', error);
      setNotification({ message: 'Failed to mark workout as completed', type: 'error' });
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterWorkouts(value, sortOption, chartPeriod);
  };

  // const handleSortChange = (e) => {
  //   const value = e.target.value;
  //   setSortOption(value);
  //   filterWorkouts(searchTerm, value, chartPeriod);
  // };

  const handleChartPeriodChange = (e) => {
    const value = e.target.value;
    setChartPeriod(value);
    filterWorkouts(searchTerm, sortOption, value);
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });

    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const totalCalories = workouts.reduce((total, workout) => total + workout.calories, 0);

  const getBestWorkout = () => {
    if (workouts.length === 0) return '-';

    const bestWorkout = workouts.reduce((best, current) =>
      current.calories > best.calories ? current : best, workouts[0]);

    return `${bestWorkout.name} (${bestWorkout.calories} cal)`;
  };

  // const getWorkoutStreak = () => {
  //   if (workouts.length === 0) return '0 days';

  //   const sortedDates = workouts
  //     .map(workout => new Date(workout.date).toISOString().split('T')[0])
  //     .sort()
  //     .reverse();

  //   const uniqueDates = [...new Set(sortedDates)];
  //   let streak = 1;
  //   const today = new Date().toISOString().split('T')[0];
  //   const hasWorkoutToday = uniqueDates[0] === today;
  //   let currentDate = new Date();
  //   if (!hasWorkoutToday) {
  //     currentDate.setDate(currentDate.getDate() - 1);
  //   }

  //   for (let i = hasWorkoutToday ? 1 : 0; i < uniqueDates.length; i++) {
  //     currentDate.setDate(currentDate.getDate() - 1);
  //     const dateToCheck = currentDate.toISOString().split('T')[0];
  //     if (uniqueDates[i] === dateToCheck) {
  //       streak++;
  //     } else {
  //       break;
  //     }
  //   }

  //   return `${streak} day${streak !== 1 ? 's' : ''}`;
  // };

  return (
    <div className="app1">
      <Navbar />
      <div className="container1">
        <Header />
        <WorkoutForm onAddWorkout={handleAddWorkout} totalCalories={totalCalories} />
        <WorkoutList
          workouts={filteredWorkouts}
          onDeleteWorkout={handleDeleteWorkout}
          onCompleteWorkout={handleCompleteWorkout}
        />
        <ChartSection
          workouts={filteredWorkouts}
          onChartPeriodChange={handleChartPeriodChange}
          chartPeriod={chartPeriod}
        />
        {/* <StatsSection
          totalWorkouts={workouts.length}
          totalCalories={totalCalories}
          bestWorkout={getBestWorkout()}
          workoutStreak={getWorkoutStreak()}
        /> */}
      </div>
      <Footer />
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
        />
      )}
    </div>
  );
}

export default WorkoutApp;
