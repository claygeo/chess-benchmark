'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Chessboard } from 'react-chessboard';

// Game phases
enum GamePhase {
  SELECTION = 'selection',
  PLAYING = 'playing',
  FEEDBACK = 'feedback',
  RESULTS = 'results'
}

// Difficulty presets
const difficultyPresets = {
  beginner: { timePerSquare: 5000, label: 'Beginner' },
  club: { timePerSquare: 3000, label: 'Club' },
  expert: { timePerSquare: 2000, label: 'Expert' },
  master: { timePerSquare: 1000, label: 'Master' }
};

export default function CoordinateVisionPage() {
  // Screen size detection
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Core game state
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.SELECTION);
  const [currentDifficulty, setCurrentDifficulty] = useState<keyof typeof difficultyPresets>('beginner');
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds] = useState(10);
  
  // Square tracking
  const [targetSquare, setTargetSquare] = useState<string>('');
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Timing
  const [timeLeft, setTimeLeft] = useState(0);
  const [responseTime, setResponseTime] = useState(0);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Scoring
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);

  // Mobile detection
  useEffect(() => {
    setIsMounted(true);
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Generate random square
  const generateRandomSquare = useCallback(() => {
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
    return files[Math.floor(Math.random() * 8)] + ranks[Math.floor(Math.random() * 8)];
  }, []);

  // Clear timer
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Start new round
  const startNewRound = useCallback(() => {
    clearTimer();
    setUserInput('');
    setIsCorrect(null);
    setGamePhase(GamePhase.PLAYING);
    
    const newSquare = generateRandomSquare();
    setTargetSquare(newSquare);
    
    const timeLimit = difficultyPresets[currentDifficulty].timePerSquare;
    setTimeLeft(timeLimit);
    startTimeRef.current = Date.now();
    
    // Focus input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
    
    // Countdown timer
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, timeLimit - elapsed);
      setTimeLeft(remaining);
      
      if (remaining === 0) {
        clearInterval(interval);
        handleTimeout();
      }
    }, 100);
    
    timerRef.current = interval;
  }, [currentDifficulty, generateRandomSquare, clearTimer]);

  // Handle timeout
  const handleTimeout = useCallback(() => {
    clearTimer();
    setIsCorrect(false);
    setStreak(0);
    setGamePhase(GamePhase.FEEDBACK);
    
    setTimeout(() => {
      nextRound();
    }, 1500);
  }, [clearTimer]);

  // Handle submit
  const handleSubmit = useCallback(() => {
    if (!userInput.trim() || gamePhase !== GamePhase.PLAYING) return;
    
    clearTimer();
    const elapsed = Date.now() - startTimeRef.current;
    setResponseTime(elapsed);
    
    const correct = userInput.trim().toLowerCase() === targetSquare.toLowerCase();
    setIsCorrect(correct);
    setGamePhase(GamePhase.FEEDBACK);
    
    if (correct) {
      setCorrectAnswers(prev => prev + 1);
      
      // Calculate points
      const timeLimit = difficultyPresets[currentDifficulty].timePerSquare;
      const basePoints = 100;
      const timeBonus = Math.floor((timeLimit - elapsed) / 100);
      const streakBonus = streak * 10;
      const totalPoints = basePoints + timeBonus + streakBonus;
      
      setScore(prev => {
        const newScore = prev + totalPoints;
        setBestScore(current => Math.max(current, newScore));
        return newScore;
      });
      
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    
    setTimeout(() => {
      nextRound();
    }, 1500);
  }, [userInput, targetSquare, gamePhase, currentDifficulty, streak, clearTimer]);

  // Next round or end game - FIXED: Check against totalRounds properly
  const nextRound = useCallback(() => {
    const nextRoundNumber = currentRound + 1;
    if (nextRoundNumber >= totalRounds) {
      setGamePhase(GamePhase.RESULTS);
    } else {
      setCurrentRound(nextRoundNumber);
      startNewRound();
    }
  }, [currentRound, totalRounds, startNewRound]);

  // Start game
  const startGame = useCallback(() => {
    setCurrentRound(0);
    setScore(0);
    setStreak(0);
    setCorrectAnswers(0);
    startNewRound();
  }, [startNewRound]);

  // Quit game
  const quitGame = useCallback(() => {
    clearTimer();
    setGamePhase(GamePhase.SELECTION);
    setTargetSquare('');
    setUserInput('');
    setIsCorrect(null);
    setCurrentRound(0);
  }, [clearTimer]);

  // Reset game
  const resetGame = useCallback(() => {
    clearTimer();
    setGamePhase(GamePhase.SELECTION);
    setTargetSquare('');
    setUserInput('');
    setIsCorrect(null);
    setCurrentRound(0);
    setScore(0);
    setStreak(0);
    setCorrectAnswers(0);
  }, [clearTimer]);

  // Cleanup
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  // Square highlighting
  const getSquareStyles = useCallback(() => {
    const styles: { [square: string]: React.CSSProperties } = {};
    
    if (!targetSquare || gamePhase === GamePhase.SELECTION || gamePhase === GamePhase.RESULTS) {
      return styles;
    }
    
    if (gamePhase === GamePhase.FEEDBACK) {
      styles[targetSquare] = {
        backgroundColor: isCorrect ? '#4CAF5080' : '#f4433680',
        border: `3px solid ${isCorrect ? '#4CAF50' : '#f44336'}`,
        borderRadius: '6px',
        boxSizing: 'border-box'
      };
    } else if (gamePhase === GamePhase.PLAYING) {
      styles[targetSquare] = {
        backgroundColor: '#EAB308DD',
        border: '3px solid #EAB308',
        borderRadius: '6px',
        boxSizing: 'border-box',
        boxShadow: '0 0 20px #EAB30880'
      };
    }
    
    return styles;
  }, [targetSquare, gamePhase, isCorrect]);

  // Calculate accuracy
  const getAccuracy = () => {
    if (currentRound === 0) return 0;
    return Math.round((correctAnswers / (currentRound + 1)) * 100);
  };

  // Format time
  const formatTime = (ms: number) => {
    return (ms / 1000).toFixed(1) + 's';
  };

  // Format time for display (no decimal)
  const formatTimeSimple = (ms: number) => {
    return (ms / 1000).toFixed(0) + 's';
  };

  // Get board size
  const getBoardSize = () => {
    return isMobile ? '360px' : '480px';
  };

  if (!isMounted) return null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: isMobile ? 'flex-start' : 'flex-start',
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      padding: '15px',
      paddingTop: isMobile ? '10px' : '30px',
      boxSizing: 'border-box'
    }}>

      {isMobile ? (
        // MOBILE LAYOUT
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '420px',
          padding: '0 8px'
        }}>
          
          {/* Score Card */}
          {gamePhase !== GamePhase.SELECTION && (
            <div style={{
              width: '100%',
              backgroundColor: '#2a2a2a',
              borderRadius: '8px',
              padding: '8px 12px',
              marginBottom: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
            }}>
              <div style={{ 
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                gap: '12px',
                fontSize: '11px',
                fontWeight: '500',
                textAlign: 'center'
              }}>
                <div>
                  <div style={{ color: '#ccc', fontSize: '9px' }}>Score</div>
                  <div style={{ fontWeight: 'bold', color: '#e5e5e5', fontSize: '12px' }}>{score}</div>
                </div>
                <div>
                  <div style={{ color: '#ccc', fontSize: '9px' }}>Streak</div>
                  <div style={{ fontWeight: 'bold', color: '#e5e5e5', fontSize: '12px' }}>{streak}</div>
                </div>
                <div>
                  <div style={{ color: '#ccc', fontSize: '9px' }}>Round</div>
                  <div style={{ fontWeight: 'bold', color: '#e5e5e5', fontSize: '12px' }}>{currentRound + 1}/{totalRounds}</div>
                </div>
                <div>
                  <div style={{ color: '#ccc', fontSize: '9px' }}>Accuracy</div>
                  <div style={{ fontWeight: 'bold', color: '#e5e5e5', fontSize: '12px' }}>{getAccuracy()}%</div>
                </div>
              </div>
            </div>
          )}

          {/* Timer - Outside board for mobile */}
          {gamePhase === GamePhase.PLAYING && (
            <div style={{ 
              width: '100%', 
              marginBottom: '8px',
              textAlign: 'center'
            }}>
              <div style={{
                display: 'inline-block',
                backgroundColor: timeLeft < 1000 ? '#f44336' : '#2a2a2a',
                padding: '6px 20px',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}>
                Time: {formatTime(timeLeft)}
              </div>
            </div>
          )}

          {/* Chessboard */}
          <div style={{
            width: getBoardSize(),
            height: getBoardSize(),
            border: '2px solid #333',
            borderRadius: '6px',
            overflow: 'hidden',
            marginBottom: '16px'
          }}>
            <Chessboard 
              id="coordinate-vision-board"
              position={'start'}
              arePiecesDraggable={false}
              customSquareStyles={getSquareStyles()}
              animationDuration={0}
              showBoardNotation={true}
            />
          </div>

          {/* Controls */}
          {gamePhase === GamePhase.SELECTION && (
            <div style={{
              width: '100%',
              backgroundColor: '#2a2a2a',
              borderRadius: '6px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', marginBottom: '8px', color: '#ccc' }}>
                  Select Difficulty:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  {Object.entries(difficultyPresets).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => setCurrentDifficulty(key as keyof typeof difficultyPresets)}
                      style={{
                        padding: '8px',
                        fontSize: '11px',
                        borderRadius: '3px',
                        backgroundColor: currentDifficulty === key ? '#EAB308' : '#333',
                        color: currentDifficulty === key ? '#000' : 'white',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {preset.label} ({formatTimeSimple(preset.timePerSquare)})
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={startGame}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  borderRadius: '4px',
                  backgroundColor: '#EAB308',
                  color: '#000',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Start Training
              </button>
            </div>
          )}

          {/* Input */}
          {gamePhase === GamePhase.PLAYING && (
            <div style={{ width: '100%' }}>
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit();
                  }
                }}
                placeholder="Type the square (e.g., e4)"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '16px',
                  backgroundColor: '#333',
                  color: '#fff',
                  border: '2px solid #444',
                  borderRadius: '4px',
                  outline: 'none',
                  textAlign: 'center',
                  fontFamily: 'monospace',
                  boxSizing: 'border-box',
                  WebkitAppearance: 'none'
                }}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                autoFocus
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px' }}>
                <button
                  onClick={handleSubmit}
                  style={{
                    padding: '12px',
                    fontSize: '14px',
                    borderRadius: '4px',
                    backgroundColor: '#EAB308',
                    color: '#000',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Submit
                </button>
                <button
                  onClick={quitGame}
                  style={{
                    padding: '12px',
                    fontSize: '14px',
                    borderRadius: '4px',
                    backgroundColor: '#f44336',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Quit
                </button>
              </div>
            </div>
          )}

          {/* Feedback */}
          {gamePhase === GamePhase.FEEDBACK && (
            <div style={{
              width: '100%',
              backgroundColor: '#2a2a2a',
              borderRadius: '6px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: isCorrect ? '#4CAF50' : '#f44336',
                marginBottom: '8px'
              }}>
                {isCorrect ? 'âœ" Correct!' : 'âœ— Incorrect'}
              </div>
              <div style={{ fontSize: '14px', color: '#ccc' }}>
                The square was: <span style={{ fontWeight: 'bold', color: '#fff' }}>{targetSquare.toUpperCase()}</span>
              </div>
              {isCorrect && (
                <div style={{ fontSize: '12px', color: '#EAB308', marginTop: '4px' }}>
                  Time: {formatTime(responseTime)}
                </div>
              )}
            </div>
          )}

          {/* Results */}
          {gamePhase === GamePhase.RESULTS && (
            <div style={{
              width: '100%',
              backgroundColor: '#2a2a2a',
              borderRadius: '6px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#4CAF50', marginBottom: '12px' }}>
                Training Complete!
              </div>
              <div style={{ fontSize: '14px', marginBottom: '16px' }}>
                <div>Final Score: {score}</div>
                <div>Accuracy: {correctAnswers}/{totalRounds} ({Math.round((correctAnswers / totalRounds) * 100)}%)</div>
                {bestScore > 0 && <div>Best Score: {bestScore}</div>}
              </div>
              <button
                onClick={startGame}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  borderRadius: '4px',
                  backgroundColor: '#2196F3',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600',
                  marginBottom: '8px'
                }}
              >
                Play Again
              </button>
              <button
                onClick={resetGame}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  borderRadius: '4px',
                  backgroundColor: '#FF9800',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Back to Menu
              </button>
            </div>
          )}
        </div>
      ) : (
        // DESKTOP LAYOUT
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start',
          gap: '25px',
          maxWidth: '900px',
          width: '100%'
        }}>
          
          {/* Left Panel */}
          <div style={{ 
            minWidth: '200px',
            backgroundColor: '#2a2a2a',
            padding: '16px',
            borderRadius: '8px',
            height: 'fit-content'
          }}>
            <h3 style={{ margin: '0 0 12px 0', textAlign: 'center', fontSize: '14px' }}>
              Select Difficulty
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.entries(difficultyPresets).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => setCurrentDifficulty(key as keyof typeof difficultyPresets)}
                  disabled={gamePhase !== GamePhase.SELECTION}
                  style={{
                    padding: '10px 12px',
                    fontSize: '12px',
                    borderRadius: '4px',
                    backgroundColor: currentDifficulty === key ? '#EAB308' : '#333',
                    color: currentDifficulty === key ? '#000' : 'white',
                    border: 'none',
                    cursor: gamePhase === GamePhase.SELECTION ? 'pointer' : 'not-allowed',
                    opacity: gamePhase === GamePhase.SELECTION ? 1 : 0.5
                  }}
                >
                  <div style={{ fontWeight: 'bold' }}>{preset.label} ({formatTimeSimple(preset.timePerSquare)})</div>
                </button>
              ))}
            </div>

            {/* Start Training button aligned with difficulty selector */}
            {gamePhase === GamePhase.SELECTION && (
              <button
                onClick={startGame}
                style={{
                  width: '100%',
                  marginTop: '16px',
                  padding: '12px',
                  fontSize: '14px',
                  borderRadius: '6px',
                  backgroundColor: '#EAB308',
                  color: '#000',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Start Training
              </button>
            )}

            {/* Session Stats */}
            {gamePhase !== GamePhase.SELECTION && (
              <div style={{ marginTop: '16px', fontSize: '11px', color: '#ccc' }}>
                <div style={{ marginBottom: '8px', fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>
                  Session Stats
                </div>
                <div>Score: {score}</div>
                <div>Best: {bestScore}</div>
                <div>Streak: {streak}</div>
                <div>Accuracy: {getAccuracy()}%</div>
                <div>Round: {currentRound + 1}/{totalRounds}</div>
              </div>
            )}
          </div>

          {/* Center - NO BACKGROUND CARD, JUST CONTENT */}
          <div style={{ 
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            {/* Timer - Outside board */}
            {gamePhase === GamePhase.PLAYING && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{
                  backgroundColor: timeLeft < 1000 ? '#f44336' : '#2a2a2a',
                  padding: '8px 24px',
                  borderRadius: '4px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}>
                  Time: {formatTime(timeLeft)}
                </div>
              </div>
            )}

            {/* Progress Bar */}
            {gamePhase !== GamePhase.SELECTION && gamePhase !== GamePhase.RESULTS && (
              <div style={{ width: getBoardSize(), marginBottom: '12px' }}>
                <div style={{ 
                  width: '100%', 
                  height: '6px', 
                  backgroundColor: '#333', 
                  borderRadius: '3px', 
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${((currentRound + 1) / totalRounds) * 100}%`,
                    height: '100%',
                    backgroundColor: '#EAB308',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            )}

            {/* Chessboard - Clean, no extra background */}
            <div style={{
              width: getBoardSize(),
              height: getBoardSize(),
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
            }}>
              <Chessboard 
                id="coordinate-vision-board"
                position={'start'}
                arePiecesDraggable={false}
                customSquareStyles={getSquareStyles()}
                animationDuration={0}
                showBoardNotation={true}
              />
            </div>

            {/* Input */}
            {gamePhase === GamePhase.PLAYING && (
              <div style={{ width: '100%', maxWidth: '400px' }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSubmit();
                    }
                  }}
                  placeholder="Type the square name (e.g., e4)"
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '18px',
                    backgroundColor: '#2a2a2a',
                    color: '#fff',
                    border: '2px solid #333',
                    borderRadius: '6px',
                    outline: 'none',
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    boxSizing: 'border-box'
                  }}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  autoFocus
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
                  <button
                    onClick={handleSubmit}
                    style={{
                      padding: '12px',
                      fontSize: '14px',
                      borderRadius: '4px',
                      backgroundColor: '#EAB308',
                      color: '#000',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Submit
                  </button>
                  <button
                    onClick={quitGame}
                    style={{
                      padding: '12px',
                      fontSize: '14px',
                      borderRadius: '4px',
                      backgroundColor: '#f44336',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Quit
                  </button>
                </div>
              </div>
            )}

            {/* Feedback */}
            {gamePhase === GamePhase.FEEDBACK && (
              <div style={{
                backgroundColor: '#2a2a2a',
                borderRadius: '6px',
                padding: '20px',
                textAlign: 'center',
                maxWidth: '400px',
                width: '100%'
              }}>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: isCorrect ? '#4CAF50' : '#f44336',
                  marginBottom: '12px'
                }}>
                  {isCorrect ? 'âœ" Correct!' : 'âœ— Incorrect'}
                </div>
                <div style={{ fontSize: '16px', color: '#ccc' }}>
                  The square was: <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '18px' }}>
                    {targetSquare.toUpperCase()}
                  </span>
                </div>
                {isCorrect && (
                  <div style={{ fontSize: '14px', color: '#EAB308', marginTop: '8px' }}>
                    Response time: {formatTime(responseTime)}
                  </div>
                )}
              </div>
            )}

            {/* Results */}
            {gamePhase === GamePhase.RESULTS && (
              <div style={{
                backgroundColor: '#2a2a2a',
                borderRadius: '8px',
                padding: '30px',
                textAlign: 'center',
                maxWidth: '400px',
                margin: 'auto'
              }}>
                <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#4CAF50', marginBottom: '16px' }}>
                  Training Complete!
                </div>
                <div style={{ fontSize: '16px', marginBottom: '20px' }}>
                  <div style={{ marginBottom: '8px' }}>Final Score: {score}</div>
                  <div style={{ marginBottom: '8px' }}>Accuracy: {correctAnswers}/{totalRounds} ({Math.round((correctAnswers / totalRounds) * 100)}%)</div>
                  {bestScore > 0 && <div>Best Score: {bestScore}</div>}
                </div>
                <button
                  onClick={startGame}
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '16px',
                    borderRadius: '6px',
                    backgroundColor: '#2196F3',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600',
                    marginBottom: '10px'
                  }}
                >
                  Play Again
                </button>
                <button
                  onClick={resetGame}
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontSize: '16px',
                    borderRadius: '6px',
                    backgroundColor: '#FF9800',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Back to Menu
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}