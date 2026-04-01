import Link from 'next/link';
import { FaChessBoard } from 'react-icons/fa6';
import { project } from '@/app/project';

export const Header = () => {
  return (
    <header className="flex items-center justify-between border-b border-chess-surface-light bg-chess-surface p-4 text-white">
      <Link
        href="/"
        className="ml-10 flex cursor-pointer items-center text-lg font-bold text-white no-underline"
      >
        <FaChessBoard className="mr-2" />
        <span className="text-xl">{project.title}</span>
      </Link>
    </header>
  );
};
