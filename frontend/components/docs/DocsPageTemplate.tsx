import React from 'react';
import { Sidebar } from '@/components/docs/Sidebar';
import DocumentationContent from '@/components/docs/DocumentationContent';

export default function DocsPageTemplate() {
  return (
    <div className="flex flex-col lg:flex-row items-start gap-12 w-full pt-4">
      <Sidebar />
      <div className="flex-1 min-w-0 w-full mb-16">
        <DocumentationContent />
      </div>
    </div>
  );
}
