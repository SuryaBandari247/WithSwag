import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  toolName: string;
  currentStep?: string;
}

function Breadcrumbs({ toolName, currentStep }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-500 font-medium px-4 py-2 dark:text-slate-400">
      <a href="/" className="hover:text-indigo-600 transition-colors dark:text-slate-400 dark:hover:text-indigo-400">WithSwag</a>
      <ChevronRight size={14} className="text-gray-400 dark:text-slate-600" />
      <span className={currentStep ? 'hover:text-indigo-600 transition-colors cursor-pointer dark:hover:text-indigo-400' : 'text-gray-900 dark:text-slate-100'}>
        {toolName}
      </span>
      {currentStep && (
        <>
          <ChevronRight size={14} className="text-gray-400 dark:text-slate-600" />
          <span className="text-gray-900 dark:text-slate-100">{currentStep}</span>
        </>
      )}
    </nav>
  );
}

export default Breadcrumbs;
