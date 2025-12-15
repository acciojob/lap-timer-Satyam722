import React, { useState, useRef, useEffect } from 'react';

// --- Utility Functions for Time Formatting ---

// Pads a number with a leading zero if it's less than 10 (e.g., 5 -> 05)
const pad = (num) => (num < 10 ? '0' + num : num);

// Formats centiseconds into minutes, seconds, and centiseconds string
const formatTime = (centiseconds) => {
  const mins = Math.floor(centiseconds / 6000);
  const secs = Math.floor((centiseconds % 6000) / 100);
  const csecs = centiseconds % 100;
  
  return `${pad(mins)}:${pad(secs)}:${pad(csecs)}`;
};


// --- App Component (Lap Timer Logic) ---

function App() {
  // State for the main timer (tracked in centiseconds: 1/100th of a second)
  const [time, setTime] = useState(0);
  
  // State to track if the timer is running
  const [isRunning, setIsRunning] = useState(false);
  
  // State for recording and displaying lap times
  const [laps, setLaps] = useState([]);

  // useRef for the interval ID: mutable reference that doesn't trigger a re-render
  const intervalRef = useRef(null);

  // --- Timer Control Handlers ---

  const handleStart = () => {
    if (isRunning) return; // Prevent starting if already running

    setIsRunning(true);
    
    // Set up the interval and store its ID in the ref
    intervalRef.current = setInterval(() => {
      // Use the functional form of setTime to get the latest value
      setTime(prevTime => prevTime + 1); // Increment by 1 centisecond
    }, 10); // Run every 10 milliseconds (1 centisecond)
  };

  const handleStop = () => {
    if (!isRunning) return; // Prevent stopping if already stopped

    // Clear the interval using the stored ID
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
  };

  const handleReset = () => {
    handleStop(); // Ensure the timer is stopped
    setTime(0);   // Reset main timer
    setLaps([]);  // Reset laps list
  };
  
  const handleLap = () => {
    if (!isRunning) return; // Only record lap if running

    // Add the current time to the beginning of the laps array
    setLaps(prevLaps => [time, ...prevLaps]); 
  };
  
  // --- useEffect for Cleanup ---

  useEffect(() => {
    // Cleanup function: runs when the component unmounts or before re-running the effect
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // Empty dependency array ensures this runs only on mount/unmount

  // --- Render ---

  return (
    <div className="lap-timer-app" style={{ textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>Lap Timer</h1>

      {/* Timer Display */}
      <div className="timer-display" style={{ fontSize: '3em', margin: '20px 0' }}>
        {formatTime(time)}
      </div>

      {/* Control Buttons */}
      <div className="controls" style={{ marginBottom: '20px' }}>
        
        {/* Reset button (always visible) */}
        <button onClick={handleReset} disabled={isRunning && time > 0} style={{ padding: '10px', margin: '5px' }}>
          Reset
        </button>

        {/* Start / Stop button (Conditional Rendering) */}
        {isRunning ? (
          <button onClick={handleStop} style={{ padding: '10px', margin: '5px', backgroundColor: 'red', color: 'white' }}>
            Stop
          </button>
        ) : (
          <button onClick={handleStart} style={{ padding: '10px', margin: '5px', backgroundColor: 'green', color: 'white' }}>
            Start
          </button>
        )}
        
        {/* Lap button (only enabled when running) */}
        <button onClick={handleLap} disabled={!isRunning} style={{ padding: '10px', margin: '5px' }}>
          Lap
        </button>
      </div>

      {/* Laps List */}
      {laps.length > 0 && (
        <div className="laps-list" style={{ maxWidth: '300px', margin: '0 auto' }}>
          <h2>Laps</h2>
          <ol style={{ listStyleType: 'decimal-leading-zero', textAlign: 'left', paddingLeft: '40px' }}>
            {/* Map over the recorded lap times */}
            {laps.map((lapTime, index) => (
              <li key={index} style={{ marginBottom: '5px', fontSize: '1.2em' }}>
                Lap {laps.length - index}: {formatTime(lapTime)}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default App;
