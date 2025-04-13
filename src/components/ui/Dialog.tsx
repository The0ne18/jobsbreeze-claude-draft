'use client';

import { Fragment, useEffect } from 'react';
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  description?: string;
}

export default function Dialog({ 
  isOpen, 
  onClose, 
  title, 
  description,
  children 
}: DialogProps) {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <HeadlessDialog 
        as="div" 
        className="relative z-50"
        onClose={onClose}
        static
      >
        {/* Background overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>

        {/* Full-screen scrollable container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* Dialog panel */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <HeadlessDialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 sm:p-8 text-left align-middle shadow-xl transition-all">
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <HeadlessDialog.Title
                      as="h3"
                      className="text-lg sm:text-xl font-semibold leading-6 text-[#0F172A]"
                    >
                      {title}
                    </HeadlessDialog.Title>
                    <button
                      type="button"
                      className="rounded-lg p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-gray-100
                        transition-all duration-200 focus:outline-none focus:ring-2 
                        focus:ring-[#00B86B] focus:ring-offset-2"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close dialog</span>
                      <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                  {description && (
                    <HeadlessDialog.Description className="text-sm text-[#64748B]">
                      {description}
                    </HeadlessDialog.Description>
                  )}
                </div>

                <div className="text-[#0F172A]">
                  {children}
                </div>
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  );
} 