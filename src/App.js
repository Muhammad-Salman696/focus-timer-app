import React, { useState, useEffect } from 'react';
import './App.css';

const Timer = () => {
  // State variables
  const [seconds, setSeconds] = useState(0);  // To track the timer
  const [isActive, setIsActive] = useState(false);  // To check if the timer is active
  const [isPaused, setIsPaused] = useState(false);  // To check if the timer is paused

  useEffect(() => {
    let interval;
    if (isActive && !isPaused) {
      // Start the timer if it's active and not paused
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000); // Update every second
    } else if (!isActive) {
      // Stop the timer when it's not active
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused]);

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setSeconds(0);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="timer">
      <h2>Focus Timer</h2>
      <div className="timer-display">{formatTime(seconds)}</div>
      <div className="timer-controls">
        {!isActive && !isPaused ? (
          <button onClick={startTimer}>Start</button>
        ) : isPaused ? (
          <button onClick={startTimer}>Resume</button>
        ) : (
          <button onClick={pauseTimer}>Pause</button>
        )}
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="App">
      <Timer />
    </div>
  );
};

export default App;
