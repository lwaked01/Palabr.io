'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/navigation'

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
]

interface Stats {
  gamesPlayed: number
  gamesWon: number
  currentStreak: number
  maxStreak: number
  guessDistribution: { [key: number]: number }
}

export default function WordleGame() {
  const [guesses, setGuesses] = useState<string[]>(['', '', '', '', '', ''])
  const [currentGuess, setCurrentGuess] = useState(0)
  const [targetWord, setTargetWord] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [stats, setStats] = useState<Stats>({
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
  })

  useEffect(() => {
    fetchDailyWord()
    loadStats()
  }, [])

  const fetchDailyWord = async () => {
    try {
      const response = await fetch('/api/word/daily')
      const data = await response.json()
      setTargetWord(data.word)
    } catch (error) {
      console.error('Error fetching daily word:', error)
      setTargetWord('SUELO')
    }
  }

  const loadStats = () => {
    const savedStats = localStorage.getItem('wordleStats')
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }
  }

  const saveStats = (newStats: Stats) => {
    localStorage.setItem('wordleStats', JSON.stringify(newStats))
    setStats(newStats)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isProcessing || gameOver) return

      const key = e.key.toUpperCase()

      if (key === 'ENTER') {
        handleKeyPress('ENTER')
      } else if (key === 'BACKSPACE') {
        handleKeyPress('BACKSPACE')
      } else if (/^[A-ZÑ]$/.test(key)) {
        handleKeyPress(key)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [guesses, currentGuess, gameOver, isProcessing])

  const handleKeyPress = async (key: string) => {
    if (currentGuess >= 6 || gameOver || isProcessing) return

    const currentRow = guesses[currentGuess]

    if (key === 'ENTER') {
      if (currentRow.length === 5) {
        setIsProcessing(true)
        
        const isValid = await validateWord(currentRow)
        if (!isValid) {
          setMessage('Palabra no válida')
          setTimeout(() => setMessage(''), 2000)
          setIsProcessing(false)
          return
        }

        const result = await checkGuess(currentRow)
        
        if (result.isCorrect) {
          setGameOver(true)
          setMessage('¡Felicidades! 🎉')
          updateStats(true, currentGuess + 1)
        } else if (currentGuess === 5) {
          setGameOver(true)
          setMessage(`La palabra era: ${targetWord}`)
          updateStats(false, 0)
        }

        setCurrentGuess((prev) => prev + 1)
        setIsProcessing(false)
      }
    } else if (key === 'BACKSPACE') {
      const newGuesses = [...guesses]
      newGuesses[currentGuess] = currentRow.slice(0, -1)
      setGuesses(newGuesses)
    } else if (currentRow.length < 5) {
      const newGuesses = [...guesses]
      newGuesses[currentGuess] = currentRow + key
      setGuesses(newGuesses)
    }
  }

  const validateWord = async (word: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/word/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word }),
      })
      const data = await response.json()
      return data.isValid
    } catch (error) {
      console.error('Error validating word:', error)
      return false
    }
  }

  const checkGuess = async (guess: string) => {
    try {
      const response = await fetch('/api/game/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guess, target: targetWord }),
      })
      return await response.json()
    } catch (error) {
      console.error('Error checking guess:', error)
      return { isCorrect: false, feedback: [] }
    }
  }

  const updateStats = (won: boolean, attempts: number) => {
    const newStats = { ...stats }
    newStats.gamesPlayed += 1

    if (won) {
      newStats.gamesWon += 1
      newStats.currentStreak += 1
      newStats.maxStreak = Math.max(newStats.maxStreak, newStats.currentStreak)
      newStats.guessDistribution[attempts] = (newStats.guessDistribution[attempts] || 0) + 1
    } else {
      newStats.currentStreak = 0
    }

    saveStats(newStats)
  }

  const getCellStatus = (letter: string, colIndex: number, rowIndex: number) => {
    if (rowIndex < currentGuess && targetWord) {
      if (letter === targetWord[colIndex]) {
        return 'correct'
      } else if (targetWord.includes(letter)) {
        return 'present'
      } else {
        return 'absent'
      }
    } else if (rowIndex === currentGuess && letter) {
      return 'active'
    }
    return ''
  }

  const getKeyStatus = (key: string) => {
    if (key === 'ENTER' || key === 'BACKSPACE') return 'default'

    let status = 'default'

    for (let i = 0; i < currentGuess; i++) {
      const guess = guesses[i]
      if (guess.length === 5 && targetWord) {
        for (let j = 0; j < guess.length; j++) {
          if (guess[j] === key) {
            if (targetWord[j] === key) {
              status = 'correct'
              break
            } else if (targetWord.includes(key)) {
              if (status !== 'correct') status = 'present'
            } else {
              if (status === 'default') status = 'absent'
            }
          }
        }
      }
    }

    return status
  }

  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navigation />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-8">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-wider">
            La Palabra del Día
          </h1>
          {message && (
            <p className="mt-4 text-xl text-yellow-400 font-semibold">{message}</p>
          )}
        </header>

        <main className="flex flex-col lg:flex-row items-start gap-8 w-full max-w-[900px]">
          <div className="flex flex-col items-center gap-6 w-full lg:w-auto">
            {/* Game Grid */}
            <div className="grid grid-rows-6 gap-1.5 w-full max-w-[350px]">
              {guesses.map((guess, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-5 gap-1.5">
                  {Array.from({ length: 5 }).map((_, colIndex) => {
                    const letter = guess[colIndex] || ''
                    const status = getCellStatus(letter, colIndex, rowIndex)

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
                    )
                  })}
                </div>
              ))}
            </div>

            {/* Keyboard */}
            <div className="w-full flex flex-col gap-1.5">
              {KEYBOARD_ROWS.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-1.5 justify-center">
                  {row.map((key) => {
                    const status = getKeyStatus(key)
                    const isSpecial = key === 'ENTER' || key === 'BACKSPACE'

                    return (
                      <button
                        key={key}
                        onClick={() => handleKeyPress(key)}
                        disabled={isProcessing || gameOver}
                        className={`
                          h-14 rounded flex items-center justify-center
                          font-semibold text-sm border-none cursor-pointer
                          transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed
                          ${isSpecial ? 'px-4 min-w-[60px]' : 'flex-1 min-w-[32px] max-w-[43px]'}
                          ${status === 'correct' ? 'bg-green-600 text-white hover:bg-green-700' : ''}
                          ${status === 'present' ? 'bg-yellow-600 text-white hover:bg-yellow-700' : ''}
                          ${status === 'absent' ? 'bg-[#1a1a1b] text-gray-500 hover:bg-[#2a2a2b]' : ''}
                          ${status === 'default' ? 'bg-[#3a3a3c] text-white hover:bg-[#4a4a4c]' : ''}
                        `}
                      >
                        {key === 'ENTER' ? (
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        ) : key === 'BACKSPACE' ? (
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
                            <line x1="18" y1="9" x2="12" y2="15"></line>
                            <line x1="12" y1="9" x2="18" y2="15"></line>
                          </svg>
                        ) : (
                          key
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Statistics Panel */}
          <div className="w-full lg:w-80 bg-[#1a1a1b] rounded-lg p-6 border-2 border-[#3a3a3c]">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Estadísticas</h2>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{stats.gamesPlayed}</div>
                <div className="text-xs text-gray-400">Jugadas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{winRate}</div>
                <div className="text-xs text-gray-400">% Victoria</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{stats.currentStreak}</div>
                <div className="text-xs text-gray-400">Racha</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{stats.maxStreak}</div>
                <div className="text-xs text-gray-400">Máx Racha</div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-white mb-3">Distribución de Intentos</h3>
            <div className="space-y-2">
              {Object.entries(stats.guessDistribution).map(([attempt, count]) => {
                const maxCount = Math.max(...Object.values(stats.guessDistribution))
                const width = maxCount > 0 ? (count / maxCount) * 100 : 0
                
                return (
                  <div key={attempt} className="flex items-center gap-2">
                    <span className="text-white w-4">{attempt}</span>
                    <div className="flex-1 bg-[#3a3a3c] rounded h-6 overflow-hidden">
                      <div
                        className="bg-green-600 h-full flex items-center justify-end px-2 transition-all duration-300"
                        style={{ width: `${Math.max(width, count > 0 ? 10 : 0)}%` }}
                      >
                        {count > 0 && <span className="text-white text-sm font-semibold">{count}</span>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
