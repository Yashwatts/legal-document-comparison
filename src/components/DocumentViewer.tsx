import React, { useState } from 'react';
import { DocumentComparison } from '../types';
import { Eye, EyeOff } from 'lucide-react';

interface DocumentViewerProps {
  comparison: DocumentComparison;
}

export function DocumentViewer({ comparison }: DocumentViewerProps) {
  const [showChangesOnly, setShowChangesOnly] = useState(false);

  const changes = comparison.changes || [];
  const oldDocumentName = comparison.oldDocument.name;
  const newDocumentName = comparison.newDocument.name;

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
            <h3 className="text-sm font-medium text-gray-300 break-words">
              Original: {oldDocumentName}
            </h3>
          </div>
          <div className="p-4 overflow-y-auto h-80">
            {showChangesOnly ? (
              <div className="space-y-2 text-sm">
                <h4 className="font-medium text-white">Changes in Original</h4>
                <div className="space-y-2 text-gray-200">
                  {changes.map((change, index) => (
                    <div key={index} className="p-2 rounded border-l-2 border-red-600" style={{ backgroundColor: '#0a1520' }}>
                      <div className="text-xs text-red-400 mb-1">{change.type.toUpperCase()}</div>
                      <div className="text-sm">{change.explanation.summary}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-gray-300 text-sm p-4">
                <h4 className="font-medium mb-2">Original Document</h4>
                <div className="max-h-64 overflow-y-auto">
                  <p className="whitespace-pre-wrap">{comparison.oldDocument.text}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Updated Document */}
        <div>
          <div className="px-4 py-2 border-b border-gray-600" style={{ backgroundColor: '#0a1520' }}>
            <h3 className="text-sm font-medium text-gray-300 break-words">
              Updated: {newDocumentName}
            </h3>
          </div>
          <div className="p-4 overflow-y-auto h-80">
            {showChangesOnly ? (
              <div className="space-y-2 text-sm">
                <h4 className="font-medium text-white">Changes in Updated</h4>
                <div className="space-y-2 text-gray-200">
                  {changes.map((change, index) => (
                    <div key={index} className="p-2 rounded border-l-2 border-green-600" style={{ backgroundColor: '#0a1520' }}>
                      <div className="text-xs text-green-400 mb-1">{change.type.toUpperCase()}</div>
                      <div className="text-sm">{change.plainLanguage || change.explanation.summary}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-gray-300 text-sm p-4">
                <h4 className="font-medium mb-2">Updated Document</h4>
                <div className="max-h-64 overflow-y-auto">
                  <p className="whitespace-pre-wrap">{comparison.newDocument.text}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}