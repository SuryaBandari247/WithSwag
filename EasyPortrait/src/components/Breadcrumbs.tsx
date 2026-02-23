import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  toolName: string;
  currentStep?: string;
}

function Breadcrumbs({ toolName, currentStep }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-500 font-medium px-4 py-2">
      <a href="/" className="hover:text-indigo-600 transition-colors">WithSwag</a>
      <ChevronRight size={14} className="text-gray-400" />
      <span className={currentStep ? 'hover:text-indigo-600 transition-colors cursor-pointer' : 'text-gray-900'}>
        {toolName}
      </span>
      {currentStep && (
        <>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="text-gray-900">{currentStep}</span>
        </>
      )}
    </nav>
  );
}

export default Breadcrumbs;
