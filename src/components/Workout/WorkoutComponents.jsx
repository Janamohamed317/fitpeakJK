// Example implementation, adjust as needed
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { Bar, Line, Pie } from 'react-chartjs-2';
import styles from './workout.module.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// ===== CHART SECTION COMPONENT =====
export const ChartSection = ({ workouts, onChartPeriodChange, chartPeriod }) => {
  const [chartType, setChartType] = useState('bar');
  const [isHovered, setIsHovered] = useState(false);
  
  // Generate colors for pie chart
  const generateColors = (count) => {
    const baseColors = [
      'rgba(52, 152, 219, 0.6)', // Blue
      'rgba(46, 204, 113, 0.6)', // Green
      'rgba(155, 89, 182, 0.6)', // Purple
      'rgba(231, 76, 60, 0.6)',  // Red
      'rgba(241, 196, 15, 0.6)'  // Yellow
    ];
    
    return Array(count).fill().map((_, i) => baseColors[i % baseColors.length]);
  };

  // Prepare chart data
  // تسجيل قيم السعرات الحرارية للتحقق
  console.log('Chart calories values:', workouts.map(w => ({ name: w.name, calories: w.calories })));
  
  const chartData = {
    labels: workouts.map(workout => workout.name),
    datasets: [
      {
        label: 'Calories Burned',
        data: workouts.map(workout => parseFloat(workout.calories) || 0),
        backgroundColor: chartType === 'pie' 
          ? generateColors(workouts.length) 
          : 'rgba(52, 152, 219, 0.6)',
        borderColor: chartType === 'pie'
          ? generateColors(workouts.length).map(color => color.replace('0.6', '1'))
          : 'rgba(52, 152, 219, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.parsed.y || context.parsed} calories`;
          }
        }
      }
    },
    scales: chartType !== 'pie' ? {
      x: {
        title: {
          display: true,
          text: 'Workout'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Calories Burned'
        }
      }
    } : undefined
  };

  // Render appropriate chart based on type
  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <Line data={chartData} options={chartOptions} />;
      case 'pie':
        return <Pie data={chartData} options={chartOptions} />;
      default:
        return <Bar data={chartData} options={chartOptions} />;
    }
  };

  return (
    <motion.section 
      className={`section ${styles.chartSection}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <FontAwesomeIcon 
          icon="chart-bar" 
          className={styles.sectionIcon}
        /> 
        Calories Burned Chart
      </motion.h2>
      
      <motion.div 
        className={styles.chartControls}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className={styles.chartControlItem}>
          <label htmlFor="chart-type">Chart Type:</label>
          <select
            id="chart-type"
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className={styles.chartSelect}
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>
        
        <div className={styles.chartControlItem}>
          <label htmlFor="chart-period">Time Period:</label>
          <select
            id="chart-period"
            value={chartPeriod}
            onChange={onChartPeriodChange}
            className={styles.chartSelect}
          >
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </motion.div>
      
      <motion.div 
        className={styles.chartContainer}
        whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {workouts.length === 0 ? (
          <motion.div 
            className={styles.emptyMessage}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
          >
            <FontAwesomeIcon icon="chart-line" className={styles.emptyChartIcon} />
            <p>No workout data to display. Add workouts to see your chart.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={styles.chartWrapper}
          >
            {renderChart()}
            <div className={`${styles.chartOverlay} ${isHovered ? styles.visible : ''}`}>
              <div className={styles.chartInfo}>
                <span className={styles.chartInfoTitle}>{chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart</span>
                <span className={styles.chartInfoDesc}>Showing calories burned for {chartPeriod === 'all' ? 'all time' : chartPeriod === 'week' ? 'this week' : 'this month'}</span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.section>
  );
};

// ===== STATS SECTION COMPONENT =====
export const StatsSection = ({ totalWorkouts, totalCalories, bestWorkout, workoutStreak }) => {
  return (
    <motion.section 
      className={`section ${styles.statsSection}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, staggerChildren: 0.2 }}
    >
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <FontAwesomeIcon icon="trophy" className={styles.sectionIcon} /> 
        Your Fitness Stats
      </motion.h2>
      
      <div className={styles.statsGrid}>
        <motion.div 
          className={styles.statCard}
          whileHover={{ y: -10, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)' }}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.1 }}
        >
          <motion.div 
            className={`${styles.statIcon} ${styles.workouts}`}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.2, rotate: 5 }}
          >
            <FontAwesomeIcon icon="dumbbell" />
          </motion.div>
          <div className={styles.statInfo}>
            <h3>Total Workouts</h3>
            <p className={styles.statValue}>{totalWorkouts}</p>
          </div>
        </motion.div>
        
        <motion.div 
          className={styles.statCard}
          whileHover={{ y: -10, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)' }}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2 }}
        >
          <motion.div 
            className={`${styles.statIcon} ${styles.calories}`}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.2, rotate: 5 }}
          >
            <FontAwesomeIcon icon="fire" />
          </motion.div>
          <div className={styles.statInfo}>
            <h3>Calories Burned</h3>
            <p className={styles.statValue}>{totalCalories}</p>
          </div>
        </motion.div>
        
        <motion.div 
          className={styles.statCard}
          whileHover={{ y: -10, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)' }}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.3 }}
        >
          <motion.div 
            className={`${styles.statIcon} ${styles.best}`}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.2, rotate: 5 }}
          >
            <FontAwesomeIcon icon="medal" />
          </motion.div>
          <div className={styles.statInfo}>
            <h3>Best Workout</h3>
            <p className={styles.statValue}>{bestWorkout ? bestWorkout.name : 'None'}</p>
            {bestWorkout && (
              <p className={styles.statSubtext}>{bestWorkout.calories} calories</p>
            )}
          </div>
        </motion.div>
        
        <motion.div 
          className={styles.statCard}
          whileHover={{ y: -10, boxShadow: '0 15px 30px rgba(0, 0, 0, 0.1)' }}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.4 }}
        >
          <motion.div 
            className={`${styles.statIcon} ${styles.streak}`}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.2, rotate: 5 }}
          >
            <FontAwesomeIcon icon="calendar-check" />
          </motion.div>
          <div className={styles.statInfo}>
            <h3>Workout Streak</h3>
            <p className={styles.statValue}>{workoutStreak} days</p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

// ===== WORKOUT FORM COMPONENT =====
export const WorkoutForm = ({ onAddWorkout }) => {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name || !duration || !calories || !date) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Create new workout
    const newWorkout = {
      id: Date.now(),
      name,
      duration: parseInt(duration),
      calories: parseInt(calories),
      date,
      completed: true, // Mark workout as completed by default
      category: name.toLowerCase().includes('run') ? 'cardio' : 
               name.toLowerCase().includes('cycling') ? 'cardio' : 
               name.toLowerCase().includes('gym') ? 'strength' : 'other'
    };
    
    // Simulate API call
    setTimeout(() => {
      onAddWorkout(newWorkout);
      
      // Reset form
      setName('');
      setDuration('');
      setCalories('');
      setDate(new Date().toISOString().substr(0, 10));
      setIsSubmitting(false);
    }, 600);
  };
  
  return (
    <motion.section 
      className={`section ${styles.formSection}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <FontAwesomeIcon icon="plus-circle" className={styles.sectionIcon} /> 
        Add New Workout
      </motion.h2>
      
      <motion.form 
        className={styles.workoutForm}
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="workout-name">
              <FontAwesomeIcon icon="tag" className={styles.inputIcon} /> 
              Workout Name
            </label>
            <input
              type="text"
              id="workout-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Running, Cycling, Yoga"
              required
              className={styles.formInput}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="workout-date">
              <FontAwesomeIcon icon="calendar" className={styles.inputIcon} /> 
              Date
            </label>
            <input
              type="date"
              id="workout-date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className={styles.formInput}
            />
          </div>
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="workout-duration">
              <FontAwesomeIcon icon="clock" className={styles.inputIcon} /> 
              Duration (minutes)
            </label>
            <input
              type="number"
              id="workout-duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="30"
              min="1"
              required
              className={styles.formInput}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="workout-calories">
              <FontAwesomeIcon icon="fire" className={styles.inputIcon} /> 
              Calories Burned
            </label>
            <input
              type="number"
              id="workout-calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="250"
              min="1"
              required
              className={styles.formInput}
            />
          </div>
        </div>
        
        <motion.button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <>
              <FontAwesomeIcon icon="spinner" spin /> 
              Saving...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon="plus" /> 
              Add Workout
            </>
          )}
        </motion.button>
      </motion.form>
    </motion.section>
  );
};

// ===== WORKOUT LIST COMPONENT =====
export const WorkoutList = ({ workouts, onDeleteWorkout, onCompleteWorkout }) => {
  const [expandedId, setExpandedId] = useState(null);
  
  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };
  
  // Animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.section 
      className={`section ${styles.workoutListSection}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <FontAwesomeIcon icon="list" className={styles.sectionIcon} /> 
        Your Workouts
      </motion.h2>
      
      {workouts.length === 0 ? (
        <motion.div 
          className={styles.emptyListMessage}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
        >
          <FontAwesomeIcon icon="dumbbell" className={styles.emptyIcon} />
          <p>No workouts added yet. Start by adding your first workout!</p>
        </motion.div>
      ) : (
        <motion.ul 
          className={styles.workoutList}
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {workouts.map((workout) => (
            <motion.li 
              key={workout.id}
              className={`${styles.workoutItem} ${workout.name.toLowerCase().includes('run') ? styles.run : ''} ${expandedId === workout.id ? styles.expanded : ''}`}
              variants={itemVariants}
              whileHover={{ scale: 1.01, boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)' }}
            >
              <div 
                className={styles.workoutHeader}
                onClick={() => toggleExpand(workout.id)}
              >
                <div className={styles.workoutMain}>
                  <h3 className={styles.workoutName}>
                    <FontAwesomeIcon 
                      icon={
                        workout.name.toLowerCase().includes('run') ? 'running' :
                        workout.name.toLowerCase().includes('cycl') ? 'biking' :
                        workout.name.toLowerCase().includes('swim') ? 'swimmer' :
                        workout.name.toLowerCase().includes('weight') ? 'dumbbell' :
                        workout.name.toLowerCase().includes('yoga') ? 'pray' :
                        'dumbbell'
                      } 
                      className={styles.workoutIcon}
                    /> 
                    {workout.name}
                  </h3>
                  <span className={styles.workoutDate}>
                    <FontAwesomeIcon icon="calendar-day" /> 
                    {new Date(workout.date).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.workoutMeta}>
                  <span className={styles.workoutDuration}>
                    <FontAwesomeIcon icon="clock" /> 
                    {workout.duration} min
                  </span>
                  <span className={styles.workoutCalories}>
                    <FontAwesomeIcon icon="fire" /> 
                    {workout.calories} cal
                  </span>
                  <span className={`${styles.workoutStatus} ${workout.completed ? styles.completed : ''}`}>
                    <FontAwesomeIcon icon={workout.completed ? "check-circle" : "circle"} /> 
                    {workout.completed ? 'Completed' : 'Not Completed'}
                  </span>
                </div>
                <FontAwesomeIcon 
                    icon={expandedId === workout.id ? 'chevron-up' : 'chevron-down'} 
                    className={styles.expandIcon}
                  />
              </div>
              
              <motion.div 
                className={styles.workoutDetails}
                initial={{ height: 0, opacity: 0 }}
                animate={{ 
                  height: expandedId === workout.id ? 'auto' : 0,
                  opacity: expandedId === workout.id ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Workout Type</span>
                    <span className={styles.detailValue}>{workout.name}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Date</span>
                    <span className={styles.detailValue}>{new Date(workout.date).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Duration</span>
                    <span className={styles.detailValue}>{workout.duration} minutes</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Calories Burned</span>
                    <span className={styles.detailValue}>{workout.calories} calories</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Calories/Minute</span>
                    <span className={styles.detailValue}>
                      {(workout.calories / workout.duration).toFixed(1)} cal/min
                    </span>
                  </div>
                </div>
                
                <div className={styles.buttonGroup}>
                  {!workout.completed && (
                    <motion.button
                      className={styles.completeButton}
                      onClick={() => onCompleteWorkout && onCompleteWorkout(workout.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FontAwesomeIcon icon="check-circle" /> Mark as Completed
                    </motion.button>
                  )}
                  <motion.button
                    className={styles.deleteButton}
                    onClick={() => onDeleteWorkout(workout.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FontAwesomeIcon icon="trash-alt" /> Delete Workout
                  </motion.button>
                </div>
              </motion.div>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </motion.section>
  );
};
