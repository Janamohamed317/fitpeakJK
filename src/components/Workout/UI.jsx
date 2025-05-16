import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import styles from './styles.module.css';

// Header Component
export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  
  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <motion.div 
        className={styles.logo}
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
      >
        <FontAwesomeIcon icon="heartbeat" className={styles.pulseIcon} />
      </motion.div>
      
      <motion.h1
        className={styles.title}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        Fitness Tracker Pro
      </motion.h1>
      
      <motion.p
        className={styles.subtitle}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Track your workouts and monitor your progress with our professional fitness app
      </motion.p>
      
      <motion.div 
        className={styles.decoration}
        initial={{ width: 0 }}
        animate={{ width: '150px' }}
        transition={{ duration: 0.8, delay: 0.7 }}
      />
    </header>
  );
};



// Notification Component
export const Notification = ({ message, type }) => {
  const [visible, setVisible] = useState(true);

  // Reset visibility every time message changes
  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [message]);
  
  // Get icon based on notification type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'exclamation-circle';
      case 'warning':
        return 'exclamation-triangle';
      default:
        return 'info-circle';
    }
  };

  return (
    <div className={`notification-container`} style={{position:'fixed',top:20,right:20,zIndex:2000,width:'100%',display:'flex',justifyContent:'center',pointerEvents:'none'}}>
      <div className={`${styles.notification} ${styles[type]} ${visible ? styles.visible : styles.hidden}`} style={{pointerEvents:'auto'}}>
        <div className={styles.notificationContent}>
          <FontAwesomeIcon icon={getIcon()} className={styles.notificationIcon} />
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
};
