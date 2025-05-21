import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const Timer = () => {
  // State variables
  const [inputMinutes, setInputMinutes] = useState(''); // For user input time
  const [seconds, setSeconds] = useState(0);  // To track the timer
  const [isActive, setIsActive] = useState(false);  // To check if the timer is active
  const [isPaused, setIsPaused] = useState(false);  // To check if the timer is paused
  const [breakMinutes, setBreakMinutes] = useState(''); // in minutes
  const [totalPeriods, setTotalPeriods] = useState('');
  const [currentPeriod, setCurrentPeriod] = useState(1);
  const [isBreak, setIsBreak] = useState(false); // To track whether it's break or work
  const [darkMode, setDarkMode] = useState(false); //For dark mode toggle


  const alarmRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isActive && !isPaused && seconds > 0) {
      // Start the timer if it's active and not paused
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000); // Update every second
    } 

    // For sound 
    if (seconds <= 10 && seconds > 0 && isActive && !isPaused) {
      // Play sound when seconds <= 15
      if (alarmRef.current && alarmRef.current.paused) {
        alarmRef.current.play();
      }
    }
    if (seconds === 0 && isActive) {
      setIsActive(false);
      setIsPaused(false);
      alert("⏰ Time's up!");
      if (alarmRef.current) {
        alarmRef.current.pause();
        alarmRef.current.currentTime = 0;
      }
      if (!isBreak) {
        // Work period complete - start break
        if (currentPeriod < totalPeriods) {
          alert("⏰ Work period complete! Time for a break.");
          setIsBreak(true);
          setSeconds(breakMinutes * 60);
          setIsActive(true);
        } else {
          // All periods complete
          alert("✅ All work periods complete! Great job!");
          resetTimer();
        }
      } else {
        // Break complete - start next work period
        alert("☕ Break complete! Back to work.");
        setIsBreak(false);
        setCurrentPeriod(prev => prev + 1);
        setSeconds(inputMinutes * 60);
        setIsActive(true);
      }
    }
    
    


    return () => clearInterval(interval);
  }, [isActive, isPaused, seconds, isBreak, currentPeriod, totalPeriods, inputMinutes, breakMinutes]);

    // Timer controls
  const startTimer = () => {
    if (seconds > 0) {
      setIsActive(true);
      setIsPaused(false);
    }
  };

  // Timer Pause
  const pauseTimer = () => {
    setIsPaused(true);
    if (alarmRef.current) {
      alarmRef.current.pause();
    }
  }


  //Timer reset
  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setIsBreak(false);
    setCurrentPeriod(1);
    setSeconds(0);
    setInputMinutes('');
    setBreakMinutes('');
    setTotalPeriods('');
    if (alarmRef.current) {
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
    }
  };

  // Convert seconds to mm:ss format
  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Dark mode
  const toggleDarkMode = () => {
  setDarkMode(prev => !prev);
  };

  return (
    <>
    <div className={`main-div ${darkMode ? 'dark' : ''}`}>
      <div className='shadow-div user-timer'>

        {/* Timer duration */}
        <div className="timer-input">
          <input className='input-basic'
            type="number"
            placeholder="Enter minutes"
            value={inputMinutes}
            onChange={(e) => setInputMinutes(e.target.value)}
          />
          <br />
          <input className='input-basic'
              type="number"
              value={breakMinutes}
              placeholder='Enter break duration minutes'
              onChange={(e) => setBreakMinutes(Number(e.target.value))}
            />
            <br />
            <input className='input-basic'
              type="number"
              value={totalPeriods}
              placeholder='Number of periods'
              onChange={(e) => setTotalPeriods(Number(e.target.value))}
            />
            <br />
          <button className='setTimerBtn' onClick={() => {
            const secs = parseInt(inputMinutes, 10) * 60;
              if (!isNaN(secs) && secs > 0) {
                setSeconds(secs);
                setIsActive(false);
                setIsPaused(false);
              }
            }}>
            Set Timer
          </button>
        </div>
      </div>
    

     <div className="shadow-div timer">
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
      <button onClick={toggleDarkMode} className="dark-toggle-btn">
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>



    {/* Audio element */}
    <audio ref={alarmRef} src="/sound.mp3" loop /> 
  </div>
    
    </>
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
