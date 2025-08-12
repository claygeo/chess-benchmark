'use client';

import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const pieceMoves = {
  knight: (square: string) => {
    const [file, rank] = [square.charCodeAt(0), parseInt(square[1])];
    const moves = [
      String.fromCharCode(file + 1) + (rank + 2),
      String.fromCharCode(file + 1) + (rank - 2),
      String.fromCharCode(file - 1) + (rank + 2),
      String.fromCharCode(file - 1) + (rank - 2),
      String.fromCharCode(file + 2) + (rank + 1),
      String.fromCharCode(file + 2) + (rank - 1),
      String.fromCharCode(file - 2) + (rank + 1),
      String.fromCharCode(file - 2) + (rank - 1),
    ];
    return moves.filter(
      (move) => move[0] >= 'a' && move[0] <= 'h' && move[1] >= '1' && move[1] <= '8',
    );
  },
  // Add other pieces' moves here
};

export default function PieceMovesPage() {
  const { piece } = useParams();
  const [currentSquare, setCurrentSquare] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [showSquare, setShowSquare] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    generateRandomSquare();
  }, [piece]);

  const generateRandomSquare = () => {
    const files = 'abcdefgh';
    const ranks = '12345678';
    const randomSquare =
      files[Math.floor(Math.random() * 8)] + ranks[Math.floor(Math.random() * 8)];
    setCurrentSquare(randomSquare);
    setShowSquare(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = () => {
    const expectedMoves = pieceMoves[piece as keyof typeof pieceMoves](currentSquare)
      .sort()
      .join(' ');
    if (userInput.trim().toLowerCase() === expectedMoves.toLowerCase()) {
      setScore(score + 1);
      setUserInput('');
      generateRandomSquare();
    } else {
      alert(`Incorrect moves. Expected: ${expectedMoves}`);
      setUserInput('');
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentSquare]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <h1>Piece Moves Game</h1>
      <h2>Piece: {piece}</h2>
      <h3>Score: {score}</h3>

      <>
        <h3>Square: {currentSquare}</h3>
      </>

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
          placeholder="Enter the valid moves"
          style={{
            color: 'black',
            width: '500px',
            height: '50px',
            caretColor: 'red',
            animation: 'blink-caret 1s step-end infinite',
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
    </div>
  );
}
