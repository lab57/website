import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import styles from '../styles/timer.module.css';

export default function ExamTimer() {
    // State for customizable elements
    const [title, setTitle] = useState('Exam Timer');
    const [showImage, setShowImage] = useState(true);
    const [imagePath, setImagePath] = useState('/L.png');
    const [uploadedImage, setUploadedImage] = useState(null);
    const [timerDuration, setTimerDuration] = useState(60); // in minutes
    const [backgroundColor, setBackgroundColor] = useState('var(--c1)'); // Default to website bg color
    const [autoStartTimer, setAutoStartTimer] = useState(true);
    const [adjustmentAmount, setAdjustmentAmount] = useState(5); // in minutes

    // Timer popup reference
    const timerWindowRef = useRef(null);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            if (timerWindowRef.current && !timerWindowRef.current.closed) {
                timerWindowRef.current.close();
            }
        };
    }, []);

    // Handle image upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setUploadedImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Get current image source
    const getCurrentImageSrc = () => {
        return uploadedImage || imagePath;
    };

    // Update timer settings in popup window
    const updateTimerSettings = () => {
        if (timerWindowRef.current && !timerWindowRef.current.closed) {
            timerWindowRef.current.document.title = title;

            const titleElement = timerWindowRef.current.document.querySelector('.title');
            if (titleElement) titleElement.textContent = title;

            // Update background color
            timerWindowRef.current.document.body.style.backgroundColor = backgroundColor;

            // Update image
            if (showImage) {
                let imgContainer = timerWindowRef.current.document.querySelector('.image-container');
                if (!imgContainer) {
                    imgContainer = timerWindowRef.current.document.createElement('div');
                    imgContainer.className = 'image-container';
                    timerWindowRef.current.document.body.appendChild(imgContainer);
                }
                imgContainer.innerHTML = `<img src="${getCurrentImageSrc()}" alt="Exam Timer Image">`;
            } else {
                const imgContainer = timerWindowRef.current.document.querySelector('.image-container');
                if (imgContainer) imgContainer.remove();
            }
        }
    };

    // Add time to timer
    const addTimeToTimer = () => {
        if (timerWindowRef.current && !timerWindowRef.current.closed) {
            timerWindowRef.current.addTime(adjustmentAmount * 60); // Convert to seconds
        }
    };

    // Subtract time from timer
    const subtractTimeFromTimer = () => {
        if (timerWindowRef.current && !timerWindowRef.current.closed) {
            timerWindowRef.current.subtractTime(adjustmentAmount * 60); // Convert to seconds
        }
    };

    // Start timer in popup
    const startTimerInPopup = () => {
        if (timerWindowRef.current && !timerWindowRef.current.closed) {
            timerWindowRef.current.startTimer();
        }
    };

    // Stop timer in popup
    const stopTimerInPopup = () => {
        if (timerWindowRef.current && !timerWindowRef.current.closed) {
            timerWindowRef.current.stopTimer();
        }
    };

    // Reset timer in popup
    const resetTimerInPopup = () => {
        if (timerWindowRef.current && !timerWindowRef.current.closed) {
            timerWindowRef.current.resetTimer(timerDuration * 60); // Convert to seconds
        }
    };

    // Open timer in popup window
    const openTimerPopup = () => {
        // Close existing timer window if it's open
        if (timerWindowRef.current && !timerWindowRef.current.closed) {
            timerWindowRef.current.close();
        }

        // Open new timer window
        timerWindowRef.current = window.open('', 'ExamTimerDisplay', 'width=800,height=600');

        if (!timerWindowRef.current) {
            alert('Pop-up blocked! Please allow pop-ups for this site.');
            return;
        }

        // Create timer display HTML
        const timerHTML = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: freight-sans-pro, sans-serif;
              background-color: ${backgroundColor};
              color: var(--c4);
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              height: 100vh;
              overflow: hidden;
            }
            
            .title {
              font-size: 3rem;
              margin-bottom: 2rem;
              text-align: center;
            }
            
            .date {
              font-size: 2rem;
              margin-bottom: 1rem;
              text-align: center;
            }
            
            .clock {
              font-size: 6rem;
              font-weight: bold;
              text-align: center;
              margin: 2rem 0;
            }
            
            .timer {
              display: flex;
              flex-direction: column;
              align-items: center;
            }
            
            .timer-label {
              font-size: 1.5rem;
              margin-bottom: 0.5rem;
            }
            
            .image-container {
              margin-top: 2rem;
              text-align: center;
            }
            
            .image-container img {
              max-width: 300px;
              max-height: 200px;
            }
            
            .controls {
              display: flex;
              gap: 20px;
              margin-top: 1rem;
            }
            
            .control-btn {
              background-color: rgba(0, 0, 0, 0.2);
              border: none;
              color: white;
              padding: 0.5rem 1rem;
              cursor: pointer;
              border-radius: 4px;
              font-size: 1rem;
              transition: background-color 0.2s;
            }
            
            .control-btn:hover {
              background-color: rgba(0, 0, 0, 0.3);
            }
            
            @media (max-width: 600px) {
              .title {
                font-size: 2.5rem;
              }
              
              .date {
                font-size: 1.5rem;
              }
              
              .clock {
                font-size: 4rem;
              }
            }
          </style>
        </head>
        <body>
          <h1 class="title">${title}</h1>
          <div id="date" class="date"></div>
          <div id="clock" class="clock"></div>
          ${showImage ? `
            <div class="image-container">
              <img src="${getCurrentImageSrc()}" alt="Exam Timer Image">
            </div>
          ` : ''}
          
          <script>
            let timerDuration = ${timerDuration * 60}; // Convert minutes to seconds
            let timerEndTime = null;
            let timerRunning = false;
            let remainingSeconds = timerDuration;
            
            // Format time as HH:MM:SS
            function formatTime(date) {
              return date.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              });
            }
            
            // Format date
            function formatDate(date) {
              return date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
            }
            
            // Format remaining time
            function formatRemainingTime(seconds) {
              const hours = Math.floor(seconds / 3600);
              const minutes = Math.floor((seconds % 3600) / 60);
              const secs = seconds % 60;
              
              return \`\${hours.toString().padStart(2, '0')}:\${minutes.toString().padStart(2, '0')}:\${secs.toString().padStart(2, '0')}\`;
            }
            
            // Update clock
            function updateClock() {
              const now = new Date();
              const dateElement = document.getElementById('date');
              const clockElement = document.getElementById('clock');
              
              dateElement.textContent = formatDate(now);
              
              if (timerRunning && timerEndTime) {
                const currentTime = now.getTime();
                remainingSeconds = Math.max(0, Math.floor((timerEndTime - currentTime) / 1000));
                
                if (remainingSeconds <= 0) {
                  clockElement.innerHTML = \`<div class="timer">
                    <div class="timer-label">Time's Up!</div>
                    <div>\${formatTime(now)}</div>
                  </div>\`;
                  timerRunning = false;
                  alert('Exam time is up!');
                } else {
                  clockElement.innerHTML = \`<div class="timer">
                    <div class="timer-label">Time Remaining:</div>
                    <div>\${formatRemainingTime(remainingSeconds)}</div>
                  </div>\`;
                }
              } else if (!timerRunning && remainingSeconds < timerDuration) {
                // Timer is paused with time already counted down
                clockElement.innerHTML = \`<div class="timer">
                  <div class="timer-label">Timer Paused:</div>
                  <div>\${formatRemainingTime(remainingSeconds)}</div>
                </div>\`;
              } else {
                clockElement.textContent = formatTime(now);
              }
            }
            
            // Start timer
            function startTimer() {
              if (!timerRunning) {
                const now = new Date();
                timerEndTime = now.getTime() + (remainingSeconds * 1000);
                timerRunning = true;
              }
            }
            
            // Stop timer
            function stopTimer() {
              timerRunning = false;
              // remainingSeconds is already being updated in updateClock
            }
            
            // Reset timer
            function resetTimer(seconds) {
              stopTimer();
              timerDuration = seconds;
              remainingSeconds = seconds;
              updateClock();
            }
            
            // Add time to timer
            function addTime(secondsToAdd) {
              if (timerRunning) {
                // If timer is running, adjust end time
                timerEndTime += secondsToAdd * 1000;
              } else {
                // If timer is paused, just add to remaining time
                remainingSeconds += secondsToAdd;
              }
              updateClock();
            }
            
            // Subtract time from timer
            function subtractTime(secondsToSubtract) {
              if (timerRunning) {
                // If timer is running, adjust end time but don't go below current time
                const now = new Date();
                const currentTime = now.getTime();
                const newEndTime = timerEndTime - (secondsToSubtract * 1000);
                timerEndTime = Math.max(currentTime + 1000, newEndTime); // Ensure at least 1 second
              } else {
                // If timer is paused, just subtract from remaining time
                remainingSeconds = Math.max(0, remainingSeconds - secondsToSubtract);
              }
              updateClock();
            }
            
            // Make functions available to parent window
            window.startTimer = startTimer;
            window.stopTimer = stopTimer;
            window.resetTimer = resetTimer;
            window.addTime = addTime;
            window.subtractTime = subtractTime;
            
            // Initialize
            window.onload = function() {
              updateClock();
              setInterval(updateClock, 1000);
              ${autoStartTimer ? 'startTimer();' : ''}
            };
          </script>
        </body>
      </html>
    `;

        timerWindowRef.current.document.write(timerHTML);
        timerWindowRef.current.document.close();
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        openTimerPopup();
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Exam Timer Control Panel</title>
                <link rel="icon" href="/L.png" />
            </Head>

            <main className={styles.controlPanel}>
                <h1 className={styles.controlTitle}>Exam Timer Control Panel</h1>

                <form className={styles.controlForm} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="title-input">Title:</label>
                        <input
                            id="title-input"
                            type="text"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                updateTimerSettings();
                            }}
                            className={styles.formControl}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="duration-input">Timer Duration (minutes):</label>
                        <input
                            id="duration-input"
                            type="number"
                            min="1"
                            value={timerDuration}
                            onChange={(e) => setTimerDuration(parseInt(e.target.value))}
                            className={styles.formControl}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="bg-color-input">Background Color:</label>
                        <div className={styles.previewRow}>
                            <div className={styles.previewCol}>
                                <input
                                    id="bg-color-input"
                                    type="text"
                                    value={backgroundColor}
                                    onChange={(e) => {
                                        setBackgroundColor(e.target.value);
                                        updateTimerSettings();
                                    }}
                                    className={styles.formControl}
                                    placeholder="Enter CSS color value or variable"
                                />
                                <small>CSS color (e.g., #ffffff, var(--c1))</small>
                            </div>
                            <div className={styles.previewCol}>
                                <div className={styles.colorPreview} style={{ backgroundColor }}></div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <div className={styles.checkboxGroup}>
                            <input
                                id="auto-start-input"
                                type="checkbox"
                                checked={autoStartTimer}
                                onChange={(e) => setAutoStartTimer(e.target.checked)}
                            />
                            <label htmlFor="auto-start-input">Auto-start timer when launched</label>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <div className={styles.checkboxGroup}>
                            <input
                                id="show-image-input"
                                type="checkbox"
                                checked={showImage}
                                onChange={(e) => {
                                    setShowImage(e.target.checked);
                                    updateTimerSettings();
                                }}
                            />
                            <label htmlFor="show-image-input">Show Image</label>
                        </div>
                    </div>

                    {showImage && (
                        <div className={styles.formGroup}>
                            <label htmlFor="image-path-input">Image Path:</label>
                            <input
                                id="image-path-input"
                                type="text"
                                value={imagePath}
                                onChange={(e) => {
                                    setImagePath(e.target.value);
                                    setUploadedImage(null);
                                    updateTimerSettings();
                                }}
                                className={styles.formControl}
                                disabled={uploadedImage !== null}
                            />

                            <div className={styles.uploadContainer}>
                                <label htmlFor="image-upload" className={styles.uploadLabel}>
                                    Upload Image:
                                </label>
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className={styles.fileInput}
                                />
                                {uploadedImage && (
                                    <button
                                        type="button"
                                        className={styles.clearButton}
                                        onClick={() => {
                                            setUploadedImage(null);
                                            updateTimerSettings();
                                        }}
                                    >
                                        Clear Upload
                                    </button>
                                )}
                            </div>

                            <div className={styles.imagePreview}>
                                <img
                                    src={getCurrentImageSrc()}
                                    alt="Preview"
                                    onError={(e) => e.target.src = '/L.png'}
                                />
                            </div>
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor="adjustment-input">Time Adjustment (minutes):</label>
                        <input
                            id="adjustment-input"
                            type="number"
                            min="1"
                            value={adjustmentAmount}
                            onChange={(e) => setAdjustmentAmount(parseInt(e.target.value))}
                            className={styles.formControl}
                        />
                    </div>

                    <div className={styles.launchButtonContainer}>
                        <button type="submit" className={styles.launchButton}>
                            Launch Timer
                        </button>
                    </div>
                </form>

                {timerWindowRef.current && !timerWindowRef.current.closed && (
                    <div className={styles.timerControls}>
                        <h2>Timer Controls</h2>
                        <div className={styles.controlButtonsGrid}>
                            <button
                                type="button"
                                className={styles.controlButton}
                                onClick={startTimerInPopup}
                            >
                                Start Timer
                            </button>

                            <button
                                type="button"
                                className={styles.controlButton}
                                onClick={stopTimerInPopup}
                            >
                                Pause Timer
                            </button>

                            <button
                                type="button"
                                className={styles.controlButton}
                                onClick={resetTimerInPopup}
                            >
                                Reset Timer
                            </button>

                            <button
                                type="button"
                                className={styles.controlButton}
                                onClick={addTimeToTimer}
                            >
                                Add {adjustmentAmount} Minutes
                            </button>

                            <button
                                type="button"
                                className={styles.controlButton}
                                onClick={subtractTimeFromTimer}
                            >
                                Subtract {adjustmentAmount} Minutes
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}