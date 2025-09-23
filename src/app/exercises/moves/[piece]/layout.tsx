// This is a server component that can export generateStaticParams
export async function generateStaticParams() {
  return [
    { piece: 'knight' },
    { piece: 'bishop' },
    { piece: 'rook' },
    { piece: 'queen' },
    { piece: 'king' },
    { piece: 'pawn' }
  ];
}

export default function PieceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}