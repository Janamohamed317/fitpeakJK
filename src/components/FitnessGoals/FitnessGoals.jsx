import { useState, useEffect } from 'react';
import styles from './FitnessGoals.module.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import axios from 'axios';
import { useSelector } from 'react-redux';

const FitnessGoals = () => {
  const [goals, setGoals] = useState([]);
  const [goalName, setGoalName] = useState('');
  const [progress, setProgress] = useState('');
  const [showGoals, setShowGoals] = useState(false);
  const [goalError, setGoalError] = useState('');

  const userId = useSelector((state) => state.app.userId);
  

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/goals/user/${userId}`);
        setGoals(response.data);
        // console.log('Fetched goals:', response.data);
      } catch (error) {
        console.error('Error fetching goals:', error);
      }
    };

    if (userId) {
      fetchGoals();
    }
  }, [userId]);

  const addGoal = async () => {
    if (goalName.trim().length < 3) {
      setGoalError('Goal name must be at least 3 characters long.');
      return;
    }

    if (progress === '') {
      setGoalError('Progress cannot be empty.');
      return;
    }

    setGoalError(''); 

    try {
      const res = await axios.post(`http://localhost:5000/api/goals/add`, {
        userId,
        goal: goalName,
        progress: Number(progress), 
      });

      const newGoal = res.data; 

      setGoals([...goals, newGoal]);
      setGoalName('');
      setProgress('');
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const toggleGoals = () => {
    setShowGoals(!showGoals);
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.title}>Set Your Fitness Goals</h2>

        <div className={styles.inputGroup}>
          <input
            type="text"
            className={styles.inputField}
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            placeholder="Goal (e.g., Run 5km)"
          />
          <input
            type="number"
            className={styles.inputField}
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            placeholder="Progress (%)"
            min="0"
            max="100"
          />
        </div>

        {goalError && <p className={styles.errorMessage}>{goalError}</p>} 

        <div className={styles.buttonGroup}>
          <button className={styles.actionButton} onClick={addGoal}>
            Add Goal
          </button>
          <button className={styles.actionButton} onClick={toggleGoals}>
            {showGoals ? 'Hide Goals' : 'View Your Goals'}
          </button>
        </div>

        {showGoals && (
          <div className={styles.goalContainer}>
            {goals.length === 0 ? (
              <p className={styles.emptyMessage}>No goals added yet</p>
            ) : (
              goals.map((goal) => (
                <div className={styles.goalCard} key={goal._id}>
                  <span className={styles.goalName}>{goal.goal}</span>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <span className={styles.progressText}>{goal.progress}%</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default FitnessGoals;
