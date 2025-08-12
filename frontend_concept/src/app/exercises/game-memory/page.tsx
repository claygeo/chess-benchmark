'use client';

import { Chess } from 'chess.js';
import { useState } from 'react';
import { Chessboard } from 'react-chessboard';

const openings = {
  'Ruy Lopez': ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
  "King's Indian": ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7'],
  "Queen's Gambit": ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6'],
};

export default function GameMemoryPage() {
  const [game, setGame] = useState(new Chess());
  const [currentOpening, setCurrentOpening] = useState('Ruy Lopez');
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [userMoves, setUserMoves] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const [openingMoves, setOpeningMoves] = useState<string[]>(openings['Ruy Lopez']);

  const makeAMove = (move: { from: string; to: string; promotion?: string }) => {
    const gameCopy = new Chess(game.fen());
    const result = gameCopy.move(move);

    if (result === null) return null; // Invalid move
    setGame(gameCopy);
    return result;
  };

  const onDrop = (sourceSquare: string, targetSquare: string) => {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // Always promote to a queen for simplicity
    });

    if (move === null) return false; // Illegal move

    const expectedMove = openingMoves[currentMoveIndex];

    if (move.san === expectedMove) {
      setCurrentMoveIndex(currentMoveIndex + 1);
      if (currentMoveIndex + 1 === openingMoves.length) {
        alert('Congratulations! You have completed the {openingName} opening.');
        setGame(new Chess());
        setCurrentMoveIndex(0);
      }
    } else {
      alert(`Incorrect move ${move.san}. Expected ${expectedMove}. Try again.`);
      game.undo();
      setGame(new Chess(game.fen()));
    }

    return true;
  };

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
      <h1>Memorize Chess Openings</h1>
      <h2>Current Opening: {currentOpening}</h2>
      <p>
        Turn {Math.ceil((currentMoveIndex + 1) / 2)}:{' '}
        {openingMoves.slice(0, currentMoveIndex + 1).join(' ')}
      </p>
      <h3>Score: {score}</h3>

      <div
        style={{
          width: '800px',
          height: '800px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Chessboard id="game-memory-chessboard" position={game.fen()} onPieceDrop={onDrop} />
      </div>

      <button onClick={() => setCurrentOpening('Ruy Lopez')}>Ruy Lopez</button>
      <button onClick={() => setCurrentOpening("King's Indian")}>Kings Indian</button>
      <button onClick={() => setCurrentOpening("Queen's Gambit")}>Queens Gambit</button>
    </div>
  );
}
