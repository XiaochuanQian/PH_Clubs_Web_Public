"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Snowflake, Gift, X } from 'lucide-react';
import getAuth from '@/lib/getAuth';

interface Snowflake {
  id: number;
  x: number;
  y: number;
  speed: number;
  wobble: number;
  size: number;
  color: string;
  glow: boolean;
}

interface ChristmasMessage {
  message: string;
  author?: string;
}

const ChristmasEasterEgg = () => {
  const [isActive, setIsActive] = useState(false);
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState('');
  const [showCongrats, setShowCongrats] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [stu_id, setStuid] = useState(0);

  
  const SECRET_COMBO = 'YULETIDE';
  
  const christmasMessages: ChristmasMessage[] = [
    { message: "May your days be merry and bright!", author: "White Christmas" },
    { message: "Peace on earth, goodwill to all.", author: "Luke 2:14" },
    { message: "The best way to spread Christmas cheer is singing loud for all to hear!", author: "Elf" },
    { message: "Christmas isn't just a day, it's a frame of mind.", author: "Miracle on 34th Street" },
    { message: "May the spirit of Christmas bring you peace and happiness." },
    { message: "Ho ho ho! Merry Christmas!", author: "Santa Claus" },
    { message: "Christmas is like candy; it slowly melts in your mouth sweetening every taste bud, making you wish it could last forever.", author: "Richelle E. Goodrich" },
    { message: "Christmas is a time when you get homesick, even when you’re home.", author: "Carol Nelson" },
    { message: "Christmas is most truly Christmas when we celebrate it by giving the light of love to those who need it.", author: "Julie Baker" },
    { message: "Christmas is not a time nor a season, but a state of mind. To cherish peace and goodwill, to be plenteous in mercy, is to have the real spirit of Christmas.", author: "Calvin Coolidge" },
    { message: "Christmas is the only time of the year when we can afford to be selfish.", author: "Bill Murray" },
    { message: "Christmas is the day that holds all time together.", author: "Alexander Smith" },
    { message: "Christmas is the time when you get a second chance to get it right.", author: "Doug Larson" },  
    { message: "Christmas is the season for kindling the fire of hospitality.", author: "Washington Irving" },
  ];
  
  // Add new state for selected message
  const [selectedMessage, setSelectedMessage] = useState<ChristmasMessage>(() => {
    return christmasMessages[Math.floor(Math.random() * christmasMessages.length)];
  });
  
  // Add function to check if today is Christmas
  const isChristmas = useCallback(() => {
    const today = new Date();
    return today.getMonth() === 11 && (today.getDate() === 24 || today.getDate() === 25 || today.getDate() === 26 || today.getDate() === 27); // Month is 0-based
  }, []);

  // Snowflake generation with more natural parameters
  const createSnowflake = useCallback(() => {
    // Define colors with complete Tailwind class names
    const colors = [
      'text-white',
      'text-blue-200',
      'text-purple-200',
      'text-pink-200',
      'text-yellow-200'
    ];
    return {
      id: Math.random(),
      x: Math.random() * 100,
      y: -10,
      speed: 0.5 + Math.random() * 0.5,
      wobble: Math.random() * 2 - 1,
      size: 0.8 + Math.random() * 1.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      glow: Math.random() > 0.7
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only allow activation if it's Christmas or in development
      if (!isChristmas() && process.env.NODE_ENV !== 'development') {
        console.log('Not Christmas, not activating');
        return;
      }
      
      const newCombo = combo + e.key.toUpperCase();
      setCombo(newCombo.slice(-SECRET_COMBO.length));
      
      if (newCombo.includes(SECRET_COMBO)) {
        setIsActive(true);
        setCombo('');
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [combo, isChristmas]);

  useEffect(() => {
    if (!isActive) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    const SPAWN_INTERVAL = 200; // ms between new snowflakes
    let lastSpawn = 0;

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 16; // Normalize to ~60fps
      lastTime = currentTime;

      // Spawn new snowflakes
      if (currentTime - lastSpawn > SPAWN_INTERVAL && snowflakes.length < 30) {
        setSnowflakes(current => [...current, createSnowflake()]);
        lastSpawn = currentTime;
      }

      // Update positions
      setSnowflakes(current => 
        current.map(flake => ({
          ...flake,
          y: flake.y + flake.speed * deltaTime*0.2,
          x: flake.x + Math.sin(currentTime * 0.001 + flake.wobble) * 0.01
        })).filter(flake => flake.y < 110)
      );

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isActive, createSnowflake]);

  const handleClick = (id: number) => {
    setSnowflakes(current => current.filter(flake => flake.id !== id));
    const newScore = score + 1;
    setScore(newScore);
    
    // Check if score reaches 100
    if (newScore === 66) {
      setShowCongrats(true);
      // Play music
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
  };

  // Add cleanup effect for audio
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  useEffect(()=>{
    const fetchStuId = async () => {
      const session = await getAuth();
      setStuid(Number(session?.user.stu_id) | 0);
    }
    fetchStuId();
  })

  // Add message change interval
  useEffect(() => {
    if (!showCongrats) return;

    // Change message every 10 seconds
    const messageInterval = setInterval(() => {
      const newMessage = christmasMessages[Math.floor(Math.random() * christmasMessages.length)];
      // Ensure we don't get the same message twice in a row
      if (newMessage.message !== selectedMessage.message) {
        setSelectedMessage(newMessage);
      }
    }, 10000); // 10 seconds

    // Cleanup interval on unmount or when showCongrats changes
    return () => clearInterval(messageInterval);
  }, [showCongrats, selectedMessage]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-blue-950/80 z-10">
      <audio
        ref={audioRef}
        src="/all_I_want_for_christmas_is_you.mp3"
        loop
      />

      {/* Snowflakes rendered behind the congrats content */}
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className={`absolute ${flake.color} ${!showCongrats ? 'cursor-pointer' : 'pointer-events-none'}`}
          style={{
            left: `${flake.x}%`,
            top: `${flake.y}%`,
            transform: `translate(-50%, -50%) scale(${flake.size})`,
            filter: flake.glow ? 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.6)) drop-shadow(0 0 8px rgba(255, 255, 255, 0.4))' : 'none',
            zIndex: showCongrats ? 55 : 70, // Lower z-index when showing congrats
          }}
          onClick={!showCongrats ? () => handleClick(flake.id) : undefined}
        >
          <Snowflake className="w-6 h-6 animate-spin-slow" />
        </div>
      ))}

      {showCongrats && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-red-600/90 to-green-700/90 text-white z-[60] transition-opacity duration-300">
          <div className="text-center p-8 rounded-lg backdrop-blur-sm bg-white/10 shadow-2xl">
            <h1 className="text-6xl font-bold mb-8 animate-bounce-slow font-cursive" style={{ fontFamily: 'Brush Script MT, cursive' }}>
              Merry Christmas! 🎄
            </h1>
            <h2 className="text-3xl font-bold mb-8 animate-bounce-slow font-cursive" style={{ fontFamily: 'Brush Script MT, cursive' }}>
              Wishing you a Merry Christmas and a Happy New Year!
            </h2>
            <div className="space-y-4">
              <p className="text-2xl italic font-serif transition-opacity duration-500">
                <span style={{fontFamily: 'SimSun, serif'}}>{selectedMessage.message}</span>
              </p>
              {selectedMessage.author && (
                <p className="text-xl opacity-75 transition-opacity duration-500">
                  <span style={{fontFamily: 'SimSun, serif'}}>- {selectedMessage.author}</span>
                </p>
              )}
            </div>
            <button
              onClick={() => {
                setShowCongrats(false);
                setIsActive(false);
                setScore(0);
                if (audioRef.current) {
                  audioRef.current.pause();
                  audioRef.current.currentTime = 0;
                }
              }}
              className="mt-8 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors duration-300 ease-in-out"
            >
              Close
            </button>
            <p className="text-sm opacity-75 mt-4">
              Turn up the volume for the full experience!
              <br />
              By the PH Clubs Dev Team &copy; 2024
              <br />
              <span className="italic">Zicheng Zhao, Xiaochuan Qian, Xirui Zhou, Jianhe Liang</span>
            </p>
            <span className='text-sm opacity-75 mt-4'>This page belongs to {stu_id}.</span>
          </div>
        </div>
      )}

      {!showCongrats && (
        <>
          <div className="absolute top-4 right-4 flex gap-4 text-white">
            <div className="flex items-center gap-2">
              <Gift className="w-6 h-6" />
              <span className="text-xl font-bold">{score}</span>
            </div>
            <button 
              onClick={() => {
                setIsActive(false);
                setScore(0);
              }}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-center">
            <p className="text-xl font-bold mb-2">Catch the snowflakes!</p>
            <p className="text-sm opacity-75">Click them before they fall, try to get 66 points! If there are no snowflakes, try refreshing the page.</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ChristmasEasterEgg;