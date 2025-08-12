'use client';
import { useEffect, useRef, useState } from 'react';

const openings = {
  'Ruy Lopez': ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
  "King's Indian": ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7'],
  "Queen's Gambit": ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6'],
};

export default function SanMemoryPage() {
  const [currentOpening, setCurrentOpening] = useState('Ruy Lopez');
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [showMove, setShowMove] = useState(true);
  const [timer, setTimer] = useState(0); // Initialize timer
  const maxTime = 2000; // Set maxTime to 2000ms (2 seconds)
  const inputRef = useRef<HTMLInputElement>(null);

  const openingMoves: string[] = openings[currentOpening as keyof typeof openings];

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowMove(false);
  //   }, 2000); // Show move for 5 seconds

  //   return () => clearTimeout(timer);
  // }, [currentMoveIndex, currentOpening]);
  useEffect(() => {
    setTimer(0); // Reset timer at the start of each turn

    const interval = setInterval(() => {
      setTimer((prevTimer) => Math.min(prevTimer + 100, maxTime));
    }, 100);

    const timeout = setTimeout(() => {
      setShowMove(false);
    }, maxTime);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [currentMoveIndex, currentOpening]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = () => {
    const expectedSequence = openingMoves.slice(0, currentMoveIndex + 1).join(' ');
    if (userInput.trim().toLowerCase() === expectedSequence.toLowerCase()) {
      setScore(score + 1);
      setCurrentMoveIndex(currentMoveIndex + 1);
      setUserInput('');
      setShowMove(true);

      if (currentMoveIndex + 1 === openingMoves.length) {
        alert('Congratulations! You have completed the opening.');
        resetGame();
      }
    } else {
      const diff = `Expected: ${expectedSequence}\nEntered: ${userInput.trim()}`;
      alert(`Incorrect sequence. Your final score is ${score}.\n\n${diff}`);
      resetGame();
    }
  };

  const resetGame = () => {
    setCurrentMoveIndex(0);
    setScore(0);
    setUserInput('');
    setShowMove(true);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start', // Change from 'center' to 'flex-start'
        minHeight: '100vh',
        paddingTop: '180px', // Add padding to move content down slightly
      }}
    >
      {/* <h1>Memorize Chess Openings (Textual)</h1> */}
      <h1 style={{ fontSize: '48px' }}>Opening: {currentOpening}</h1>
      <div style={{ marginBottom: '60px' }}>
        <h2 style={{ fontSize: '36px' }}>Score: {score}</h2>
      </div>

      {showMove ? (
        <>
          <h1 style={{ fontSize: '36px' }}>
            {' '}
            {openingMoves.slice(0, currentMoveIndex + 1).join(' ')}
          </h1>
          <div className="mt-4 h-4 w-24 rounded-full bg-gray-200">
            {' '}
            {/* Set fixed width */}
            <div
              className="h-4 rounded-full bg-blue-500"
              style={{
                width: `${(timer / maxTime) * 100}%`,
                transition: 'width 0.1s linear',
                transform: 'scaleX(-1)', // Reverse the fill direction
              }}
            ></div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
            placeholder="Enter the moves in SAN"
            style={{
              color: 'black',
              width: '500px',
              height: '50px',
              caretColor: 'red', // Set the caret color to red
              animation: 'blink-caret 1s step-end infinite', // Add blinking animation
            }}
            autoFocus
          />
          <style jsx>{`
            @keyframes blink-caret {
              from,
              to {
                border-color: transparent;
              }
              50% {
                border-color: black;
              }
            }
          `}</style>
          <button
            onClick={handleSubmit}
            className="mt-4 rounded-full bg-yellow-500 px-4 py-2 font-bold text-black"
          >
            Submit
          </button>
        </div>
      )}

      {/* <button onClick={() => setCurrentOpening('Ruy Lopez')}>Ruy Lopez</button>
      <button onClick={() => setCurrentOpening("King's Indian")}>Kings Indian</button>
      <button onClick={() => setCurrentOpening("Queen's Gambit")}>Queens Gambit</button> */}
    </div>
  );
}
