'use client';

import React from 'react';
import Link from 'next/link';
import { IconType } from 'react-icons';

type CardProps = {
  icon: IconType;
  title: string;
  description: string;
  route: string;
};

export const Card: React.FC<CardProps> = ({ icon: Icon, title, description, route }) => {
  return (
    <Link
      href={route}
      className="flex size-64 cursor-pointer flex-col items-center justify-center space-y-4 rounded-lg bg-chess-yellow p-6 shadow-chess-card transition-transform hover:-translate-y-1 hover:shadow-lg no-underline"
    >
      <Icon className="text-4xl text-black" />
      <h2 className="text-center text-xl font-bold text-black">{title}</h2>
      <p className="text-center text-[#333]">{description}</p>
    </Link>
  );
};
