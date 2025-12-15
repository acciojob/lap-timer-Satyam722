import React, { useState, useEffect, useRef } from "react";

function App() {
  const [time, setTime] = useState(0); // time in centiseconds
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);

  // Convert time → mm:ss:cs
  const formatTime = (cs) => {
    const minutes = Math.floor(cs / 6000);
    const seconds = Math.floor((cs % 6000) / 100);
    const centi = cs % 100;

    return `${pad(minutes)}:${pad(seconds)}:${pad(centi)}`;
  };

  const pad = (num) => (num < 10 ? "0" + num : num);

  // Start Timer
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 10); // 10ms → 1 centisecond
    }
  };

  // Stop Timer
  const stopTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  // Record Lap
  const recordLap = () => {
    if (isRunning) {
      setLaps((prev) => [...prev, formatTime(time)]);
    }
  };

  // Reset Timer
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  // Cleanup on unmount → prevents memory leaks
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "40px", fontFamily: "Arial" }}>
      <h1>Lap Timer</h1>

      {/* Timer Display */}
      <h2 style={{ fontSize: "48px", marginBottom: "20px" }}>
        {formatTime(time)}
      </h2>

      {/* Control Buttons */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={startTimer} disabled={isRunning}>
          Start
        </button>
        <button onClick={stopTimer} disabled={!isRunning}>
          Stop
        </button>
        <button onClick={recordLap} disabled={!isRunning}>
          Lap
        </button>
        <button onClick={resetTimer}>Reset</button>
      </div>

      {/* Laps List */}
      <h3>Laps:</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {laps.map((lap, index) => (
          <li key={index} style={{ fontSize: "20px", margin: "5px" }}>
            Lap {index + 1}: {lap}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
