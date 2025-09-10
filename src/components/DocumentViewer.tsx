import React, { useState } from 'react';
import { DiffSegment, Change } from '../types';
import { DiffRenderer } from './DiffRenderer';
import { Eye, EyeOff } from 'lucide-react';

interface DocumentViewerProps {
  oldDocumentName: string;
  newDocumentName: string;
  differences: DiffSegment[];
  changes: Change[];
}

export function DocumentViewer({ oldDocumentName, newDocumentName, differences, changes }: DocumentViewerProps) {
  const [showChangesOnly, setShowChangesOnly] = useState(false);

  const filteredDifferences = showChangesOnly 
    ? differences.filter(diff => diff.type !== 'unchanged')
    : differences;

  const getHighlightClass = (type: string) => {
    switch (type) {
      case 'addition':
        return 'text-green-200 bg-green-800';
      case 'deletion':
        return 'text-red-200 bg-red-800';
      case 'modification':
        return 'text-yellow-200 bg-yellow-800';
      default:
        return 'text-gray-200';
    }
  };

  const highlightText = (sentence: string, highlights: { text: string; type: string }[]) => {
    if (!sentence || highlights.length === 0) {
      return sentence || 'No text for this change.';
    }

    let result = sentence;
    const parts: JSX.Element[] = [];
    let lastIndex = 0;

    // Sort highlights by their position in the sentence to avoid overlapping issues
    const sortedHighlights = highlights
      .map(h => ({
        ...h,
        index: sentence.indexOf(h.text)
      }))
      .filter(h => h.index !== -1)
      .sort((a, b) => a.index - b.index);

    sortedHighlights.forEach(({ text, type, index }, i) => {
      if (index >= lastIndex) {
        // Add text before the highlight
        if (index > lastIndex) {
          parts.push(<span key={`plain-${i}`}>{sentence.slice(lastIndex, index)}</span>);
        }
        // Add highlighted text
        parts.push(
          <span key={`highlight-${i}`} className={getHighlightClass(type)}>
            {text}
          </span>
        );
        lastIndex = index + text.length;
      }
    });

    // Add remaining text after the last highlight
    if (lastIndex < sentence.length) {
      parts.push(<span key="plain-end">{sentence.slice(lastIndex)}</span>);
    }

    return parts.length > 0 ? parts : sentence;
  };

  return (
    <div className="rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: '#040b13' }}>
      <div className="px-6 py-4 border-b border-gray-600" style={{ backgroundColor: '#0a1520' }}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Document Comparison</h2>
          <button
            onClick={() => setShowChangesOnly(!showChangesOnly)}
            className="inline-flex items-center px-3 py-1 border border-gray-500 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
            style={{ backgroundColor: '#0a1520' }}
          >
            {showChangesOnly ? (
              <>
                <Eye className="h-4 w-4 mr-1" />
                Show All
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4 mr-1" />
                Changes Only
              </>
            )}
          </button>
        </div>
        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-200 border border-red-400 rounded mr-2"></div>
            <span>Deletions</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-200 border border-green-400 rounded mr-2"></div>
            <span>Additions</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-200 border border-yellow-400 rounded mr-2"></div>
            <span>Modifications</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 h-96">
        {/* Original Document */}
        <div className="border-r border-gray-600">
          <div className="px-4 py-2 border-b border-gray-600" style={{ backgroundColor: '#0a1520' }}>
            <h3 className="text-sm font-medium text-gray-300 truncate">
              Original: {oldDocumentName}
            </h3>
          </div>
          <div className="p-4 overflow-y-auto h-80">
            {showChangesOnly ? (
              <div className="space-y-2 text-sm">
                <h4 className="font-medium text-white">Original Text</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-200">
                  {changes
                    .filter(change => change.originalSentence)
                    .map((change, index) => (
                      <li key={index} className="py-1 px-2 rounded">
                        {highlightText(change.originalSentence, change.originalHighlights)}
                      </li>
                    ))}
                </ul>
              </div>
            ) : (
              <DiffRenderer 
                differences={filteredDifferences} 
                viewType="original"
              />
            )}
          </div>
        </div>

        {/* Updated Document */}
        <div>
          <div className="px-4 py-2 border-b border-gray-600" style={{ backgroundColor: '#0a1520' }}>
            <h3 className="text-sm font-medium text-gray-300 truncate">
              Updated: {newDocumentName}
            </h3>
          </div>
          <div className="p-4 overflow-y-auto h-80">
            {showChangesOnly ? (
              <div className="space-y-2 text-sm">
                <h4 className="font-medium text-white">Modified Text</h4>
                <ul className="list-disc pl-5 space-y-2 text-gray-200">
                  {changes
                    .filter(change => change.modifiedSentence)
                    .map((change, index) => (
                      <li key={index} className="py-1 px-2 rounded">
                        {highlightText(change.modifiedSentence, change.modifiedHighlights)}
                      </li>
                    ))}
                </ul>
              </div>
            ) : (
              <DiffRenderer 
                differences={filteredDifferences} 
                viewType="updated"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}