import React from 'react';
import DocumentationContent from '@/components/docs/DocumentationContent';
import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1 w-full max-w-4xl mx-auto py-12 px-6">
            <DocumentationContent />
        </main>
    </div>
  );
}
