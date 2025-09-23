'use client';
import { BiSolidChess } from 'react-icons/bi';
import { FaChess } from 'react-icons/fa';
import { VscWholeWord } from 'react-icons/vsc';
import { Card } from './Card';

export const ExerciseList = () => {
  return (
    <div 
      className="flex space-x-4"
      style={{
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}
    >
      <Card
        icon={FaChess}
        title="Spatial Memory"
        description="Memorize classical textbook openings"
        route="/exercises/game-memory"
      />
      <Card
        icon={VscWholeWord}
        title="Verbal Memory"
        description="Memorize SAN text for textbook openings"
        route="/exercises/san-memory"
      />
      <Card
        icon={BiSolidChess}
        title="Coordinate Vision"
        description="Practice visualizing chess board coordinates"
        route="/exercises/coordinate-vision"
      />
    </div>
  );
};