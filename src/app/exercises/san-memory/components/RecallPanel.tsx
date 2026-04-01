'use client';

import React, { useEffect, useRef } from 'react';

interface RecallPanelProps {
  isMobile: boolean;
  userInput: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
}

export function RecallPanel({
  isMobile,
  userInput,
  onInputChange,
  onSubmit,
}: RecallPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  if (isMobile) {
    return (
      <div className="w-full">
        <div className="text-xs text-neutral-400 mb-2.5 text-center">
          Enter the sequence from memory:
        </div>
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type the moves (e.g. e4 e5 Nf3)"
          className="w-full p-3 text-[15px] bg-chess-surface-light text-white border-2 border-[#444] rounded outline-none font-mono appearance-none box-border"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          autoFocus
        />
        <div className="text-[10px] text-[#888] mt-1 text-center">
          No move numbers needed, just the moves
        </div>
        <button
          onClick={onSubmit}
          className="w-full mt-2.5 p-3 text-[13px] rounded bg-chess-yellow text-black border-none cursor-pointer font-semibold min-h-[42px]"
        >
          Submit
        </button>
      </div>
    );
  }

  // Desktop
  return (
    <div className="w-full max-w-[400px]">
      <div className="text-base text-neutral-400 mb-4 text-center">
        Enter the sequence from memory:
      </div>
      <input
        ref={inputRef}
        type="text"
        value={userInput}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type the moves (e.g. e4 e5 Nf3 Nc6)"
        className="w-full p-3.5 text-lg bg-chess-surface-light text-white border-2 border-[#444] rounded outline-none font-mono transition-[border-color] duration-200"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        autoFocus
      />
      <div className="text-xs text-[#888] mt-2 text-center">
        No move numbers needed, just the moves separated by spaces
      </div>
      <button
        onClick={onSubmit}
        className="w-full mt-4 p-3 text-sm rounded bg-chess-yellow text-black border-none cursor-pointer font-semibold transition-transform duration-100 hover:scale-[1.02]"
      >
        Submit
      </button>
    </div>
  );
}
