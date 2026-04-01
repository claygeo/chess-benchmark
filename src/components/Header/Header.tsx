'use client';
import { useState } from 'react';
import { FaChessBoard } from 'react-icons/fa6';
import { PiGearSixDuotone } from 'react-icons/pi';
import { project } from '@/app/project';
import { ThemeToggle } from '../ThemeToggle';
import Link from 'next/link';

export const Header = () => {
  const [showSettings, setShowSettings] = useState(false);
  return (
    <header className="flex items-center justify-between border-b border-chess-surface-light bg-chess-surface p-4 text-white">
      <Link
        href="/"
        className="ml-10 flex cursor-pointer items-center text-lg font-bold text-white no-underline"
      >
        <FaChessBoard className="mr-2" />
        <span className="text-xl">{project.title}</span>
      </Link>
      <div className="relative">
        <button
          className="mr-8 text-white"
          onClick={() => setShowSettings(!showSettings)}
        >
          <PiGearSixDuotone size={24} />
        </button>
        {showSettings && (
          <div className="absolute right-0 mt-2 w-48 rounded-md border border-[#444] bg-chess-surface-light shadow-lg">
            <ul>
              <li className="cursor-pointer border-b border-[#444] px-4 py-2 text-white hover:bg-[#444]">
                Language
              </li>
              <li className="cursor-pointer border-b border-[#444] px-4 py-2 text-white hover:bg-[#444]">
                <ThemeToggle />
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};
