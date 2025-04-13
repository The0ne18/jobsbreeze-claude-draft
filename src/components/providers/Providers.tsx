'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient, setQueryClient] = useState<QueryClient | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000, // 1 minute
          refetchOnWindowFocus: false,
        },
      },
    });
    
    setQueryClient(client);
    setIsInitialized(true);
  }, []);

  // Prevent rendering until client-side initialization is complete
  if (!isInitialized || !queryClient) {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>{children}</SessionProvider>
    </QueryClientProvider>
  );
} 