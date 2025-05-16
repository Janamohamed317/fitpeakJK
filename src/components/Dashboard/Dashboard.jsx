import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import Navbar from '../Navbar/Navbar';
import Footer from "../Footer/Footer";
import { getDashboardStats } from "../../services/dashboardService";
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faFire, faCalendarCheck, faTrophy, faChartLine } from '@fortawesome/free-solid-svg-icons';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const CaloriesChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const stats = await getDashboardStats();
        const caloriesData = stats.caloriesOverTime || [];

        // Sort dates
        caloriesData.sort((a, b) => new Date(a.date) - new Date(b.date));

        const data = {
          labels: caloriesData.map(item => {
            const d = new Date(item.date);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          }),
          datasets: [
            {
              label: 'Calories Burned',
              data: caloriesData.map(item => item.calories),
              fill: true,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              tension: 0.4
            }
          ]
        };

        setChartData(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching calories chart data:", error);
        setError("Error loading chart data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Calories Burned Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Calories'
        }
      }
    }
  };

  if (loading) return <div className="loading-chart">Loading chart...</div>;
  if (error) return <div className="error-chart">{error}</div>;
  if (!chartData || chartData.labels.length === 0) return <div className="no-data">No data to display</div>;

  return <Line data={chartData} options={options} />;
};

// Categories Chart Component
const CategoriesChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const stats = await getDashboardStats();
        const categoriesData = stats.categoriesDistribution || [];

        // Prepare colors for categories
        const categoryColors = {
          'strength': 'rgba(255, 99, 132, 0.8)',
          'cardio': 'rgba(54, 162, 235, 0.8)',
          'flexibility': 'rgba(255, 206, 86, 0.8)',
          'balance': 'rgba(75, 192, 192, 0.8)',
          'other': 'rgba(153, 102, 255, 0.8)'
        };

        const categoryLabels = {
          'strength': 'Strength Training',
          'cardio': 'Cardio',
          'flexibility': 'Flexibility',
          'balance': 'Balance',
          'other': 'Other'
        };

        const data = {
          labels: categoriesData.map(item => categoryLabels[item.category] || item.category),
          datasets: [
            {
              data: categoriesData.map(item => item.count),
              backgroundColor: categoriesData.map(item => categoryColors[item.category] || 'rgba(153, 102, 255, 0.8)'),
              borderWidth: 1
            }
          ]
        };

        setChartData(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching categories chart data:", error);
        setError("Error loading chart data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Workout Distribution by Type'
      }
    }
  };

  if (loading) return <div className="loading-chart">Loading chart...</div>;
  if (error) return <div className="error-chart">{error}</div>;
  if (!chartData || chartData.labels.length === 0) return <div className="no-data">No data to display</div>;

  return <Doughnut data={chartData} options={options} />;
};

const Dashboard = () => {
  const [workouts, setWorkouts] = useState([]);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);
  const [progress, setProgress] = useState("0%");
  const [timeFilter, setTimeFilter] = useState("week"); // "week", "month", "year"
  const [workoutStreak, setWorkoutStreak] = useState(0);
  const [bestWorkout, setBestWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);


        const stats = await getDashboardStats();

        // Update state with data from backend
        setTotalWorkouts(stats.totalWorkouts);
        setTotalCalories(stats.totalCalories);
        setProgress(stats.weeklyProgress.totalProgress);
        setWorkoutStreak(stats.streak);

        if (stats.bestWorkout) {
          setBestWorkout({
            title: stats.bestWorkout.title,
            calories: stats.bestWorkout.calories
          });
        }

        // Set workouts for charts
        if (stats.recentWorkouts && stats.recentWorkouts.length > 0) {
          const formattedWorkouts = stats.recentWorkouts.map(workout => ({
            id: workout.workoutId,
            title: workout.title,
            date: new Date(workout.date),
            calories: parseFloat(workout.calories) || 0,
            duration: workout.duration || 0,
            completed: workout.completed,
            category: workout.category
          }));

          setWorkouts(formattedWorkouts);
        } else {
          setWorkouts([]);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Error fetching dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate statistics based on workouts data
  const calculateStats = (workoutsData) => {
    // Calculate total workouts
    setTotalWorkouts(workoutsData.length);

    // Calculate total calories
    const calories = workoutsData.reduce((total, workout) => total + workout.calories, 0);
    setTotalCalories(calories);

    // Calculate progress
    const targetWorkoutsPerWeek = 5; // Target: 5 workouts per week
    const targetCaloriesPerWeek = 2500; // Target: 2500 calories per week

    // Filter workouts for the current week
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const thisWeekWorkouts = workoutsData.filter(workout => workout.date >= startOfWeek);
    const thisWeekWorkoutsCount = thisWeekWorkouts.length;
    const thisWeekCalories = thisWeekWorkouts.reduce((total, workout) => total + workout.calories, 0);

    const workoutProgress = Math.min((thisWeekWorkoutsCount / targetWorkoutsPerWeek) * 100, 100);
    const calorieProgress = Math.min((thisWeekCalories / targetCaloriesPerWeek) * 100, 100);
    const totalProgress = Math.min((workoutProgress + calorieProgress) / 2, 100);

    setProgress(totalProgress.toFixed(1) + "%");

    // Calculate workout streak
    calculateWorkoutStreak(workoutsData);

    // Find best workout (highest calories)
    if (workoutsData.length > 0) {
      const best = workoutsData.reduce((max, workout) =>
        workout.calories > max.calories ? workout : max, workoutsData[0]);
      setBestWorkout(best);
    }
  };

  // Calculate workout streak
  const calculateWorkoutStreak = (workoutsData) => {
    if (workoutsData.length === 0) {
      setWorkoutStreak(0);
      return;
    }

    // Sort workouts by date (newest first)
    const sortedWorkouts = [...workoutsData].sort((a, b) => b.date - a.date);

    // Get unique dates (to handle multiple workouts on same day)
    const uniqueDates = [];
    sortedWorkouts.forEach(workout => {
      const dateStr = workout.date.toISOString().split('T')[0];
      if (!uniqueDates.includes(dateStr)) {
        uniqueDates.push(dateStr);
      }
    });

    // Calculate streak
    let streak = 1;
    const today = new Date().toISOString().split('T')[0];

    // Check if there's a workout today
    const hasWorkoutToday = uniqueDates[0] === today;

    // If no workout today, start checking from yesterday
    let currentDate = new Date();
    if (!hasWorkoutToday) {
      currentDate.setDate(currentDate.getDate() - 1);
    }

    for (let i = hasWorkoutToday ? 1 : 0; i < uniqueDates.length; i++) {
      // Get previous date to check
      currentDate.setDate(currentDate.getDate() - 1);
      const dateToCheck = currentDate.toISOString().split('T')[0];

      // If date exists in our workout dates, increase streak
      if (uniqueDates[i] === dateToCheck) {
        streak++;
      } else {
        break; // Streak broken
      }
    }

    setWorkoutStreak(streak);
  };

  // Filter workouts based on time filter
  const getFilteredWorkouts = () => {
    const today = new Date();
    let startDate;

    switch (timeFilter) {
      case "week":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        break;
      case "month":
        startDate = new Date(today);
        startDate.setMonth(today.getMonth() - 1);
        break;
      case "year":
        startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1);
        break;
      default:
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
    }

    return workouts.filter(workout => workout.date >= startDate);
  };

  // Prepare data for calories chart using data from backend
  const prepareCaloriesChartData = async () => {
    try {
      const stats = await getDashboardStats();
      const caloriesData = stats.caloriesOverTime || [];

      // Sort dates
      caloriesData.sort((a, b) => new Date(a.date) - new Date(b.date));

      return {
        labels: caloriesData.map(item => {
          const d = new Date(item.date);
          return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        datasets: [
          {
            label: 'Calories Burned',
            data: caloriesData.map(item => item.calories),
            fill: true,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.4
          }
        ]
      };
    } catch (error) {
      console.error("Error preparing calories chart data:", error);
      return {
        labels: [],
        datasets: [{
          label: 'Calories Burned',
          data: [],
          fill: true,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.4
        }]
      };
    }
  };

  // Prepare data for workout categories chart using data from backend
  const prepareCategoriesChartData = async () => {
    try {
      const stats = await getDashboardStats();
      const categoriesData = stats.categoriesDistribution || [];

      // Prepare colors for categories
      const categoryColors = {
        'strength': 'rgba(255, 99, 132, 0.8)',
        'cardio': 'rgba(54, 162, 235, 0.8)',
        'flexibility': 'rgba(255, 206, 86, 0.8)',
        'balance': 'rgba(75, 192, 192, 0.8)',
        'other': 'rgba(153, 102, 255, 0.8)'
      };

      const categoryLabels = {
        'strength': 'Strength Training',
        'cardio': 'Cardio',
        'flexibility': 'Flexibility',
        'balance': 'Balance',
        'other': 'Other'
      };

      return {
        labels: categoriesData.map(item => categoryLabels[item.category] || item.category),
        datasets: [
          {
            data: categoriesData.map(item => item.count),
            backgroundColor: categoriesData.map(item => categoryColors[item.category] || 'rgba(153, 102, 255, 0.8)'),
            borderWidth: 1
          }
        ]
      };
    } catch (error) {
      console.error("Error preparing categories chart data:", error);
      return {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
          borderWidth: 1
        }]
      };
    }
  };

  // Chart options
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Calories Burned Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Calories'
        }
      }
    }
  };

  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Workout Distribution by Type'
      }
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard-container">
          <div className="loading">Loading data...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="dashboard-container">
          <div className="error">{error}</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h1 className="dashboard-title">
          <FontAwesomeIcon icon={faChartLine} /> Dashboard
        </h1>

        {/* Stats Cards */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faDumbbell} />
            </div>
            <div className="stat-content">
              <h3>Total Workouts</h3>
              <p className="stat-value">{totalWorkouts}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faFire} />
            </div>
            <div className="stat-content">
              <h3>Calories Burned</h3>
              <p className="stat-value">{totalCalories.toFixed(0)}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faCalendarCheck} />
            </div>
            <div className="stat-content">
              <h3>Workout Streak</h3>
              <p className="stat-value">{workoutStreak} days</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faTrophy} />
            </div>
            <div className="stat-content">
              <h3>Best Workout</h3>
              <p className="stat-value">
                {bestWorkout ? `${bestWorkout.title} (${bestWorkout.calories} cal)` : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <h2>Weekly Progress</h2>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: progress }}></div>
          </div>
          <p className="progress-text">{progress}</p>
        </div>

        {/* Time Filter */}
        <div className="filter-section">
          <h2>Data View</h2>
          <div className="filter-buttons">
            <button
              className={timeFilter === "week" ? "active" : ""}
              onClick={() => setTimeFilter("week")}
            >
              Last Week
            </button>
            <button
              className={timeFilter === "month" ? "active" : ""}
              onClick={() => setTimeFilter("month")}
            >
              Last Month
            </button>
            <button
              className={timeFilter === "year" ? "active" : ""}
              onClick={() => setTimeFilter("year")}
            >
              Last Year
            </button>
          </div>
        </div>

        {/* Charts */}
        <div className="charts-container">
          <div className="chart-card">
            <h2>Calories Burned</h2>
            <div className="chart">
              <CaloriesChart />
            </div>
          </div>

          <div className="chart-card">
            <h2>Workout Types</h2>
            <div className="chart">
              <CategoriesChart />
            </div>
          </div>
        </div>
      </div>
      <Footer />

    </>
  );
};

export default Dashboard;