'use client';

import { useEffect, useState } from 'react';

export function useMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [breakpoint]);

  return { isMobile, isMounted };
}
