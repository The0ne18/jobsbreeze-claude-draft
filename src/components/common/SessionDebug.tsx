'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function WelcomeToast() {
  const { data: session, status } = useSession();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if we've shown the welcome message in this session
    const hasShownWelcome = sessionStorage.getItem('hasShownWelcome');
    
    if (status === 'authenticated' && !hasShownWelcome) {
      setIsVisible(true);
      sessionStorage.setItem('hasShownWelcome', 'true');
      
      // Hide the message after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [status]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 shadow-lg rounded-lg z-50 animate-fade-in-up">
      <p className="text-base font-medium text-[#0F172A]">
        Welcome, {session?.user?.email?.split('@')[0]}!
      </p>
    </div>
  );
}

// Add this to your globals.css or tailwind config
// @keyframes fadeInUp {
//   from {
//     opacity: 0;
//     transform: translateY(1rem);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }
// .animate-fade-in-up {
//   animation: fadeInUp 0.3s ease-out;
// } 