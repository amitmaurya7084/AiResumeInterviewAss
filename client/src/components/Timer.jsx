import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function Timer({ timeLeft, totalTime }) {
    const percentage = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;

    return (
        <div className="w-20 h-20">
            <CircularProgressbar
                value={percentage}
                text={`${timeLeft}s`}
                styles={buildStyles({
                    textSize: '28px',
                    pathColor: '#10b981',
                    textColor: timeLeft < 10 ? '#ef4444' : '#10b981', // Red when low
                    trailColor: '#e5e7eb',
                })}
            />
        </div>
    );
}

export default Timer;