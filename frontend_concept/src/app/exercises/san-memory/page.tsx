'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// Game phases for verbal memory exercise
enum GamePhase {
  SELECTION = 'selection',
  STUDY = 'study',
  RECALL = 'recall',
  RESULTS = 'results'
}

// Difficulty presets - affects study time
const difficultyPresets = {
  beginner: { studyTime: 10000, label: 'Beginner' },
  club: { studyTime: 7000, label: 'Club' },
  expert: { studyTime: 5000, label: 'Expert' },
  master: { studyTime: 3000, label: 'Master' }
};

// Opening moves - stored once, sequences generated dynamically
// Matching the client's original 3 openings from spatial memory
const openings = {
  'Ruy Lopez': ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7', 'Re1', 'b5', 'Bb3', 'd6', 'c3', 'O-O', 'h3', 'Nb8', 'd4', 'Nbd7'],
  "King's Indian": ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6', 'Nf3', 'O-O', 'Be2', 'e5', 'O-O', 'Nc6', 'd5', 'Ne7', 'b4', 'Nh5', 'Re1', 'f5'],
  "Queen's Gambit": ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'cxd5', 'exd5', 'Bg5', 'Be7', 'e3', 'O-O', 'Bd3', 'Nbd7', 'Qc2', 'Re8', 'Nf3', 'Nf8', 'O-O', 'c6']
};

export default function SanMemoryPage() {
  // Screen size detection
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Core game state
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.SELECTION);
  const [currentOpening, setCurrentOpening] = useState<keyof typeof openings>('Ruy Lopez');
  const [currentLevel, setCurrentLevel] = useState(0); // 0 = 2 moves, 1 = 3 moves, etc.
  const [currentDifficulty, setCurrentDifficulty] = useState<keyof typeof difficultyPresets>('beginner');
  
  // Custom settings
  const [customStudyTime, setCustomStudyTime] = useState(10);
  
  // User input and validation
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Scoring
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(1);
  
  // Timing
  const [timeLeft, setTimeLeft] = useState(0);
  const studyTimerRef = useRef<NodeJS.Timeout | null>(null);
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

  // Update settings when preset changes
  useEffect(() => {
    const preset = difficultyPresets[currentDifficulty];
    setCustomStudyTime(preset.studyTime / 1000);
  }, [currentDifficulty]);

  // Focus input when recall phase starts
  useEffect(() => {
    if (gamePhase === GamePhase.RECALL && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gamePhase]);

  // Cleanup timers
  const clearAllTimers = useCallback(() => {
    if (studyTimerRef.current) {
      clearTimeout(studyTimerRef.current);
      studyTimerRef.current = null;
    }
  }, []);

  // Generate sequence dynamically - no more hardcoded strings!
  const getCurrentSequence = useCallback(() => {
    const moves = openings[currentOpening];
    const moveCount = (currentLevel + 1) * 2; // Level 0 = 2 moves, Level 1 = 4 moves, etc.
    const sequenceMoves = moves.slice(0, Math.min(moveCount, moves.length));
    return sequenceMoves.join(' ');
  }, [currentOpening, currentLevel]);

  // Get number of moves in current sequence
  const getMoveCount = useCallback(() => {
    const moves = openings[currentOpening];
    const moveCount = (currentLevel + 1) * 2;
    return Math.min(moveCount, moves.length);
  }, [currentOpening, currentLevel]);

  // Get max level for current opening
  const getMaxLevel = useCallback(() => {
    return Math.floor(openings[currentOpening].length / 2) - 1;
  }, [currentOpening]);

  // Start a new game
  const startNewGame = useCallback(() => {
    clearAllTimers();
    setCurrentLevel(0);
    setUserInput('');
    setIsCorrect(null);
    setRound(1);
    setStreak(0);
    setScore(0);
    startStudyPhase();
  }, []);

  // Start study phase
  const startStudyPhase = useCallback(() => {
    setGamePhase(GamePhase.STUDY);
    setUserInput('');
    setIsCorrect(null);
    setTimeLeft(customStudyTime);
    
    // Countdown timer
    const countdown = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          setGamePhase(GamePhase.RECALL);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    studyTimerRef.current = countdown;
  }, [customStudyTime]);

  // Handle user input submission
  const handleSubmit = useCallback(() => {
    const correctSequence = getCurrentSequence();
    const userSequence = userInput.trim();
    
    // Normalize: remove extra spaces, lowercase
    const normalizedCorrect = correctSequence.toLowerCase().replace(/\s+/g, ' ');
    const normalizedUser = userSequence.toLowerCase().replace(/\s+/g, ' ');
    
    const correct = normalizedUser === normalizedCorrect;
    setIsCorrect(correct);
    setGamePhase(GamePhase.RESULTS);
    
    if (correct) {
      const points = getMoveCount() * 10;
      setScore(prev => {
        const newScore = prev + points;
        setBestScore(current => Math.max(current, newScore));
        return newScore;
      });
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    
    setRound(prev => prev + 1);
  }, [userInput, getCurrentSequence, getMoveCount]);

  // Continue to next level
  const continueGame = useCallback(() => {
    if (isCorrect) {
      const maxLevel = getMaxLevel();
      if (currentLevel < maxLevel) {
        setCurrentLevel(prev => prev + 1);
        startStudyPhase();
      } else {
        // Completed all levels for this opening!
        setGamePhase(GamePhase.SELECTION);
      }
    } else {
      // Game over - restart from beginning
      setCurrentLevel(0);
      setScore(0);
      setRound(1);
      setGamePhase(GamePhase.SELECTION);
    }
  }, [isCorrect, currentLevel, getMaxLevel, startStudyPhase]);

  // Reset to selection
  const resetToSelection = useCallback(() => {
    clearAllTimers();
    setGamePhase(GamePhase.SELECTION);
    setCurrentLevel(0);
    setUserInput('');
    setIsCorrect(null);
  }, [clearAllTimers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  // Format sequence for display (adds visual breaks for readability)
  const formatSequenceForDisplay = (sequence: string) => {
    const moves = sequence.split(' ');
    const formatted = [];
    for (let i = 0; i < moves.length; i += 2) {
      if (i > 0) formatted.push(' ');
      formatted.push(moves[i]);
      if (moves[i + 1]) {
        formatted.push(' ');
        formatted.push(moves[i + 1]);
      }
      if (i < moves.length - 2) formatted.push(' ·'); // Visual separator
    }
    return formatted.join('');
  };

  // Slider styles
  const sliderStyles: React.CSSProperties = {
    width: '100%',
    height: '8px',
    borderRadius: '4px',
    background: '#333',
    outline: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    WebkitAppearance: 'none',
    appearance: 'none'
  };

  const sliderThumbStyles = `
    input[type="range"]::-webkit-slider-thumb {
      appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #EAB308;
      cursor: pointer;
      border: 2px solid #1a1a1a;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    input[type="range"]::-webkit-slider-thumb:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 8px rgba(234, 179, 8, 0.4);
    }
    
    input[type="range"]::-moz-range-thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #EAB308;
      cursor: pointer;
      border: 2px solid #1a1a1a;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    input[type="range"]:hover {
      background: #444;
    }
  `;

  // Mobile components - COMPRESSED VERSION
  const MobileScoreCard = () => (
    <div style={{
      width: '100%',
      backgroundColor: '#2a2a2a',
      borderRadius: '6px',
      padding: '6px 10px',
      marginBottom: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gap: '10px',
        fontSize: '10px',
        fontWeight: '500',
        textAlign: 'center'
      }}>
        <div>
          <div style={{ color: '#ccc', fontSize: '8px' }}>Score</div>
          <div style={{ fontWeight: 'bold', color: '#e5e5e5', fontSize: '11px' }}>{score}</div>
        </div>
        <div>
          <div style={{ color: '#ccc', fontSize: '8px' }}>Best</div>
          <div style={{ fontWeight: 'bold', color: '#e5e5e5', fontSize: '11px' }}>{bestScore}</div>
        </div>
        <div>
          <div style={{ color: '#ccc', fontSize: '8px' }}>Moves</div>
          <div style={{ fontWeight: 'bold', color: '#e5e5e5', fontSize: '11px' }}>{getMoveCount()}</div>
        </div>
        <div>
          <div style={{ color: '#ccc', fontSize: '8px' }}>Round</div>
          <div style={{ fontWeight: 'bold', color: '#e5e5e5', fontSize: '11px' }}>{round}</div>
        </div>
      </div>
    </div>
  );

  if (!isMounted) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: isMobile ? 'flex-start' : 'flex-start',
        minHeight: '100vh',
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        padding: isMobile ? '10px' : '15px',
        paddingTop: isMobile ? '10px' : '45px',
        boxSizing: 'border-box'
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: sliderThumbStyles }} />

      {isMobile ? (
        // Mobile Layout - COMPRESSED to fit on screen
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '420px',
          padding: '0 6px'
        }}>
          
          <MobileScoreCard />

          {/* Opening Selection - Compressed */}
          <div style={{
            width: '100%',
            backgroundColor: '#2a2a2a',
            borderRadius: '6px',
            padding: '8px',
            marginBottom: '8px'
          }}>
            <h3 style={{ margin: '0 0 6px 0', textAlign: 'center', fontSize: '11px', color: '#ccc' }}>
              Select Opening
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 1fr', 
              gap: '6px'
            }}>
              {Object.keys(openings).map(opening => (
                <button
                  key={opening}
                  onClick={() => setCurrentOpening(opening as keyof typeof openings)}
                  disabled={gamePhase !== GamePhase.SELECTION}
                  style={{
                    padding: '10px 6px',
                    fontSize: '10px',
                    borderRadius: '3px',
                    backgroundColor: currentOpening === opening ? '#EAB308' : '#333',
                    color: currentOpening === opening ? '#000' : 'white',
                    border: 'none',
                    cursor: gamePhase !== GamePhase.SELECTION ? 'not-allowed' : 'pointer',
                    opacity: gamePhase !== GamePhase.SELECTION ? 0.5 : 1,
                    transition: 'all 0.2s ease',
                    textAlign: 'center',
                    minHeight: '38px'
                  }}
                >
                  {opening}
                </button>
              ))}
            </div>
          </div>

          {/* Game Area - Compressed height */}
          <div style={{
            width: '100%',
            minHeight: '180px',
            backgroundColor: '#2a2a2a',
            borderRadius: '8px',
            padding: '16px 12px',
            marginBottom: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {gamePhase === GamePhase.SELECTION && (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '18px', marginBottom: '6px' }}>Verbal Memory</h2>
                <p style={{ fontSize: '12px', color: '#ccc', marginBottom: '10px' }}>
                  Memorize chess notation sequences
                </p>
                <p style={{ fontSize: '11px', color: '#999' }}>
                  Starting with {getMoveCount()} moves
                </p>
              </div>
            )}

            {gamePhase === GamePhase.STUDY && (
              <div style={{ textAlign: 'center', width: '100%' }}>
                <div style={{ fontSize: '12px', color: '#EAB308', marginBottom: '12px' }}>
                  Memorize this sequence:
                </div>
                <div style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold',
                  fontFamily: 'monospace',
                  color: '#fff',
                  lineHeight: '1.6',
                  padding: '10px',
                  backgroundColor: '#1e1e1e',
                  borderRadius: '6px',
                  wordBreak: 'break-word',
                  width: '100%'
                }}>
                  {getCurrentSequence()}
                </div>
                <div style={{ 
                  marginTop: '14px',
                  fontSize: '14px',
                  color: '#EAB308',
                  fontWeight: 'bold'
                }}>
                  Time: {timeLeft}s
                </div>
                <div style={{
                  width: '100%',
                  height: '3px',
                  backgroundColor: '#333',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  margin: '6px auto'
                }}>
                  <div style={{
                    width: `${(timeLeft / customStudyTime) * 100}%`,
                    height: '100%',
                    backgroundColor: '#EAB308',
                    transition: 'width 1s linear'
                  }} />
                </div>
              </div>
            )}

            {gamePhase === GamePhase.RECALL && (
              <div style={{ width: '100%' }}>
                <div style={{ fontSize: '12px', color: '#ccc', marginBottom: '10px', textAlign: 'center' }}>
                  Enter the sequence from memory:
                </div>
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
                  placeholder="Type the moves (e.g. e4 e5 Nf3)"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '15px',
                    backgroundColor: '#333',
                    color: '#fff',
                    border: '2px solid #444',
                    borderRadius: '4px',
                    outline: 'none',
                    fontFamily: 'monospace',
                    WebkitAppearance: 'none',
                    boxSizing: 'border-box'
                  }}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  autoFocus
                />
                <div style={{ 
                  fontSize: '10px', 
                  color: '#888', 
                  marginTop: '4px',
                  textAlign: 'center'
                }}>
                  No move numbers needed, just the moves
                </div>
                <button
                  onClick={handleSubmit}
                  style={{
                    width: '100%',
                    marginTop: '10px',
                    padding: '12px',
                    fontSize: '13px',
                    borderRadius: '4px',
                    backgroundColor: '#EAB308',
                    color: '#000',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600',
                    minHeight: '42px'
                  }}
                >
                  Submit
                </button>
              </div>
            )}

            {gamePhase === GamePhase.RESULTS && (
              <div style={{ textAlign: 'center', width: '100%' }}>
                <div style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: isCorrect ? '#4CAF50' : '#f44336'
                }}>
                  {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                </div>
                {isCorrect && (
                  <div style={{ fontSize: '14px', color: '#EAB308', marginBottom: '6px' }}>
                    +{getMoveCount() * 10} points
                  </div>
                )}
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#999', marginBottom: '4px' }}>
                    Correct answer:
                  </div>
                  <div style={{ 
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    color: '#4CAF50',
                    backgroundColor: '#1e1e1e',
                    padding: '8px',
                    borderRadius: '4px',
                    wordBreak: 'break-word'
                  }}>
                    {getCurrentSequence()}
                  </div>
                </div>
                {!isCorrect && userInput && (
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontSize: '10px', color: '#999', marginBottom: '4px' }}>
                      Your answer:
                    </div>
                    <div style={{ 
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      color: '#f44336',
                      backgroundColor: '#1e1e1e',
                      padding: '8px',
                      borderRadius: '4px',
                      wordBreak: 'break-word'
                    }}>
                      {userInput}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Training Controls - COMPRESSED */}
          <div style={{
            width: '100%',
            backgroundColor: '#2a2a2a',
            borderRadius: '6px',
            padding: '8px',
            marginTop: '8px'
          }}>
            <h3 style={{ margin: '0 0 6px 0', textAlign: 'center', fontSize: '11px', color: '#ccc' }}>
              Training Controls
            </h3>
            
            {/* Difficulty Presets - More compact */}
            <div style={{ marginBottom: '6px' }}>
              <div style={{ fontSize: '9px', marginBottom: '4px', color: '#ccc', textAlign: 'center' }}>
                Difficulty:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                {Object.entries(difficultyPresets).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => setCurrentDifficulty(key as keyof typeof difficultyPresets)}
                    disabled={gamePhase !== GamePhase.SELECTION}
                    style={{
                      padding: '8px 4px',
                      fontSize: '9px',
                      borderRadius: '3px',
                      backgroundColor: currentDifficulty === key ? '#EAB308' : '#333',
                      color: currentDifficulty === key ? '#000' : 'white',
                      border: 'none',
                      cursor: gamePhase !== GamePhase.SELECTION ? 'not-allowed' : 'pointer',
                      opacity: gamePhase !== GamePhase.SELECTION ? 0.5 : 1,
                      textAlign: 'center',
                      minHeight: '30px'
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Phase-specific controls - Compact */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '6px',
              minHeight: '38px',
              justifyContent: 'center'
            }}>
              {gamePhase === GamePhase.SELECTION && (
                <button 
                  onClick={startNewGame}
                  style={{ 
                    padding: '10px 12px',
                    fontSize: '12px',
                    borderRadius: '4px',
                    backgroundColor: '#EAB308', 
                    color: '#000',
                    border: 'none', 
                    cursor: 'pointer',
                    fontWeight: '600',
                    minHeight: '38px'
                  }}
                >
                  Start Training
                </button>
              )}

              {gamePhase === GamePhase.RESULTS && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <button 
                    onClick={continueGame}
                    style={{ 
                      padding: '8px 6px',
                      fontSize: '11px',
                      borderRadius: '3px',
                      backgroundColor: isCorrect ? '#4CAF50' : '#2196F3', 
                      color: 'white', 
                      border: 'none', 
                      cursor: 'pointer',
                      minHeight: '36px'
                    }}
                  >
                    {isCorrect ? 
                      (currentLevel < getMaxLevel() ? 'Next Level' : 'Complete!') : 
                      'Try Again'
                    }
                  </button>
                  <button 
                    onClick={resetToSelection}
                    style={{ 
                      padding: '8px 6px',
                      fontSize: '11px',
                      borderRadius: '3px',
                      backgroundColor: '#FF9800', 
                      color: 'white', 
                      border: 'none', 
                      cursor: 'pointer',
                      minHeight: '36px'
                    }}
                  >
                    New Game
                  </button>
                </div>
              )}
            </div>

            {/* Progress indicator - More compact */}
            {gamePhase !== GamePhase.SELECTION && (
              <div style={{ 
                marginTop: '6px',
                fontSize: '9px',
                color: '#ccc',
                textAlign: 'center'
              }}>
                Level {currentLevel + 1} of {getMaxLevel() + 1}
              </div>
            )}
          </div>
        </div>
      ) : (
        // Desktop Layout - FIXED SPACING
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start',
          gap: '25px',
          maxWidth: '1000px',
          width: '100%'
        }}>
          
          {/* Left Panel - Opening Selection */}
          <div style={{ 
            minWidth: '180px',
            backgroundColor: '#2a2a2a',
            padding: '16px',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ margin: '0 0 12px 0', textAlign: 'center', fontSize: '14px' }}>Select Opening</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.keys(openings).map(opening => (
                <button
                  key={opening}
                  onClick={() => setCurrentOpening(opening as keyof typeof openings)}
                  disabled={gamePhase !== GamePhase.SELECTION}
                  style={{
                    padding: '10px 12px',
                    fontSize: '12px',
                    borderRadius: '4px',
                    backgroundColor: currentOpening === opening ? '#EAB308' : '#333',
                    color: currentOpening === opening ? '#000' : 'white',
                    border: 'none',
                    cursor: gamePhase !== GamePhase.SELECTION ? 'not-allowed' : 'pointer',
                    opacity: gamePhase !== GamePhase.SELECTION ? 0.5 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {opening}
                </button>
              ))}
            </div>

            <div style={{ marginTop: '16px', fontSize: '11px', color: '#ccc' }}>
              <div>Selected:</div>
              <div style={{ color: '#fff', marginBottom: '4px', fontSize: '10px' }}>{currentOpening}</div>
              <div>Total Moves: {openings[currentOpening].length}</div>
              <div>Max Level: {getMaxLevel() + 1}</div>
              <div style={{ marginTop: '8px', fontSize: '10px', color: '#EAB308' }}>
                Current: {getMoveCount()} moves
              </div>
            </div>
          </div>

          {/* Center - Game Area */}
          <div style={{ 
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            {/* Stats Card */}
            <div style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '8px',
              padding: '12px 20px',
              marginBottom: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              width: '100%',
              maxWidth: '500px'
            }}>
              <div style={{ 
                display: 'flex', 
                gap: '24px',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: '500'
              }}>
                <span>Score: <span style={{ fontWeight: 'bold', color: '#e5e5e5' }}>{score}</span></span>
                <span>Best: <span style={{ fontWeight: 'bold', color: '#e5e5e5' }}>{bestScore}</span></span>
                <span>Streak: <span style={{ fontWeight: 'bold', color: '#e5e5e5' }}>{streak}</span></span>
                <span>Moves: <span style={{ fontWeight: 'bold', color: '#e5e5e5' }}>{getMoveCount()}</span></span>
                <span>Round: <span style={{ fontWeight: 'bold', color: '#e5e5e5' }}>{round}</span></span>
              </div>
            </div>

            {/* Main Game Display */}
            <div style={{
              width: '100%',
              maxWidth: '500px',
              minHeight: '300px',
              backgroundColor: '#2a2a2a',
              borderRadius: '8px',
              padding: '30px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {gamePhase === GamePhase.SELECTION && (
                <div style={{ textAlign: 'center' }}>
                  <h1 style={{ fontSize: '36px', marginBottom: '16px' }}>Verbal Memory</h1>
                  <p style={{ fontSize: '16px', color: '#ccc', marginBottom: '24px' }}>
                    Memorize progressively longer chess notation sequences
                  </p>
                  <p style={{ fontSize: '14px', color: '#999' }}>
                    Starting with {getMoveCount()} moves from {currentOpening}
                  </p>
                </div>
              )}

              {gamePhase === GamePhase.STUDY && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', color: '#EAB308', marginBottom: '24px' }}>
                    Memorize this sequence:
                  </div>
                  <div style={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold',
                    fontFamily: 'monospace',
                    color: '#fff',
                    lineHeight: '1.8',
                    padding: '20px',
                    backgroundColor: '#1e1e1e',
                    borderRadius: '6px',
                    minWidth: '300px'
                  }}>
                    {formatSequenceForDisplay(getCurrentSequence())}
                  </div>
                  <div style={{ 
                    marginTop: '30px',
                    fontSize: '20px',
                    color: '#EAB308',
                    fontWeight: 'bold'
                  }}>
                    Time: {timeLeft}s
                  </div>
                  <div style={{
                    width: '200px',
                    height: '6px',
                    backgroundColor: '#333',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    margin: '10px auto'
                  }}>
                    <div style={{
                      width: `${(timeLeft / customStudyTime) * 100}%`,
                      height: '100%',
                      backgroundColor: '#EAB308',
                      transition: 'width 1s linear'
                    }} />
                  </div>
                </div>
              )}

              {gamePhase === GamePhase.RECALL && (
                <div style={{ width: '100%', maxWidth: '400px' }}>
                  <div style={{ fontSize: '16px', color: '#ccc', marginBottom: '16px', textAlign: 'center' }}>
                    Enter the sequence from memory:
                  </div>
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
                    placeholder="Type the moves (e.g. e4 e5 Nf3 Nc6)"
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: '18px',
                      backgroundColor: '#333',
                      color: '#fff',
                      border: '2px solid #444',
                      borderRadius: '4px',
                      outline: 'none',
                      fontFamily: 'monospace',
                      transition: 'border-color 0.2s'
                    }}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    autoFocus
                  />
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#888', 
                    marginTop: '8px',
                    textAlign: 'center'
                  }}>
                    No move numbers needed, just the moves separated by spaces
                  </div>
                  <button
                    onClick={handleSubmit}
                    style={{
                      width: '100%',
                      marginTop: '16px',
                      padding: '12px',
                      fontSize: '14px',
                      borderRadius: '4px',
                      backgroundColor: '#EAB308',
                      color: '#000',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'transform 0.1s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    Submit
                  </button>
                </div>
              )}

              {gamePhase === GamePhase.RESULTS && (
                <div style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}>
                  <div style={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold',
                    marginBottom: '16px',
                    color: isCorrect ? '#4CAF50' : '#f44336'
                  }}>
                    {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                  </div>
                  {isCorrect && (
                    <div style={{ fontSize: '18px', color: '#EAB308', marginBottom: '12px' }}>
                      +{getMoveCount() * 10} points
                    </div>
                  )}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
                      Correct answer:
                    </div>
                    <div style={{ 
                      fontSize: '18px',
                      fontFamily: 'monospace',
                      color: '#4CAF50',
                      backgroundColor: '#1e1e1e',
                      padding: '12px',
                      borderRadius: '4px'
                    }}>
                      {getCurrentSequence()}
                    </div>
                  </div>
                  {!isCorrect && userInput && (
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
                        Your answer:
                      </div>
                      <div style={{ 
                        fontSize: '18px',
                        fontFamily: 'monospace',
                        color: '#f44336',
                        backgroundColor: '#1e1e1e',
                        padding: '12px',
                        borderRadius: '4px'
                      }}>
                        {userInput}
                      </div>
                    </div>
                  )}
                  {currentLevel === getMaxLevel() && isCorrect && (
                    <div style={{
                      marginTop: '16px',
                      padding: '12px',
                      backgroundColor: '#2a5a2a',
                      borderRadius: '4px',
                      fontSize: '14px',
                      color: '#4CAF50'
                    }}>
                      🎉 Completed all levels for {currentOpening}!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Training Controls - FIXED SPACING */}
          <div style={{ 
            minWidth: '220px',
            backgroundColor: '#2a2a2a',
            padding: '16px',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ margin: '0 0 12px 0', textAlign: 'center', fontSize: '14px' }}>Training Controls</h3>
            
            {/* Difficulty Presets */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', marginBottom: '6px', color: '#ccc' }}>Difficulty Presets:</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                {Object.entries(difficultyPresets).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => setCurrentDifficulty(key as keyof typeof difficultyPresets)}
                    disabled={gamePhase !== GamePhase.SELECTION}
                    style={{
                      padding: '6px 8px',
                      fontSize: '10px',
                      borderRadius: '3px',
                      backgroundColor: currentDifficulty === key ? '#EAB308' : '#333',
                      color: currentDifficulty === key ? '#000' : 'white',
                      border: 'none',
                      cursor: gamePhase !== GamePhase.SELECTION ? 'not-allowed' : 'pointer',
                      opacity: gamePhase !== GamePhase.SELECTION ? 0.5 : 1
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Settings */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', marginBottom: '8px', color: '#ccc' }}>Custom Settings:</div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'center', fontSize: '10px', marginBottom: '6px' }}>
                  <span>Study Time: {customStudyTime}s</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="15"
                  value={customStudyTime}
                  onChange={(e) => setCustomStudyTime(parseInt(e.target.value))}
                  disabled={gamePhase !== GamePhase.SELECTION}
                  style={{
                    ...sliderStyles,
                    opacity: gamePhase !== GamePhase.SELECTION ? 0.5 : 1,
                    cursor: gamePhase !== GamePhase.SELECTION ? 'not-allowed' : 'pointer'
                  }}
                />
              </div>
            </div>

            {/* Phase-specific controls */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '8px',
              minHeight: '60px',
              justifyContent: 'center'
            }}>
              {gamePhase === GamePhase.SELECTION && (
                <button 
                  onClick={startNewGame}
                  style={{ 
                    padding: '12px 16px', 
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

              {gamePhase === GamePhase.RESULTS && (
                <>
                  <button 
                    onClick={continueGame}
                    style={{ 
                      padding: '10px 12px', 
                      fontSize: '12px', 
                      borderRadius: '4px', 
                      backgroundColor: isCorrect ? '#4CAF50' : '#2196F3', 
                      color: 'white', 
                      border: 'none', 
                      cursor: 'pointer' 
                    }}
                  >
                    {isCorrect ? 
                      (currentLevel < getMaxLevel() ? 'Next Level' : 'Complete!') : 
                      'Try Again'
                    }
                  </button>
                  <button 
                    onClick={resetToSelection}
                    style={{ 
                      padding: '10px 12px', 
                      fontSize: '12px', 
                      borderRadius: '4px', 
                      backgroundColor: '#FF9800', 
                      color: 'white', 
                      border: 'none', 
                      cursor: 'pointer' 
                    }}
                  >
                    New Game
                  </button>
                </>
              )}
            </div>

            {/* Session Info - REDUCED GAP */}
            <div style={{ 
              marginTop: '8px',
              fontSize: '11px', 
              color: '#ccc'
            }}>
              <div style={{ marginBottom: '6px' }}>
                <div>Phase: {gamePhase.charAt(0).toUpperCase() + gamePhase.slice(1)}</div>
                <div>Progress: Level {currentLevel + 1} / {getMaxLevel() + 1}</div>
              </div>
              
              {gamePhase === GamePhase.STUDY && (
                <div style={{ color: '#EAB308', fontSize: '14px', textAlign: 'center', fontWeight: 'bold' }}>
                  Memorizing...
                </div>
              )}

              {gamePhase === GamePhase.RECALL && (
                <div style={{ color: '#4CAF50', fontSize: '14px', textAlign: 'center', fontWeight: 'bold' }}>
                  Input phase
                </div>
              )}

              {/* Instructions */}
              <div style={{ 
                marginTop: '12px',
                padding: '8px',
                backgroundColor: '#1e1e1e',
                borderRadius: '4px',
                fontSize: '10px'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>How to play:</div>
                <div>• Memorize the sequence</div>
                <div>• Type moves without numbers</div>
                <div>• Separate with spaces</div>
                <div>• Case doesn't matter</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}