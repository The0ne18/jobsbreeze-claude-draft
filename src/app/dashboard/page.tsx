'use client';

import { useRouter } from 'next/navigation';
import QuickAction from '@/components/ui/QuickAction';
import ActionButton from '@/components/ui/ActionButton';
import StatsCard from '@/components/ui/StatsCard';
import {
  DocumentIcon,
  ClockIcon,
  ExclamationCircleIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const router = useRouter();

  const handleCreateEstimate = () => {
    router.push('/dashboard/estimates?new=true');
  };

  const handleCreateInvoice = () => {
    router.push('/dashboard/invoices?new=true');
  };

  const handleAddClient = () => {
    router.push('/dashboard/clients');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Welcome to JobsBreeze</h1>
        <p className="text-gray-600 mt-1">Your business management dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Open Estimates"
          value="5"
          Icon={DocumentIcon}
          color="bg-blue-500"
        />
        <StatsCard
          title="Pending Invoices"
          value="3"
          Icon={ClockIcon}
          color="bg-orange-500"
        />
        <StatsCard
          title="Overdue Invoices"
          value="1"
          Icon={ExclamationCircleIcon}
          color="bg-red-500"
        />
        <StatsCard
          title="Total Outstanding"
          value="$4250.75"
          Icon={DocumentIcon}
          color="bg-green-500"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <QuickAction
            title="Create Estimate"
            Icon={DocumentIcon}
            color="bg-emerald-500 hover:bg-emerald-600"
            onClick={handleCreateEstimate}
          />
          <QuickAction
            title="New Invoice"
            Icon={DocumentIcon}
            color="bg-sky-500 hover:bg-sky-600"
            onClick={handleCreateInvoice}
          />
          <QuickAction
            title="Add Client"
            Icon={UserPlusIcon}
            color="bg-white hover:bg-gray-50 !text-gray-900 border"
            onClick={handleAddClient}
          />
        </div>
      </div>

      {/* Recent Activity and Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Clients */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold">Recent Clients</h2>
              <p className="text-gray-600 text-sm">Your most recently added clients</p>
            </div>
            <ActionButton onClick={() => router.push('/dashboard/clients')}>
              <span className="flex items-center">
                <UserPlusIcon className="w-5 h-5 mr-1" />
                View All 3 Clients
              </span>
            </ActionButton>
          </div>
          <div className="text-gray-600 text-center py-8">
            Start adding clients to see them here
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <p className="text-gray-600 text-sm">Your latest business actions</p>
          </div>
          <div className="text-center py-8 space-y-2">
            <p className="text-gray-600">Start creating estimates and invoices</p>
            <p className="text-gray-500">Your recent activity will appear here</p>
            <div className="flex gap-4 justify-center mt-4">
              <ActionButton onClick={handleCreateEstimate}>Create Estimate</ActionButton>
              <ActionButton onClick={handleCreateInvoice}>Create Invoice</ActionButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 