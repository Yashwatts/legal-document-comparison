import { DiffSegment } from '../types';

interface DiffRendererProps {
  differences: DiffSegment[];
  viewType: 'original' | 'updated';
}

export function DiffRenderer({ differences, viewType }: DiffRendererProps) {
  return (
    <div className="font-mono text-sm leading-relaxed text-gray-200">
      {differences.map((diff, index) => {
        const shouldShow = 
          diff.type === 'unchanged' ||
          (viewType === 'original' && diff.type === 'deletion') ||
          (viewType === 'updated' && diff.type === 'addition');

        if (!shouldShow) {
          return null;
        }

        return (
          <span
            key={index}
            className={`${getHighlightClass(diff.type)} ${
              diff.type === 'deletion' ? 'line-through' : ''
            }`}
          >
            {diff.text}
          </span>
        );
      })}
    </div>
  );
}

function getHighlightClass(type: string): string {
  switch (type) {
    case 'addition':
      return 'bg-green-800 text-green-200 border-l-4 border-green-400 pl-1';
    case 'deletion':
      return 'bg-red-800 text-red-200 border-l-4 border-red-400 pl-1';
    case 'modification':
      return 'bg-yellow-800 text-yellow-200 border-l-4 border-yellow-400 pl-1';
    default:
      return 'text-gray-200';
  }
}