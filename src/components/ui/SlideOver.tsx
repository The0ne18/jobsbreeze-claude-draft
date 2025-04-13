'use client';

import { Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface SlideOverProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  description?: string;
  size?: 'md' | 'lg' | 'xl';
}

export default function SlideOver({ 
  open, 
  onClose, 
  title, 
  children, 
  description,
  size = 'lg' 
}: SlideOverProps) {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  const maxWidthClass = {
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[size];

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog 
        as="div" 
        className="relative z-50"
        onClose={onClose}
        static
      >
        {/* Background overlay with blur */}
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity" aria-hidden="true" />
        </Transition.Child>

        {/* Slide-over container */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            {/* Position the slide-over on the right */}
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel 
                  className={`pointer-events-auto w-screen ${maxWidthClass}`}
                >
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    {/* Header */}
                    <div className="px-4 py-6 sm:px-6 border-b border-[#E2E8F0]">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <Dialog.Title 
                            as="h2" 
                            className="text-xl sm:text-2xl font-semibold text-[#0F172A] tracking-tight"
                          >
                            {title}
                          </Dialog.Title>
                          {description && (
                            <Dialog.Description className="text-sm text-[#64748B]">
                              {description}
                            </Dialog.Description>
                          )}
                        </div>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-lg p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-gray-100
                              transition-all duration-200 focus:outline-none focus:ring-2 
                              focus:ring-[#00B86B] focus:ring-offset-2"
                            onClick={onClose}
                          >
                            <span className="sr-only">Close panel</span>
                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="relative flex-1 px-4 py-6 sm:px-6 text-[#0F172A]">
                      {children}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 