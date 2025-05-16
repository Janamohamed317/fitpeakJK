import React, { useState, useEffect } from 'react';
import styles from './FitnessTips.module.css';
import { tips } from '../../assets/assets';
import Footer from '../Footer/Footer';
import Navbar from '../Navbar/Navbar';


const FitnessTips = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const [touchingLeft, setTouchingLeft] = useState(false);
  const [touchingRight, setTouchingRight] = useState(false);
  const [touchStartX, setTouchStartX] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (deltaX > 50) prevTip();
    else if (deltaX < -50) nextTip();
    setTouchStartX(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') prevTip();
      if (e.key === 'ArrowRight') nextTip();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Navbar />

      <div className={styles.container}>
        <div className={styles.logo} title="Sport Logo">🏅</div>
        <h2 className={styles.title}>💡 Fitness Tips</h2>
        <div
          className={styles.carousel}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            className={`${styles.arrowButton} ${touchingLeft ? styles.touching : ''}`}
            onClick={prevTip}
            aria-label="Previous tip"
            onTouchStart={() => setTouchingLeft(true)}
            onTouchEnd={() => { setTouchingLeft(false); prevTip(); }}
            onTouchCancel={() => setTouchingLeft(false)}
          >
            &#8249;
          </button>
          <div className={styles.tipCard}>
            <h4 className={styles.tipTitle}>{tips[currentTip].icon} {tips[currentTip].title}</h4>
            <p className={styles.tipDesc}>{tips[currentTip].description}</p>
          </div>
          <button
            className={`${styles.arrowButton} ${touchingRight ? styles.touching : ''}`}
            onClick={nextTip}
            aria-label="Next tip"
            onTouchStart={() => setTouchingRight(true)}
            onTouchEnd={() => { setTouchingRight(false); nextTip(); }}
            onTouchCancel={() => setTouchingRight(false)}
          >
            &#8250;
          </button>
        </div>

        <div className={styles.dots}>
          {tips.map((_, idx) => (
            <span
              key={idx}
              className={idx === currentTip ? styles.activeDot : styles.dot}
              onClick={() => setCurrentTip(idx)}
              aria-label={`Go to tip ${idx + 1}`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setCurrentTip(idx);
              }}
            />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FitnessTips;

