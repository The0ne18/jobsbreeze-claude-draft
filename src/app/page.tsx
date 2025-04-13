'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { LoginForm, SignUpForm } from '@/components/features/auth';

export default function Home() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('login') === 'true' ? 'login' : 'login');

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
      <div className="w-full max-w-[500px] mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-[48px] font-bold mb-2 text-[#0F172A]">JobsBreeze</h1>
          <p className="text-[20px] text-[#64748B]">Manage clients, estimates, and invoices with ease</p>
        </div>

        <div className="flex bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 text-[16px] font-medium py-3 px-6 transition-colors ${
              activeTab === 'login'
                ? 'text-[#0F172A] bg-white'
                : 'text-[#64748B] bg-[#F1F5F9] hover:text-[#0F172A]'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 text-[16px] font-medium py-3 px-6 transition-colors ${
              activeTab === 'signup'
                ? 'text-[#0F172A] bg-white'
                : 'text-[#64748B] bg-[#F1F5F9] hover:text-[#0F172A]'
            }`}
          >
            Sign Up
          </button>
        </div>

        {activeTab === 'login' ? <LoginForm /> : <SignUpForm />}
      </div>
    </main>
  );
}
