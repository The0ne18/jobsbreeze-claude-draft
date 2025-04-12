import Link from 'next/link';
import {
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  DocumentIcon,
  CubeIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Clients', href: '/dashboard/clients', icon: UserGroupIcon },
  { name: 'Estimates', href: '/dashboard/estimates', icon: DocumentTextIcon },
  { name: 'Invoices', href: '/dashboard/invoices', icon: DocumentIcon },
  { name: 'Items', href: '/dashboard/items', icon: CubeIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  return (
    <div className="flex h-full flex-col bg-[#1C1C28] w-[200px] fixed left-0 top-0">
      <div className="p-4">
        <h1 className="text-white text-xl font-semibold">JobsBreeze</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <item.icon className="mr-3 h-6 w-6 flex-shrink-0" aria-hidden="true" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 text-sm text-gray-400 border-t border-gray-700">
        Signed in as:<br />
        jdoe123@email.com
      </div>
    </div>
  );
} 