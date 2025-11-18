'use client';

import { useState, useEffect } from 'react';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
];

const TARGET_WORD = 'SUELO';

export default function WordleGame() {
  const [guesses, setGuesses] = useState<string[]>(['SS', '', '', '', '', '']);
  const [currentGuess, setCurrentGuess] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      
      if (key === 'ENTER') {
        handleKeyPress('ENTER');
      } else if (key === 'BACKSPACE') {
        handleKeyPress('BACKSPACE');
      } else if (/^[A-ZÑ]$/.test(key)) {
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [guesses, currentGuess]);

  const handleKeyPress = (key: string) => {
    if (currentGuess >= 6) return;

    const currentRow = guesses[currentGuess];

    if (key === 'ENTER') {
      if (currentRow.length === 5) {
        setCurrentGuess(prev => prev + 1);
      }
    } else if (key === 'BACKSPACE') {
      const newGuesses = [...guesses];
      newGuesses[currentGuess] = currentRow.slice(0, -1);
      setGuesses(newGuesses);
    } else if (currentRow.length < 5) {
      const newGuesses = [...guesses];
      newGuesses[currentGuess] = currentRow + key;
      setGuesses(newGuesses);
    }
  };

  const getCellStatus = (letter: string, colIndex: number, rowIndex: number) => {
    if (rowIndex < currentGuess) {
      if (letter === TARGET_WORD[colIndex]) {
        return 'correct';
      } else if (TARGET_WORD.includes(letter)) {
        return 'present';
      } else {
        return 'absent';
      }
    } else if (rowIndex === currentGuess && letter) {
      return 'active';
    }
    return '';
  };

  const getKeyStatus = (key: string) => {
    if (key === 'ENTER' || key === 'BACKSPACE') return 'default';
    
    let status = 'default';
    
    for (let i = 0; i < currentGuess; i++) {
      const guess = guesses[i];
      if (guess.length === 5) {
        for (let j = 0; j < guess.length; j++) {
          if (guess[j] === key) {
            if (TARGET_WORD[j] === key) {
              status = 'correct';
              break;
            } else if (TARGET_WORD.includes(key)) {
              if (status !== 'correct') status = 'present';
            } else {
              if (status === 'default') status = 'absent';
            }
          }
        }
      }
    }
    
    return status;
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 gap-8">
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-wider">
          La Palabra del Día
        </h1>
      </header>

      <main className="flex flex-col items-center gap-6 w-full max-w-[550px]">
        {/* Game Grid */}
        <div className="grid grid-rows-6 gap-1.5 w-full max-w-[350px]">
          {guesses.map((guess, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-5 gap-1.5">
              {Array.from({ length: 5 }).map((_, colIndex) => {
                const letter = guess[colIndex] || '';
                const status = getCellStatus(letter, colIndex, rowIndex);
                
                return (
                  <div
                    key={colIndex}
                    className={`
                      aspect-square flex items-center justify-center
                      border-2 text-4xl font-bold text-white uppercase
                      transition-all duration-200
                      ${status === 'correct' ? 'bg-green-600 border-green-600' : ''}
                      ${status === 'present' ? 'bg-yellow-600 border-yellow-600' : ''}
                      ${status === 'absent' ? 'bg-[#3a3a3c] border-[#3a3a3c]' : ''}
                      ${status === 'active' ? 'border-[#565758] bg-transparent' : ''}
                      ${!status ? 'border-[#3a3a3c] bg-transparent' : ''}
                    `}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Keyboard */}
        <div className="w-full flex flex-col gap-1.5">
          {KEYBOARD_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1.5 justify-center">
              {row.map((key) => {
                const status = getKeyStatus(key);
                const isSpecial = key === 'ENTER' || key === 'BACKSPACE';

                return (
                  <button
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    className={`
                      h-14 rounded flex items-center justify-center
                      font-semibold text-sm border-none cursor-pointer
                      transition-colors duration-150
                      ${isSpecial ? 'px-4 min-w-[60px]' : 'flex-1 min-w-[32px] max-w-[43px]'}
                      ${status === 'correct' ? 'bg-green-600 text-white hover:bg-green-700' : ''}
                      ${status === 'present' ? 'bg-yellow-600 text-white hover:bg-yellow-700' : ''}
                      ${status === 'absent' ? 'bg-[#1a1a1b] text-gray-500 hover:bg-[#2a2a2b]' : ''}
                      ${status === 'default' ? 'bg-[#3a3a3c] text-white hover:bg-[#4a4a4c]' : ''}
                    `}
                  >
                    {key === 'ENTER' ? (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    ) : key === 'BACKSPACE' ? (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
                        <line x1="18" y1="9" x2="12" y2="15"></line>
                        <line x1="12" y1="9" x2="18" y2="15"></line>
                      </svg>
                    ) : (
                      key
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
