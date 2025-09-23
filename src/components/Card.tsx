'use client';

import React from 'react';
import { IconType } from 'react-icons';

type CardProps = {
  icon: IconType;
  title: string;
  description: string;
  route: string;
};

export const Card: React.FC<CardProps> = ({ icon: Icon, title, description, route }) => {
  return (
    <div
      className="flex size-64 cursor-pointer flex-col items-center justify-center space-y-4 rounded-lg p-6 shadow-md transition-transform hover:scale-105"
      style={{
        backgroundColor: '#EAB308',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)'
      }}
      onClick={() => (window.location.href = route)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 12px rgba(0, 0, 0, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.3)';
      }}
    >
      <Icon className="text-4xl" style={{ color: '#000000' }} />
      <h2 className="text-xl font-bold text-center" style={{ color: '#000000' }}>{title}</h2>
      <p className="text-center" style={{ color: '#333333' }}>{description}</p>
    </div>
  );
};