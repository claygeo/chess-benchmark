'use client';
import { useState } from 'react';
import { FaChessBoard } from 'react-icons/fa6';
import { PiGearSixDuotone } from 'react-icons/pi';
import { project } from '@/app/project';
import { ThemeToggle } from '../ThemeToggle';

export const Header = () => {
  const [showSettings, setShowSettings] = useState(false);
  return (
    <header 
      className="flex items-center justify-between p-4"
      style={{ 
        backgroundColor: '#2a2a2a',
        borderBottom: '1px solid #333',
        color: '#ffffff'
      }}
    >
      <div
        className="ml-10 flex cursor-pointer items-center text-lg font-bold"
        onClick={() => (window.location.href = '/')}
        style={{ color: '#ffffff' }}
      >
        <FaChessBoard className="mr-2" />
        <span className="text-xl">{project.title}</span>
      </div>
      <div className="relative">
        <button 
          className="mr-8" 
          onClick={() => setShowSettings(!showSettings)}
          style={{ color: '#ffffff' }}
        >
          <PiGearSixDuotone size={24} />
        </button>
        {showSettings && (
          <div 
            className="absolute right-0 mt-2 w-48 rounded-md shadow-lg"
            style={{ 
              backgroundColor: '#333',
              border: '1px solid #444'
            }}
          >
            <ul>
              <li 
                className="cursor-pointer px-4 py-2"
                style={{ 
                  color: '#ffffff',
                  borderBottom: '1px solid #444'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#444'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Language
              </li>
              <li 
                className="cursor-pointer px-4 py-2"
                style={{ 
                  color: '#ffffff',
                  borderBottom: '1px solid #444'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#444'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <ThemeToggle />
              </li>
              <li
                className="cursor-pointer px-4 py-2"
                style={{ 
                  color: '#ffffff',
                  borderBottom: '1px solid #444'
                }}
                onClick={() => (window.location.href = '/login')}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#444'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Login
              </li>
              <li
                className="cursor-pointer px-4 py-2"
                style={{ color: '#ffffff' }}
                onClick={() => (window.location.href = '/register')}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#444'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Register
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};