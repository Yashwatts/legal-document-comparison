import { useState } from 'react';
import { Change } from '../types';
import { ChevronDown, ChevronRight, AlertTriangle, Info, TrendingUp } from 'lucide-react';

interface ChangesSummaryProps {
  changes: Change[];
  summary: {
    totalChanges: number;
    additions: number;
    deletions: number;
    modifications: number;
  };
}

export function ChangesSummary({ changes, summary }: ChangesSummaryProps) {
  const [expandedChanges, setExpandedChanges] = useState<Set<number>>(new Set());

  const toggleChange = (index: number) => {
    const newExpanded = new Set(expandedChanges);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedChanges(newExpanded);
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <TrendingUp className="h-4 w-4 text-yellow-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getImpactBadgeClass = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'financial':
        return 'bg-green-100 text-green-800';
      case 'termination':
        return 'bg-red-100 text-red-800';
      case 'liability':
        return 'bg-orange-100 text-orange-800';
      case 'rights':
        return 'bg-purple-100 text-purple-800';
      case 'date':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: '#040b13' }}>
      <div className="px-6 py-4 border-b border-gray-600" style={{ backgroundColor: '#0a1520' }}>
        <h2 className="text-lg font-semibold text-white">Summary of Changes</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{summary.totalChanges}</div>
            <div className="text-sm text-gray-400">Total Changes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{summary.additions}</div>
            <div className="text-sm text-gray-400">Additions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{summary.deletions}</div>
            <div className="text-sm text-gray-400">Deletions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{summary.modifications}</div>
            <div className="text-sm text-gray-400">Modifications</div>
          </div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {changes.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No significant changes detected between the documents.
          </div>
        ) : (
          <div className="divide-y divide-gray-600">
            {changes.map((change, index) => (
              <div key={index} className="p-4 transition-colors" style={{ backgroundColor: '#040b13' }}>
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleChange(index)}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    {getImpactIcon(change.impact)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-white">
                          {change.explanation.summary}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getImpactBadgeClass(change.impact)}`}>
                          {change.impact.toUpperCase()}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryBadgeClass(change.explanation.category)}`}>
                          {change.explanation.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {change.explanation.detail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                      change.type === 'addition' ? 'bg-green-100 text-green-800' :
                      change.type === 'deletion' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {change.type}
                    </span>
                    {expandedChanges.has(index) ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {expandedChanges.has(index) && (
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <div className="rounded-md p-3 mb-3" style={{ backgroundColor: '#0a1520' }}>
                      <h4 className="text-sm font-medium text-white mb-2">Changed Text:</h4>
                      <p className="text-sm text-gray-300 font-mono p-2 rounded border border-gray-600" style={{ backgroundColor: '#040b13' }}>
                        "{change.text.slice(0, 300)}{change.text.length > 300 ? '...' : ''}"
                      </p>
                    </div>
                    <div className="rounded-md p-3" style={{ backgroundColor: '#0a1520' }}>
                      <h4 className="text-sm font-medium text-white mb-2">Detailed Explanation:</h4>
                      <p className="text-sm text-gray-300">
                        {change.explanation.detail}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}