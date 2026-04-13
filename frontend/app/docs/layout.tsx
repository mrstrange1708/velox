import React from 'react';
import Navbar from '@/components/Navbar';
import { Sidebar } from '@/components/docs/Sidebar';
import { SearchModal } from '@/components/ui/SearchModal';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
          {children}
      </div>
      <SearchModal />
    </div>
  );
}
