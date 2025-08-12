// components/OpeningsList.tsx
import { gql } from '@apollo/client';

type Props = {
  onSelectOpening: (openingId: string) => void;
};

const GET_OPENINGS = gql`
  query GetOpenings {
    openings {
      id
      name
    }
  }
`;

const OpeningsList: React.FC<Props> = ({ onSelectOpening }) => {
  //   const { loading, error, data } = useQuery(GET_OPENINGS);

  //   if (loading) return <p>Loading openings...</p>;
  //   if (error) return <p>Error loading openings: {error.message}</p>;
  const data = {
    openings: [
      {
        id: '1',
        name: 'Opening 1',
      },
      {
        id: '2',
        name: 'Opening 2',
      },
    ],
  };
  return (
    <div>
      <h2>Select an Opening</h2>
      <ul>
        {data.openings.map((opening: { id: string; name: string }) => (
          <li key={opening.id}>
            <button onClick={() => onSelectOpening(opening.id)}>{opening.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
