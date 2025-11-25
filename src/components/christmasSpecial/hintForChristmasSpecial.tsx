'use client';

import React, { useState, useEffect } from 'react';
import { Star, Gift, Snowflake, Bell, ChevronRight, Trash2, RotateCcw } from 'lucide-react';

interface ChristmasPuzzleProps {
  isOpen: boolean;
  onClose: () => void;
}

const isChristmasPeriod = (): boolean => {
  // Allow access in development environment
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  const today = new Date();
  const month = today.getMonth(); // 0-11, where 11 is December
  const date = today.getDate();
  
  // Check if it's December 24th (Christmas Eve) or 25th (Christmas Day)
  return month === 11 && (date === 24 || date === 25);
};

const ChristmasPuzzle: React.FC<ChristmasPuzzleProps> = ({ isOpen, onClose }) => {
  const [attempts, setAttempts] = useState('');
  const [hintIndex, setHintIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const TARGET = 'YULETIDE';

  const hints = [
    {
      text: "A season of singing and celebration",
      icon: <Bell className="w-8 h-8 text-yellow-400 animate-bounce" />,
      subtext: ""
    },
    {
      text: "An old term for the Christmas period, often referenced in carols.",
      icon: <Bell className="w-8 h-8 text-yellow-400 animate-bounce" />,
      subtext: ""
    },
  ];

  const getLetterStatus = (letter: string, index: number) => {
    if (!letter) return 'empty';
    if (TARGET[index] === letter) return 'correct';
    if (TARGET.includes(letter)) return 'wrong-position';
    return 'incorrect';
  };

  const getLetterStyle = (status: string) => {
    switch (status) {
      case 'correct':
        return 'bg-green-500/30 border-green-500';
      case 'wrong-position':
        return 'bg-yellow-500/30 border-yellow-500';
      case 'incorrect':
        return 'bg-white/10 border-white/20';
      default:
        return 'bg-white/10 border-white/20';
    }
  };

  const clearInput = () => {
    setAttempts('');
  };

  useEffect(() => {
    if (!isChristmasPeriod()) {
      onClose();
      return;
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.match(/^[a-zA-Z]$/)) {
        const newAttempts = attempts + e.key.toUpperCase();
        setAttempts(newAttempts);
        
        if (newAttempts.includes(TARGET)) {
          setShowSuccess(true);
          setTimeout(() => onClose(), 2000);
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [attempts, onClose]);

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !isChristmasPeriod()) return null;

  return (
    <div 
      className="fixed inset-0 bg-blue-950/95 z-50 flex items-center justify-center"
      onClick={handleBackgroundClick}
    >
      <div className="max-w-2xl w-full mx-4 bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-2xl">
        {showSuccess ? (
          <div className="text-center text-white space-y-4 animate-fade-in">
            <h2 className="text-3xl font-bold">🎄 The Magic Word Revealed! 🎄</h2>
            <p className="text-xl">Let the Christmas games begin...</p>
            <div className="flex justify-center gap-4 py-4">
              {Array.from(TARGET).map((letter, i) => (
                <div 
                  key={i}
                  className="w-12 h-12 bg-green-500/30 border border-green-500 rounded-lg flex items-center justify-center text-2xl font-bold animate-bounce"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {letter}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="text-center text-white mb-8">
              <h2 className="text-3xl font-bold mb-2">🎄 Christmas Code Puzzle 🎄</h2>
              <p className="text-lg opacity-80">Discover the magic word to begin the festivities!</p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white/5 rounded-lg p-6">
                <div className="flex items-center gap-4 mb-4">
                  {hints[hintIndex].icon}
                  <p className="text-white text-xl">{hints[hintIndex].text}</p>
                </div>
                <p className="text-white/60 text-sm">{hints[hintIndex].subtext}</p>
              </div>
              
              <div className="flex justify-center gap-2">
                {[...Array(2)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHintIndex(i)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      i === hintIndex ? 'bg-white' : 'bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex justify-between items-center text-white/60">
                <button
                  onClick={() => setHintIndex(prev => Math.max(0, prev - 1))}
                  className="p-2 hover:text-white transition-colors"
                  disabled={hintIndex === 0}
                >
                  Previous Hint
                </button>
                <button
                  onClick={() => setHintIndex(prev => Math.min(hints.length - 1, prev + 1))}
                  className="p-2 hover:text-white transition-colors flex items-center gap-1"
                  disabled={hintIndex === hints.length - 1}
                >
                  Next Hint
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="mt-8 text-center text-white">
              <p className="text-white/60 mb-4">Type the magic word when you think you know it...</p>
              <p className="text-white/60 mb-4">Press shift when you type.</p>
              <div className="flex justify-center items-center gap-4">
                <div className="flex gap-2">
                  {[...Array(8)].map((_, i) => {
                    const letter = attempts.split('').slice(-8)[i] || '';
                    const status = getLetterStatus(letter, i);
                    return (
                      <div 
                        key={i}
                        className={`w-12 h-12 border rounded-lg flex items-center justify-center text-2xl font-bold transition-all duration-300 ${getLetterStyle(status)}`}
                      >
                        {letter}
                      </div>
                    );
                  })}
                </div>
                {attempts.length > 0 && (
                  <button
                    onClick={clearInput}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors group"
                    title="Clear input"
                  >
                    <RotateCcw className="w-6 h-6 text-white/60 group-hover:text-white transition-colors" />
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 text-center">
              <div className="flex justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500/30 border border-green-500 rounded" />
                  <span className="text-white/60">Correct position</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500/30 border border-yellow-500 rounded" />
                  <span className="text-white/60">Wrong position</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChristmasPuzzle;