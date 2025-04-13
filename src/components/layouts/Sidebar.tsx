import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  DocumentIcon,
  CubeIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { signOut } from 'next-auth/react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Clients', href: '/dashboard/clients', icon: UserGroupIcon },
  { name: 'Estimates', href: '/dashboard/estimates', icon: DocumentTextIcon },
  { name: 'Invoices', href: '/dashboard/invoices', icon: DocumentIcon },
  { name: 'Items', href: '/dashboard/items', icon: CubeIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

interface SidebarProps {
  userEmail: string;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default function Sidebar({ userEmail, mobileOpen = false, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  
  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    await signOut({ callbackUrl: '/' });
  };

  const NavLinks = () => (
    <>
      <div className="p-6">
        <h1 className="text-white text-xl font-semibold">JobsBreeze</h1>
      </div>
      <nav className="flex-1 space-y-1 px-4">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className={`group flex items-center px-3 py-2 text-[15px] font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#1E293B] text-white'
                  : 'text-[#94A3B8] hover:bg-[#1E293B]/50 hover:text-white'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[#1E293B]">
        <div className="flex flex-col">
          <p className="text-xs text-[#94A3B8]">Signed in as:</p>
          <p className="text-sm text-white truncate mt-0.5">{userEmail}</p>
          <button
            onClick={handleSignOut}
            className="mt-3 text-sm text-[#94A3B8] flex items-center hover:text-white transition-colors"
          >
            <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Transition.Root show={mobileOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 md:hidden" onClose={() => setMobileOpen?.(false)}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute right-0 top-0 flex w-16 justify-center pt-5">
                    <button 
                      type="button" 
                      className="-m-2.5 p-2.5 text-white"
                      onClick={() => setMobileOpen?.(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-[#0F172A] w-full">
                  <NavLinks />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar (always visible) */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:flex-col md:w-[240px] bg-[#0F172A]">
        <NavLinks />
      </div>
    </>
  );
} 