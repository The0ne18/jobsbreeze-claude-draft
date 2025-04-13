'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Sidebar from './Sidebar';
import WelcomeToast from '@/components/common/WelcomeToast';
import { Bars3Icon } from '@heroicons/react/24/outline';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/');
    },
  });

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile header with hamburger */}
      <div className="fixed top-0 left-0 z-40 flex h-16 w-full items-center gap-x-6 border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6 md:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-lg font-semibold">JobsBreeze</div>
      </div>

      {/* Sidebar for desktop and mobile */}
      <Sidebar 
        userEmail={session?.user?.email || ''} 
        mobileOpen={sidebarOpen} 
        setMobileOpen={setSidebarOpen}
      />

      {/* Main content */}
      <main className="md:pl-[240px] pt-0 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-20 md:pt-6 pb-6">
          {children}
        </div>
      </main>
      <WelcomeToast />
    </div>
  );
} 