'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AutoRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push('/home');
  }, [router]);

  return <Suspense fallback={<div>Loading...</div>} />;
}