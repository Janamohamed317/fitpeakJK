import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styles from './UserProfile.module.css';
import { imgs } from '../../assets/assets';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
  const [age, setAge] = useState(0);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [bmi, setBmi] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const username = useSelector((state) => state.app.username);
  const email = useSelector((state) => state.app.email);
  const userID = useSelector((state) => state.app.userId);
  // console.log(userID);
  

    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/profile/${userID}`);
          // console.log(res);
          const { age, height, weight } = res.data.data;
          setAge(age);    
          setHeight(height);
          setWeight(weight);
        } catch (err) {
          if (err.response && err.response.status !== 404) {
            console.error('Failed to load profile:', err);
          }
        }
      };

      if (userID) {
        fetchProfile();
      }
    }, [userID]);

  useEffect(() => {
    if (height && weight) {
      const heightInMeters = height / 100;
      const calculatedBmi = weight / (heightInMeters * heightInMeters);
      setBmi(calculatedBmi.toFixed(1));
    }
  }, [height, weight]);

  const handleSave = async () => {
    setError('');
    setSuccess('');

    if (age <= 0 || age > 120) {
      setError('Please enter a valid age (1–120).');
      return;
    }
    if (height <= 0 || height > 300) {
      setError('Please enter a valid height in cm (1–300).');
      return;
    }
    if (weight <= 0 || weight > 500) {
      setError('Please enter a valid weight in kg (1–500).');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/profile/save', {
        userID,
        age,
        height,
        weight,
      });

   
    } catch (err) {
      if (err.response && err.response.data?.error) {
        const message = Array.isArray(err.response.data.error)
          ? err.response.data.error.join(' ')
          : err.response.data.error;
        setError(message);
      } else {
        setError('Network error: Could not reach server.');
      }
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.profileContainer}>
        <div className={styles.topbar}>
          <h2>My Fitness Profile</h2>
        </div>

        <div className={styles.profileGrid}>
          <div className={styles.profileSidebar}>
            <img src={imgs.UserImg} alt="User" className={styles.profileImg} />
            <h4 className={styles.username}>{username}</h4>
            <div className={styles.buttonContainer}>
              <button className={styles.deleteBtn}>Delete Account</button>
            </div>
          </div>

          <div className={styles.profileContent}>
            <h3 className={styles.sectionTitle}>About</h3>
            <div className={styles.infoRow}>
              <label>Full Name:</label>
              <span>{username}</span>
            </div>
            <div className={styles.infoRow}>
              <label>Email:</label>
              <span>{email}</span>
            </div>

            <h3 className={`${styles.sectionTitle} ${styles.mt}`}>Fitness Info</h3>
            <div className={styles.infoRow}>
              <label>Age:</label>
              <input
                type="number"
                value={age}
                className={styles.profileInput}
                onChange={(e) => setAge(Number(e.target.value))}
              />
            </div>
            <div className={styles.infoRow}>
              <label>Height (cm):</label>
              <input
                type="number"
                value={height}
                className={styles.profileInput}
                onChange={(e) => setHeight(Number(e.target.value))}
              />
            </div>
            <div className={styles.infoRow}>
              <label>Weight (kg):</label>
              <input
                type="number"
                value={weight}
                className={styles.profileInput}
                onChange={(e) => setWeight(Number(e.target.value))}
              />
            </div>
            <div className={styles.infoRow}>
              <label>BMI:</label>
              <span>{bmi}</span>
            </div>

            {error && <p className={styles.errorMsg}>{error}</p>}
            {success && <p className={styles.successMsg}>{success}</p>}

            <button className={styles.saveBtn} onClick={handleSave}>
              Save Profile
            </button>

            <button
              className={styles.HistoryBtn}
              onClick={() => navigate('/History')}
            >
              User History
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
