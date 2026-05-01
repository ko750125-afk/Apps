'use client';

import React, { useEffect, useState } from 'react';

export default function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a matching structure but without the problematic dynamic content
    // to avoid hydration mismatch while loading
    return null;
  }

  return <>{children}</>;
}
