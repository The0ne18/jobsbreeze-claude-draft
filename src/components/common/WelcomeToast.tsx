'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function WelcomeToast() {
  const { data: session, status } = useSession();
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Handle initial mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    let hasShownWelcome = false;
    try {
      hasShownWelcome = sessionStorage.getItem('hasShownWelcome') === 'true';
    } catch (error) {
      // Handle cases where sessionStorage is not available
      console.error('SessionStorage not available:', error);
    }
    
    if (status === 'authenticated' && !hasShownWelcome) {
      setIsVisible(true);
      try {
        sessionStorage.setItem('hasShownWelcome', 'true');
      } catch (error) {
        console.error('Failed to set sessionStorage:', error);
      }
      
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [status, isMounted]);

  // Don't render anything during SSR or before mount
  if (!isMounted) return null;
  
  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 shadow-lg rounded-lg z-50 animate-fade-in-up">
      <p className="text-base font-medium text-[#0F172A]">
        Welcome, {session?.user?.email?.split('@')[0]}!
      </p>
    </div>
  );
} 