// components/Chessboard.tsx

import { Chess } from 'chess.js';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

type ChessboardProps = {
  openingName: string;
  onReset: () => void;
};

// Dynamically import Chessboard and disable SSR
// const Chessboard = dynamic(() => import('react-chessboard'), { ssr: false });
const Chessboard = dynamic(() => import('react-chessboard').then((mod) => mod.Chessboard), {
  ssr: false,
});

// Opening moves data (if not fetching from a backend)
const openingsData: Record<string, string[]> = {
  'Ruy Lopez': ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
  "King's Indian Defense": ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6'],
  // Add more openings as needed
};

export const ChessboardComponent: React.FC<ChessboardProps> = ({ openingName, onReset }) => {
  const [game, setGame] = useState(new Chess());
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [openingMoves, setOpeningMoves] = useState<string[]>([]);

  useEffect(() => {
    // Fetch the opening moves based on the selected opening
    // If using a backend, fetch the data from there
    const moves = openingsData[openingName];
    setOpeningMoves(moves);
    setGame(new Chess());
    setCurrentMoveIndex(0);
  }, [openingName]);

  // const makeAMove = (move: { from: string; to: string; promotion?: string }) => {
  //   const gameCopy = new Chess(game.fen());
  //   const result = gameCopy.move(move);

  //   if (result === null) return null; // Invalid move
  //   setGame(gameCopy);
  //   return result;
  // };

  // const onDrop = (sourceSquare: string, targetSquare: string) => {
  //   const move = makeAMove({
  //     from: sourceSquare,
  //     to: targetSquare,
  //     promotion: 'q', // Always promote to a queen for simplicity
  //   });

  //   if (move === null) return false; // Illegal move

  //   const expectedMove = openingMoves[currentMoveIndex];

  //   if (move.san === expectedMove) {
  //     setCurrentMoveIndex(currentMoveIndex + 1);
  //     if (currentMoveIndex + 1 === openingMoves.length) {
  //       alert(`Congratulations! You have completed the ${openingName} opening.`);
  //       setGame(new Chess());
  //       setCurrentMoveIndex(0);
  //     }
  //   } else {
  //     alert(`Incorrect move. Expected ${expectedMove}. Try again.`);
  //     game.undo();
  //     setGame(new Chess(game.fen()));
  //   }

  //   return true;
  // };

  return (
    <div>
      <h2>{openingName} Memorization Game</h2>
      <p>
        Round {Math.ceil((currentMoveIndex + 1) / 2)}:{' '}
        {openingMoves.slice(0, currentMoveIndex + 1).join(' ')}
      </p>
      {/* <Chessboard position={game.fen()} onPieceDrop={onDrop} /> */}
      <button onClick={onReset}>Select Different Opening</button>
    </div>
  );
};
