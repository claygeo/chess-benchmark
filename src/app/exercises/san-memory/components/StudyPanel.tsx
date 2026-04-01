'use client';

import React from 'react';

interface StudyPanelProps {
  isMobile: boolean;
  sequence: string;
  formattedSequence: string;
  timeLeft: number;
  totalStudyTime: number;
}

export function StudyPanel({
  isMobile,
  sequence,
  formattedSequence,
  timeLeft,
  totalStudyTime,
}: StudyPanelProps) {
  if (isMobile) {
    return (
      <div className="text-center w-full">
        <div className="text-xs text-chess-yellow mb-3">
          Memorize this sequence:
        </div>
        <div className="text-xl font-bold font-mono text-white leading-relaxed p-2.5 bg-[#1e1e1e] rounded-md break-words w-full">
          {sequence}
        </div>
        <div className="mt-3.5 text-sm text-chess-yellow font-bold">
          Time: {timeLeft}s
        </div>
        <div className="w-full h-[3px] bg-chess-surface-light rounded-sm overflow-hidden mx-auto my-1.5">
          <div
            className="h-full bg-chess-yellow transition-[width] duration-1000 linear"
            style={{ width: `${(timeLeft / totalStudyTime) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  // Desktop
  return (
    <div className="text-center">
      <div className="text-base text-chess-yellow mb-6">
        Memorize this sequence:
      </div>
      <div className="text-[28px] font-bold font-mono text-white leading-[1.8] p-5 bg-[#1e1e1e] rounded-md min-w-[300px]">
        {formattedSequence}
      </div>
      <div className="mt-[30px] text-xl text-chess-yellow font-bold">
        Time: {timeLeft}s
      </div>
      <div className="w-[200px] h-1.5 bg-chess-surface-light rounded-sm overflow-hidden mx-auto my-2.5">
        <div
          className="h-full bg-chess-yellow transition-[width] duration-1000 linear"
          style={{ width: `${(timeLeft / totalStudyTime) * 100}%` }}
        />
      </div>
    </div>
  );
}
