import React from 'react';

export const sliderStyles: React.CSSProperties = {
  width: '100%',
  height: '8px',
  borderRadius: '4px',
  background: '#333',
  outline: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  WebkitAppearance: 'none',
  appearance: 'none' as const,
};

export const sliderThumbCSS = `
  input[type="range"]::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #EAB308;
    cursor: pointer;
    border: 2px solid #1a1a1a;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(234, 179, 8, 0.4);
  }
  input[type="range"]::-webkit-slider-thumb:active {
    transform: scale(1.2);
    box-shadow: 0 4px 12px rgba(234, 179, 8, 0.6);
  }
  input[type="range"]::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #EAB308;
    cursor: pointer;
    border: 2px solid #1a1a1a;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  input[type="range"]::-moz-range-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(234, 179, 8, 0.4);
  }
  input[type="range"]::-moz-range-thumb:active {
    transform: scale(1.2);
    box-shadow: 0 4px 12px rgba(234, 179, 8, 0.6);
  }
  input[type="range"]:hover {
    background: #444;
  }
  input[type="range"]:focus {
    background: #444;
    box-shadow: 0 0 0 2px rgba(234, 179, 8, 0.3);
  }
`;

export const COLORS = {
  bg: '#1a1a1a',
  surface: '#2a2a2a',
  surfaceLight: '#333',
  yellow: '#EAB308',
  trail: '#F1C40F',
  green: '#4CAF50',
  red: '#f44336',
  blue: '#2196F3',
  orange: '#FF9800',
  text: '#ffffff',
  textMuted: '#ccc',
  textDim: '#666',
} as const;
