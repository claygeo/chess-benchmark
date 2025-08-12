// components/OpeningsList.tsx
type Props = {
  onSelectOpening: (openingName: string) => void;
};

const openings = [
  {
    name: 'Ruy Lopez',
    moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
  },
  {
    name: "King's Indian Defense",
    moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6'],
  },
  // Add more openings as needed
];

export const OpeningsList: React.FC<Props> = ({ onSelectOpening }) => {
  return (
    <div>
      <h2>Select an Opening</h2>
      <ul>
        {openings.map((opening) => (
          <li key={opening.name}>
            <button onClick={() => onSelectOpening(opening.name)}>{opening.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
