// app/index.tsx
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function RedirectToSplash() {
  useEffect(() => {
    router.replace('/splash');
  }, []);

  return null;
}
