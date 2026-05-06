import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: Date;
  shouldStart?: boolean;
}

export default function CountdownTimer({ targetDate, shouldStart = true }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isStarted, setIsStarted] = useState(shouldStart);

  function calculateTimeLeft(): TimeLeft {
    const now = Date.now(); // Current UTC timestamp in milliseconds
    const targetTime = targetDate.getTime(); // Target UTC timestamp
    const difference = targetTime - now;
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  useEffect(() => {
    if (!isStarted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate, isStarted]);

  const blocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-3 sm:gap-4 justify-center">
      {blocks.map((block) => (
        <div key={block.label} className="flex flex-col items-center">
          <div className="neon-border rounded-xl bg-dark-800/80 backdrop-blur-sm w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <span className="font-orbitron text-2xl sm:text-3xl font-bold text-neon-blue animate-text-glow">
              {String(block.value).padStart(2, '0')}
            </span>
          </div>
          <span className="text-[10px] sm:text-xs text-gray-500 mt-2 font-rajdhani font-semibold uppercase tracking-wider">
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
}
