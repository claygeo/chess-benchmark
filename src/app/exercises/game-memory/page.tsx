'use client';

import { Chess } from 'chess.js';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Chessboard } from 'react-chessboard';

// Game phases for spatial memory exercise
enum GamePhase {
  SELECTION = 'selection',
  SHOWING = 'showing',
  STUDYING = 'studying', 
  RECALL = 'recall',
  RESULTS = 'results'
}

// Difficulty presets - now only affect timing, not move count
const difficultyPresets = {
  beginner: { studyTime: 10000, animationSpeed: 1200, label: 'Beginner' },
  club: { studyTime: 8000, animationSpeed: 1000, label: 'Club' },
  expert: { studyTime: 6000, animationSpeed: 800, label: 'Expert' },
  master: { studyTime: 4000, animationSpeed: 600, label: 'Master' }
};

// Trail interface for piece movement tracking (FROM squares)
interface PieceTrail {
  square: string;
  pieceType: string;
  moveNumber: number;
  opacity: number;
}

// Destination flash interface (TO squares)
interface DestinationFlash {
  square: string;
  moveNumber: number;
  timestamp: number;
}

// Opening definitions - each opening shows ALL its moves
const openings = {
  'Ruy Lopez': ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
  "King's Indian": ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7'],
  "Queen's Gambit": ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6'],
};

// Single bright yellow - like real chess sites
const TRAIL_YELLOW = '#F1C40F'; // Bright, consistent yellow like chess.com

// Piece names for legend (simplified)
const pieceNames = {
  'p': 'Pawns', 'n': 'Knights', 'b': 'Bishops', 
  'r': 'Rooks', 'q': 'Queen', 'k': 'King'
};

export default function GameMemoryPage() {
  // Screen size detection
  const [isMobile, setIsMobile] = useState(false);

  // Core game state
  const [game, setGame] = useState(new Chess());
  const [currentPosition, setCurrentPosition] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.SELECTION);
  
  // Exercise configuration
  const [currentOpening, setCurrentOpening] = useState<keyof typeof openings>('Ruy Lopez');
  const [currentDifficulty, setCurrentDifficulty] = useState<keyof typeof difficultyPresets>('beginner');
  const [customStudyTime, setCustomStudyTime] = useState(10);
  const [customAnimationSpeed, setCustomAnimationSpeed] = useState(1200);
  
  // Move tracking
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [userMoves, setUserMoves] = useState<string[]>([]);
  const [openingMoves, setOpeningMoves] = useState<string[]>(openings['Ruy Lopez']);
  
  // Trail tracking - FROM squares (persistent)
  const [pieceTrails, setPieceTrails] = useState<PieceTrail[]>([]);
  const [currentShowingMove, setCurrentShowingMove] = useState(0);
  const [squareActivity, setSquareActivity] = useState<{ [square: string]: number }>({});
  
  // Destination flashing - TO squares (temporary)
  const [destinationFlashes, setDestinationFlashes] = useState<DestinationFlash[]>([]);
  
  // Timing and feedback
  const [timeLeft, setTimeLeft] = useState(0);
  const [canMakeMove, setCanMakeMove] = useState(false);
  const [lastResult, setLastResult] = useState<'correct' | 'incorrect' | null>(null);
  
  // Scoring and progression
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(1);
  
  // Timers and refs
  const studyTimerRef = useRef<NodeJS.Timeout | null>(null);
  const showingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gameRef = useRef<Chess>(new Chess());
  const isShowingRef = useRef(false); // Prevent multiple executions

  // Trail settings
  const TRAIL_FADE_MOVES = 4; // Trail lasts for 4 moves
  const FLASH_DURATION = 1000; // Flash lasts 1 second

  // Mobile detection hook
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 900); // Set breakpoint to 900px for easier testing
    };

    // Check on mount
    checkScreenSize();

    // Add event listener for resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Clean slider styles
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
    
    input[type="range"]::-webkit-slider-thumb:active {
      transform: scale(1.2);
      box-shadow: 0 4px 12px rgba(234, 179, 8, 0.6);
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
    
    input[type="range"]::-moz-range-thumb:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 8px rgba(234, 179, 8, 0.4);
    }
    
    input[type="range"]::-moz-range-thumb:active {
      transform: scale(1.2);
      box-shadow: 0 4px 12px rgba(234, 179, 8, 0.6);
    }
    
    input[type="range"]:hover {
      background: #444;
    }
    
    input[type="range"]:focus {
      background: #444;
      box-shadow: 0 0 0 2px rgba(234, 179, 8, 0.3);
    }
  `;

  // Cleanup function for timers
  const clearAllTimers = useCallback(() => {
    if (studyTimerRef.current) {
      clearTimeout(studyTimerRef.current);
      studyTimerRef.current = null;
    }
    if (showingTimerRef.current) {
      clearTimeout(showingTimerRef.current);
      showingTimerRef.current = null;
    }
  }, []);

  // Get current settings - always use full opening length
  const getCurrentSettings = useCallback(() => {
    return {
      movesToShow: openingMoves.length,
      studyTime: customStudyTime * 1000,
      animationSpeed: customAnimationSpeed
    };
  }, [openingMoves.length, customStudyTime, customAnimationSpeed]);

  // Get animation speed label
  const getAnimationSpeedLabel = useCallback((speed: number) => {
    return `${speed}ms`;
  }, []);

  // Reset game to starting position - smoother version
  const resetGame = useCallback(() => {
    clearAllTimers();
    isShowingRef.current = false;
    
    const newGame = new Chess();
    gameRef.current = newGame;
    setGame(newGame);
    setCurrentPosition(newGame.fen());
    setCurrentMoveIndex(0);
    setUserMoves([]);
    setCanMakeMove(false);
    setPieceTrails([]);
    setDestinationFlashes([]);
    setCurrentShowingMove(0);
    setSquareActivity({});
  }, [clearAllTimers]);

  // Enhanced trail addition - adds both FROM trail and TO flash
  const addMoveHighlights = useCallback((fromSquare: string, toSquare: string, pieceType: string, moveNumber: number) => {
    // Update square activity for FROM square
    setSquareActivity(prev => ({
      ...prev,
      [fromSquare]: (prev[fromSquare] || 0) + 1
    }));
    
    // Add persistent trail for FROM square
    setPieceTrails(prev => {
      // Remove trails older than TRAIL_FADE_MOVES
      const filteredTrails = prev.filter(trail => moveNumber - trail.moveNumber < TRAIL_FADE_MOVES);
      
      // Update opacity of existing trails
      const updatedTrails = filteredTrails.map(trail => ({
        ...trail,
        opacity: Math.max(0.3, 1 - ((moveNumber - trail.moveNumber) * 0.2))
      }));
      
      // Add new trail for FROM square
      const newTrail: PieceTrail = {
        square: fromSquare,
        pieceType: pieceType.toLowerCase(),
        moveNumber,
        opacity: 0.8
      };
      
      return [...updatedTrails, newTrail];
    });

    // Add temporary flash for TO square
    setDestinationFlashes(prev => {
      const newFlash: DestinationFlash = {
        square: toSquare,
        moveNumber,
        timestamp: Date.now()
      };
      return [...prev, newFlash];
    });

    // Remove the destination flash after FLASH_DURATION
    setTimeout(() => {
      setDestinationFlashes(prev => 
        prev.filter(flash => Date.now() - flash.timestamp < FLASH_DURATION)
      );
    }, FLASH_DURATION);

  }, []);

  // Enhanced square highlighting - shows both trails and flashes
  const getEnhancedSquareStyles = useCallback(() => {
    const styles: { [square: string]: React.CSSProperties } = {};
    
    // Add destination flashes (TO squares) - these take priority
    destinationFlashes.forEach(flash => {
      const flashAge = Date.now() - flash.timestamp;
      if (flashAge < FLASH_DURATION) {
        // Bright, pulsing flash for destination
        const opacity = Math.max(0.3, 1 - (flashAge / FLASH_DURATION));
        styles[flash.square] = {
          backgroundColor: `${TRAIL_YELLOW}`,
          border: `3px solid ${TRAIL_YELLOW}`,
          borderRadius: '6px',
          boxSizing: 'border-box',
          boxShadow: `0 0 10px ${TRAIL_YELLOW}80`
        };
      }
    });
    
    // Add persistent trails (FROM squares) - only if not already a destination flash
    pieceTrails.forEach(trail => {
      // Don't override destination flashes
      if (styles[trail.square]) return;
      
      const age = currentShowingMove - trail.moveNumber;
      
      if (age === 0) {
        // Most recent FROM square: bright yellow
        styles[trail.square] = {
          backgroundColor: `${TRAIL_YELLOW}DD`, // Brighter (87% opacity)
          border: `2px solid ${TRAIL_YELLOW}`,
          borderRadius: '4px',
          boxSizing: 'border-box'
        };
      } else if (age === 1) {
        // Previous FROM square: medium bright yellow (brighter than before)
        styles[trail.square] = {
          backgroundColor: `${TRAIL_YELLOW}BB`, // Brighter (73% opacity, was 60%)
          borderRadius: '3px'
        };
      } else if (age === 2) {
        // Two moves ago: still quite bright (brighter than before)
        styles[trail.square] = {
          backgroundColor: `${TRAIL_YELLOW}99`, // Brighter (60% opacity, was 40%)
          borderRadius: '3px'
        };
      } else {
        // Older moves: light but still visible (brighter than before)
        styles[trail.square] = {
          backgroundColor: `${TRAIL_YELLOW}66`, // Brighter (40% opacity, was 20%)
          borderRadius: '2px'
        };
      }
    });
    
    return styles;
  }, [pieceTrails, destinationFlashes, currentShowingMove]);

  // Clean trail legend with both trail types - MOBILE OPTIMIZED - WITH FIXED HEIGHT
  const renderEnhancedTrailLegend = () => {
    const showLegend = (gamePhase === GamePhase.SHOWING || gamePhase === GamePhase.STUDYING) && 
                       (pieceTrails.length > 0 || destinationFlashes.length > 0);
    
    // Always render the container to prevent layout shift
    return (
      <div style={{ 
        minHeight: isMobile ? '32px' : '37px', // Reserve space even when empty
        marginBottom: isMobile ? '8px' : '12px',
        display: 'flex',
        alignItems: 'center'
      }}>
        {showLegend && (
          <div style={{ 
            fontSize: isMobile ? '9px' : '11px',
            color: '#ccc',
            display: 'flex',
            gap: isMobile ? '6px' : '15px',
            alignItems: 'center',
            backgroundColor: '#2a2a2a',
            padding: isMobile ? '6px 10px' : '8px 16px',
            borderRadius: '6px',
            flexWrap: 'wrap',
            width: '100%'
          }}>
            <span style={{ fontWeight: '500' }}>Movement tracking:</span>
            
            {/* Trail indicator for FROM squares */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ 
                width: isMobile ? '10px' : '12px', 
                height: isMobile ? '10px' : '12px', 
                backgroundColor: `${TRAIL_YELLOW}BB`,
                borderRadius: '2px',
                border: `1px solid ${TRAIL_YELLOW}`
              }} />
              <span style={{ fontSize: isMobile ? '8px' : '10px' }}>From squares</span>
            </div>

            {/* Flash indicator for TO squares */}
            {destinationFlashes.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ 
                  width: isMobile ? '10px' : '12px', 
                  height: isMobile ? '10px' : '12px', 
                  backgroundColor: TRAIL_YELLOW,
                  borderRadius: '2px',
                  border: `2px solid ${TRAIL_YELLOW}`,
                  boxShadow: `0 0 4px ${TRAIL_YELLOW}80`
                }} />
                <span style={{ fontSize: isMobile ? '8px' : '10px' }}>To squares</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Mobile Score Card Component - COMPRESSED
  const MobileScoreCard = () => (
    <div style={{
      width: '100%',
      backgroundColor: '#2a2a2a',
      borderRadius: '8px',
      padding: '8px 12px', // Reduced from 12px 16px
      marginBottom: '12px', // Reduced from 16px
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gap: '12px', // Reduced from 16px
        fontSize: '11px', // Reduced from 13px
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
          <div style={{ fontWeight: 'bold', color: '#e5e5e5', fontSize: '12px' }}>{round}</div>
        </div>
        <div>
          <div style={{ color: '#ccc', fontSize: '9px' }}>Moves</div>
          <div style={{ fontWeight: 'bold', color: '#e5e5e5', fontSize: '12px' }}>{getCurrentSettings().movesToShow}</div>
        </div>
      </div>
      <div style={{ 
        marginTop: '6px', // Reduced from 10px
        textAlign: 'center',
        fontSize: '10px' // Reduced from 12px
      }}>
        <span style={{ color: '#fff', fontWeight: 'bold' }}>{currentOpening}</span>
        {getStatusMessage() && (
          <span style={{ color: '#ccc', marginLeft: '6px' }}>• {getStatusMessage()}</span>
        )}
      </div>
    </div>
  );

  // Mobile Opening Selection Component - COMPRESSED
  const MobileOpeningSelection = () => (
    <div style={{
      width: '100%',
      backgroundColor: '#2a2a2a',
      borderRadius: '6px', // Reduced from 8px
      padding: '8px', // Reduced from 12px
      marginBottom: '12px' // Reduced from 16px
    }}>
      <h3 style={{ margin: '0 0 6px 0', textAlign: 'center', fontSize: '11px', color: '#ccc' }}>
        Select Opening
      </h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr', 
        gap: '6px' // Reduced from 8px
      }}>
        {Object.keys(openings).map(opening => (
          <button
            key={opening}
            onClick={() => setCurrentOpening(opening as keyof typeof openings)}
            disabled={gamePhase === GamePhase.SHOWING || gamePhase === GamePhase.STUDYING || gamePhase === GamePhase.RECALL}
            style={{
              padding: '8px 6px', // Reduced from 10px 8px
              fontSize: '10px', // Reduced from 11px
              borderRadius: '3px', // Reduced from 4px
              backgroundColor: currentOpening === opening ? '#EAB308' : '#333',
              color: currentOpening === opening ? '#000' : 'white',
              border: 'none',
              cursor: gamePhase === GamePhase.SHOWING || gamePhase === GamePhase.STUDYING || gamePhase === GamePhase.RECALL ? 'not-allowed' : 'pointer',
              opacity: gamePhase === GamePhase.SHOWING || gamePhase === GamePhase.STUDYING || gamePhase === GamePhase.RECALL ? 0.5 : 1,
              transition: 'all 0.2s ease',
              textAlign: 'center'
            }}
          >
            {opening}
          </button>
        ))}
      </div>
      <div style={{ 
        marginTop: '6px', // Reduced from 10px
        fontSize: '9px', // Reduced from 10px
        color: '#EAB308',
        textAlign: 'center'
      }}>
        Will show all {openingMoves.length} moves
      </div>
    </div>
  );

  // Mobile Training Controls Component - COMPRESSED
  const MobileTrainingControls = () => (
    <div style={{
      width: '100%',
      backgroundColor: '#2a2a2a',
      borderRadius: '6px', // Reduced from 8px
      padding: '8px', // Reduced from 12px
      marginTop: '12px' // Reduced from 16px
    }}>
      <h3 style={{ margin: '0 0 8px 0', textAlign: 'center', fontSize: '11px', color: '#ccc' }}>
        Training Controls
      </h3>
      
      {/* Difficulty Presets - Horizontal Grid */}
      <div style={{ marginBottom: '8px' }}> {/* Reduced from 12px */}
        <div style={{ fontSize: '9px', marginBottom: '4px', color: '#ccc', textAlign: 'center' }}>
          Difficulty Presets:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '3px' }}>
          {Object.entries(difficultyPresets).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => setCurrentDifficulty(key as keyof typeof difficultyPresets)}
              style={{
                padding: '6px 3px', // Reduced from 8px 4px
                fontSize: '8px', // Reduced from 9px
                borderRadius: '2px', // Reduced from 3px
                backgroundColor: currentDifficulty === key ? '#EAB308' : '#333',
                color: currentDifficulty === key ? '#000' : 'white',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Settings - Horizontal Sliders */}
      <div style={{ marginBottom: '8px' }}> {/* Reduced from 12px */}
        <div style={{ fontSize: '9px', marginBottom: '6px', color: '#ccc', textAlign: 'center' }}>
          Custom Settings:
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}> {/* Reduced from 12px */}
          {/* Study Time Slider */}
          <div>
            <div style={{ fontSize: '9px', marginBottom: '4px', textAlign: 'center' }}>
              Study: {customStudyTime}s
            </div>
            <input
              type="range"
              min="4"
              max="15"
              value={customStudyTime}
              onChange={(e) => setCustomStudyTime(parseInt(e.target.value))}
              style={{...sliderStyles, height: '6px'}} // Smaller slider
            />
          </div>

          {/* Animation Speed Slider */}
          <div>
            <div style={{ fontSize: '9px', marginBottom: '4px', textAlign: 'center' }}>
              Speed: {getAnimationSpeedLabel(customAnimationSpeed)}
            </div>
            <input
              type="range"
              min="500"
              max="1500"
              step="100"
              value={customAnimationSpeed}
              onChange={(e) => setCustomAnimationSpeed(parseInt(e.target.value))}
              style={{...sliderStyles, height: '6px'}} // Smaller slider
            />
          </div>
        </div>
      </div>

      {/* Phase-specific controls - WITH FIXED HEIGHT CONTAINER */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '6px',
        minHeight: '44px', // Fixed height to prevent resize
        justifyContent: 'center'
      }}>
        {gamePhase === GamePhase.SELECTION && (
          <button 
            onClick={startNewRound}
            style={{ 
              padding: '10px 12px', // Reduced from 12px 16px
              fontSize: '12px', // Reduced from 14px
              borderRadius: '4px', // Reduced from 6px
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
            <button 
              onClick={startNewRound}
              style={{ 
                padding: '8px 10px', // Reduced from 10px 12px
                fontSize: '11px', // Reduced from 12px
                borderRadius: '3px', // Reduced from 4px
                backgroundColor: '#2196F3', 
                color: 'white', 
                border: 'none', 
                cursor: 'pointer' 
              }}
            >
              Replay
            </button>
            <button 
              onClick={() => setGamePhase(GamePhase.SELECTION)}
              style={{ 
                padding: '8px 10px', // Reduced from 10px 12px
                fontSize: '11px', // Reduced from 12px
                borderRadius: '3px', // Reduced from 4px
                backgroundColor: '#FF9800', 
                color: 'white', 
                border: 'none', 
                cursor: 'pointer' 
              }}
            >
              Configure
            </button>
          </div>
        )}
        
        {gamePhase === GamePhase.RECALL && (
          <button 
            onClick={() => endRound(false)}
            style={{ 
              padding: '8px 10px', // Reduced from 10px 12px
              fontSize: '11px', // Reduced from 12px
              borderRadius: '3px', // Reduced from 4px
              backgroundColor: '#f44336', 
              color: 'white', 
              border: 'none', 
              cursor: 'pointer' 
            }}
          >
            Give Up
          </button>
        )}
      </div>

      {/* Study Timer (Mobile) */}
      {gamePhase === GamePhase.STUDYING && (
        <div style={{ 
          marginTop: '8px', // Reduced from 12px
          color: '#EAB308', 
          fontSize: '14px', // Reduced from 16px
          textAlign: 'center', 
          fontWeight: 'bold' 
        }}>
          Study Time: {timeLeft}s
        </div>
      )}

      {/* User Moves Display (Mobile) */}
      {gamePhase === GamePhase.RECALL && userMoves.length > 0 && (
        <div style={{ marginTop: '8px' }}> {/* Reduced from 12px */}
          <div style={{ color: '#fff', marginBottom: '2px', fontSize: '9px', textAlign: 'center' }}>
            Your moves:
          </div>
          <div style={{ fontSize: '9px', textAlign: 'center', color: '#ccc' }}>
            {userMoves.join(' ')}
          </div>
        </div>
      )}
    </div>
  );

  // Start a new round with current settings
  const startNewRound = useCallback(() => {
    setOpeningMoves(openings[currentOpening]);
    setGamePhase(GamePhase.SHOWING);
    setLastResult(null);
    resetGame();
  }, [currentOpening, resetGame]);

  // Update settings when preset changes
  useEffect(() => {
    const preset = difficultyPresets[currentDifficulty];
    setCustomStudyTime(preset.studyTime / 1000);
    setCustomAnimationSpeed(preset.animationSpeed);
  }, [currentDifficulty]);

  // Update opening moves when opening changes
  useEffect(() => {
    setOpeningMoves(openings[currentOpening]);
  }, [currentOpening]);

  // Enhanced move animation with destination flashing
  useEffect(() => {
    if (gamePhase === GamePhase.SHOWING && !isShowingRef.current) {
      isShowingRef.current = true;
      const settings = getCurrentSettings();
      
      const showMoves = async () => {
        console.log('Starting move sequence for:', currentOpening);
        
        // Clear any existing timers first
        clearAllTimers();
        
        // Reset to starting position
        gameRef.current = new Chess();
        setCurrentPosition(gameRef.current.fen());
        setCurrentShowingMove(0);
        setPieceTrails([]);
        setDestinationFlashes([]);
        
        console.log('Initial position:', gameRef.current.fen());
        console.log('Moves to play:', openingMoves);
        
        // Wait a moment for the board to be ready
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Play through all moves
        for (let i = 0; i < settings.movesToShow; i++) {
          await new Promise(resolve => {
            showingTimerRef.current = setTimeout(() => {
              try {
                const moveToPlay = openingMoves[i];
                console.log(`Attempting move ${i + 1}: ${moveToPlay} from position:`, gameRef.current.fen());
                
                const moveDetails = gameRef.current.move(moveToPlay);
                if (moveDetails) {
                  console.log(`✓ Move ${i + 1} successful:`, moveDetails);
                  
                  // Add both FROM trail and TO flash
                  addMoveHighlights(moveDetails.from, moveDetails.to, moveDetails.piece, i + 1);
                  setCurrentShowingMove(i + 1);
                  
                  // Update position
                  setCurrentPosition(gameRef.current.fen());
                  setCurrentMoveIndex(i + 1);
                } else {
                  console.error(`✗ Move ${i + 1} failed: ${moveToPlay} from position:`, gameRef.current.fen());
                }
                resolve(void 0);
              } catch (error) {
                console.error('Error making move:', openingMoves[i], 'Error:', error);
                resolve(void 0);
              }
            }, settings.animationSpeed);
          });
        }
        
        console.log('Move sequence complete, starting study phase');
        // After showing all moves, start study phase
        setTimeout(() => {
          isShowingRef.current = false;
          startStudyPhase();
        }, 500);
      };
      
      showMoves();
    }
    
    // Cleanup function
    return () => {
      if (gamePhase !== GamePhase.SHOWING) {
        isShowingRef.current = false;
      }
    };
  }, [gamePhase, openingMoves, addMoveHighlights, getCurrentSettings, clearAllTimers]);

  // Clean up expired flashes
  useEffect(() => {
    const interval = setInterval(() => {
      setDestinationFlashes(prev => 
        prev.filter(flash => Date.now() - flash.timestamp < FLASH_DURATION)
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Start study phase
  const startStudyPhase = useCallback(() => {
    const settings = getCurrentSettings();
    setGamePhase(GamePhase.STUDYING);
    setTimeLeft(Math.floor(settings.studyTime / 1000));
    
    const studyInterval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(studyInterval);
          setGamePhase(GamePhase.RECALL);
          resetGame();
          setCanMakeMove(true);
          setCurrentMoveIndex(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    studyTimerRef.current = studyInterval;
  }, [resetGame, getCurrentSettings]);

  // Handle user moves during recall phase
  const makeAMove = useCallback((move: { from: string; to: string; promotion?: string }) => {
    if (!canMakeMove || gamePhase !== GamePhase.RECALL) return null;
    
    const gameCopy = new Chess(game.fen());
    const result = gameCopy.move(move);
    
    if (result === null) return null;
    
    setGame(gameCopy);
    setCurrentPosition(gameCopy.fen());
    setUserMoves(prev => [...prev, result.san]);
    setCurrentMoveIndex(prev => prev + 1);
    
    return result;
  }, [canMakeMove, gamePhase, game]);

  // Validate user's sequence
  useEffect(() => {
    if (gamePhase === GamePhase.RECALL && userMoves.length > 0) {
      const settings = getCurrentSettings();
      const expectedMovesSlice = openingMoves.slice(0, settings.movesToShow);
      const isCorrectSoFar = userMoves.every((move, index) => move === expectedMovesSlice[index]);
      
      if (!isCorrectSoFar) {
        endRound(false);
      } else if (userMoves.length === expectedMovesSlice.length) {
        endRound(true);
      }
    }
  }, [userMoves, gamePhase, openingMoves, getCurrentSettings]);

  // End round and update scoring
  const endRound = useCallback((success: boolean) => {
    setGamePhase(GamePhase.RESULTS);
    setLastResult(success ? 'correct' : 'incorrect');
    setCanMakeMove(false);
    
    const settings = getCurrentSettings();
    
    if (success) {
      const points = settings.movesToShow * 10;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
    
    setRound(prev => prev + 1);
  }, [getCurrentSettings]);

  // Handle piece drops
  const onDrop = (sourceSquare: string, targetSquare: string) => {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q'
    });
    return move !== null;
  };

  // Get phase-specific status message
  const getStatusMessage = () => {
    const settings = getCurrentSettings();
    switch (gamePhase) {
      case GamePhase.SHOWING:
        return `Watching moves... (${currentShowingMove}/${settings.movesToShow})`;
      case GamePhase.STUDYING:
        return `Study time: ${timeLeft}s`;
      case GamePhase.RECALL:
        return `Recreating moves... (${userMoves.length}/${settings.movesToShow})`;
      case GamePhase.RESULTS:
        return lastResult === 'correct' ? 
          `Correct! +${settings.movesToShow * 10} points` : 
          `Incorrect! Try again`;
      default:
        return null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  // Get board size based on screen size - INCREASED FOR MOBILE
  const getBoardSize = () => {
    return isMobile ? '390px' : '480px'; // Increased from 340px to 390px
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: isMobile ? 'center' : 'flex-start', // Changed to flex-start for desktop
        minHeight: '100vh',
        backgroundColor: '#1a1a1a',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        padding: '15px',
        paddingTop: isMobile ? '15px' : '45px', // Reduced from 60px to 45px for desktop to move up
        boxSizing: 'border-box'
      }}
    >
      {/* Enhanced Slider Styles */}
      <style dangerouslySetInnerHTML={{ __html: sliderThumbStyles }} />

      {isMobile ? (
        // MOBILE LAYOUT (OPTIMIZED)
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '420px', // Increased to accommodate larger board
          padding: '0 8px' // Reduced padding
        }}>
          
          {/* Mobile Score Card (Top) */}
          <MobileScoreCard />
          
          {/* Mobile Opening Selection (Horizontal) */}
          <MobileOpeningSelection />
          
          {/* Enhanced Trail Legend (Mobile) - ALWAYS RENDERED WITH FIXED HEIGHT */}
          {renderEnhancedTrailLegend()}
          
          {/* Mobile Chessboard (Centered) - LARGER */}
          <div style={{
            width: getBoardSize(),
            height: getBoardSize(),
            border: '2px solid #333',
            borderRadius: '6px',
            overflow: 'hidden',
            marginBottom: '8px' // Reduced from 10px
          }}>
            <Chessboard 
              id="mobile-spatial-memory-chessboard" 
              position={currentPosition}
              onPieceDrop={onDrop}
              arePiecesDraggable={canMakeMove}
              customSquareStyles={getEnhancedSquareStyles()}
              animationDuration={200}
            />
          </div>

          {/* Progress indicator for recall phase (Mobile) */}
          {gamePhase === GamePhase.RECALL && (
            <div style={{ width: getBoardSize(), textAlign: 'center', marginBottom: '8px' }}>
              <div style={{ 
                width: '100%', 
                height: '5px', // Reduced from 6px
                backgroundColor: '#333', 
                borderRadius: '3px', 
                overflow: 'hidden',
                marginBottom: '4px' // Reduced from 6px
              }}>
                <div style={{
                  width: `${(userMoves.length / getCurrentSettings().movesToShow) * 100}%`,
                  height: '100%',
                  backgroundColor: '#EAB308',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <p style={{ margin: '0', fontSize: '10px', color: '#ccc' }}>
                Progress: {userMoves.length}/{getCurrentSettings().movesToShow} moves
              </p>
            </div>
          )}
          
          {/* Mobile Training Controls (Bottom) */}
          <MobileTrainingControls />
          
        </div>
      ) : (
        // DESKTOP LAYOUT - ALIGNED AT TOP
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', // Changed from 'center' to 'flex-start' to align at top
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
                  disabled={gamePhase === GamePhase.SHOWING || gamePhase === GamePhase.STUDYING || gamePhase === GamePhase.RECALL}
                  style={{
                    padding: '10px 12px',
                    fontSize: '12px',
                    borderRadius: '4px',
                    backgroundColor: currentOpening === opening ? '#EAB308' : '#333',
                    color: currentOpening === opening ? '#000' : 'white',
                    border: 'none',
                    cursor: gamePhase === GamePhase.SHOWING || gamePhase === GamePhase.STUDYING || gamePhase === GamePhase.RECALL ? 'not-allowed' : 'pointer',
                    opacity: gamePhase === GamePhase.SHOWING || gamePhase === GamePhase.STUDYING || gamePhase === GamePhase.RECALL ? 0.5 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {opening}
                </button>
              ))}
            </div>

            {/* Current opening info */}
            <div style={{ marginTop: '16px', fontSize: '11px', color: '#ccc' }}>
              <div>Selected Opening:</div>
              <div style={{ color: '#fff', marginBottom: '4px', fontSize: '10px' }}>{currentOpening}</div>
              <div>Total Moves: {openingMoves.length}</div>
              <div style={{ marginTop: '8px', fontSize: '10px', color: '#EAB308' }}>
                Will show all {openingMoves.length} moves
              </div>
            </div>
          </div>

          {/* Center - Chessboard Area */}
          <div style={{ 
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            {/* Clean Stats Card - COMPACT VERSION */}
            <div style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '8px',
              padding: '12px 20px', // Reduced padding
              marginBottom: '12px', // Reduced margin
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              width: '100%',
              maxWidth: getBoardSize()
            }}>
              <div style={{ 
                display: 'flex', 
                gap: '24px', // Reduced gap
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px', // Reduced font
                fontWeight: '500'
              }}>
                <span>Score: <span style={{ fontWeight: 'bold', color: '#e5e5e5' }}>{score}</span></span>
                <span>Streak: <span style={{ fontWeight: 'bold', color: '#e5e5e5' }}>{streak}</span></span>
                <span>Round: <span style={{ fontWeight: 'bold', color: '#e5e5e5' }}>{round}</span></span>
                <span>Moves: <span style={{ fontWeight: 'bold', color: '#e5e5e5' }}>{getCurrentSettings().movesToShow}</span></span>
              </div>
              <div style={{ 
                marginTop: '6px', // Reduced margin
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px' // Reduced font
              }}>
                <span>Opening: <span style={{ color: '#fff', fontWeight: 'bold' }}>{currentOpening}</span></span>
                {getStatusMessage() && (
                  <>
                    <span style={{ color: '#ccc' }}>•</span>
                    <span style={{ color: '#ccc' }}>{getStatusMessage()}</span>
                  </>
                )}
              </div>
            </div>

            {/* Enhanced Trail Legend - ALWAYS RENDERED WITH FIXED HEIGHT */}
            {renderEnhancedTrailLegend()}

            {/* Chessboard - Enhanced with FROM trails + TO flashes */}
            <div
              style={{
                width: getBoardSize(),
                height: getBoardSize(),
                border: '2px solid #333',
                borderRadius: '6px',
                overflow: 'hidden',
                marginBottom: '10px'
              }}
            >
              <Chessboard 
                id="desktop-spatial-memory-chessboard" 
                position={currentPosition}
                onPieceDrop={onDrop}
                arePiecesDraggable={canMakeMove}
                customSquareStyles={getEnhancedSquareStyles()}
                animationDuration={200}
              />
            </div>

            {/* Progress indicator for recall phase */}
            {gamePhase === GamePhase.RECALL && (
              <div style={{ width: getBoardSize(), textAlign: 'center' }}>
                <div style={{ 
                  width: '100%', 
                  height: '6px', 
                  backgroundColor: '#333', 
                  borderRadius: '3px', 
                  overflow: 'hidden',
                  marginBottom: '6px'
                }}>
                  <div style={{
                    width: `${(userMoves.length / getCurrentSettings().movesToShow) * 100}%`,
                    height: '100%',
                    backgroundColor: '#EAB308',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <p style={{ margin: '0', fontSize: '12px', color: '#ccc' }}>
                  Progress: {userMoves.length}/{getCurrentSettings().movesToShow} moves
                </p>
              </div>
            )}
          </div>

          {/* Right Panel - Training Controls - WITH FIXED HEIGHT */}
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
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', marginBottom: '6px', color: '#ccc' }}>Difficulty Presets:</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                {Object.entries(difficultyPresets).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => setCurrentDifficulty(key as keyof typeof difficultyPresets)}
                    style={{
                      padding: '6px 8px',
                      fontSize: '10px',
                      borderRadius: '3px',
                      backgroundColor: currentDifficulty === key ? '#EAB308' : '#333',
                      color: currentDifficulty === key ? '#000' : 'white',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '10px', color: '#666', marginTop: '6px', textAlign: 'center' }}>
                Affects timing, not move count
              </div>
            </div>

            {/* Custom Settings */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', marginBottom: '8px', color: '#ccc' }}>Custom Settings:</div>
              
              {/* Study Time Slider */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'center', fontSize: '10px', marginBottom: '6px' }}>
                  <span>Study Time: {customStudyTime}s</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="15"
                  value={customStudyTime}
                  onChange={(e) => setCustomStudyTime(parseInt(e.target.value))}
                  style={sliderStyles}
                />
              </div>

              {/* Animation Speed Slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'center', fontSize: '10px', marginBottom: '6px' }}>
                  <span>Animation: {getAnimationSpeedLabel(customAnimationSpeed)}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="1500"
                  step="100"
                  value={customAnimationSpeed}
                  onChange={(e) => setCustomAnimationSpeed(parseInt(e.target.value))}
                  style={sliderStyles}
                />
              </div>
            </div>

            {/* Phase-specific controls - WITH FIXED HEIGHT CONTAINER */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '8px',
              minHeight: '60px', // Fixed height to prevent resize
              justifyContent: 'center'
            }}>
              {gamePhase === GamePhase.SELECTION && (
                <button 
                  onClick={startNewRound}
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
                    onClick={startNewRound}
                    style={{ 
                      padding: '10px 12px', 
                      fontSize: '12px', 
                      borderRadius: '4px', 
                      backgroundColor: '#2196F3', 
                      color: 'white', 
                      border: 'none', 
                      cursor: 'pointer' 
                    }}
                  >
                    Replay
                  </button>
                  <button 
                    onClick={() => setGamePhase(GamePhase.SELECTION)}
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
                    Configure
                  </button>
                </>
              )}
              
              {gamePhase === GamePhase.RECALL && (
                <button 
                  onClick={() => endRound(false)}
                  style={{ 
                    padding: '10px 12px', 
                    fontSize: '12px', 
                    borderRadius: '4px', 
                    backgroundColor: '#f44336', 
                    color: 'white', 
                    border: 'none', 
                    cursor: 'pointer' 
                  }}
                >
                  Give Up
                </button>
              )}
            </div>

            {/* Enhanced Session Info */}
            <div style={{ 
              marginTop: '16px', 
              fontSize: '11px', 
              color: '#ccc'
            }}>
              <div style={{ marginBottom: '8px' }}>
                <div>Phase: {gamePhase.charAt(0).toUpperCase() + gamePhase.slice(1)}</div>
                <div>Opening: {openingMoves.length} moves, {getCurrentSettings().studyTime / 1000}s study</div>
              </div>
              
              {gamePhase === GamePhase.STUDYING && (
                <div style={{ color: '#EAB308', fontSize: '14px', textAlign: 'center', fontWeight: 'bold' }}>
                  Study Time: {timeLeft}s
                </div>
              )}

              {gamePhase === GamePhase.RECALL && userMoves.length > 0 && (
                <div>
                  <div style={{ color: '#fff', marginBottom: '4px', fontSize: '10px' }}>Your moves:</div>
                  <div style={{ fontSize: '10px' }}>{userMoves.join(' ')}</div>
                </div>
              )}

              {/* Activity tracking - keeping client's features */}
              {(pieceTrails.length > 0 || destinationFlashes.length > 0) && (gamePhase === GamePhase.SHOWING || gamePhase === GamePhase.STUDYING) && (
                <div style={{ marginTop: '8px', fontSize: '10px' }}>
                  <div style={{ color: '#EAB308' }}>Active trails: {pieceTrails.length}</div>
                  <div style={{ color: '#888', marginTop: '2px' }}>
                    Flashes: {destinationFlashes.length}
                  </div>
                  <div style={{ color: '#888', marginTop: '2px' }}>
                    Hot spots: {Object.values(squareActivity).filter(count => count > 1).length}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}