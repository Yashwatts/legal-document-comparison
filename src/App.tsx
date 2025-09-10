import { useState } from 'react';
import { DocumentUpload } from './components/DocumentUpload';
import { DocumentViewer } from './components/DocumentViewer';
import { ChangesSummary } from './components/ChangesSummary';
import { DocumentComparison, UploadedFile } from './types';
import { compareDocuments, checkServerHealth } from './utils/documentApi';
import { AlertCircle, FileText, Download } from 'lucide-react';
import jsPDF from 'jspdf';

function App() {
  const [comparison, setComparison] = useState<DocumentComparison | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [serverStatus, setServerStatus] = useState<boolean | null>(null);

  const handleFilesUploaded = async (oldFile: UploadedFile, newFile: UploadedFile) => {
    setIsLoading(true);
    setError('');
    setComparison(null);

    // Check server health first
    const isServerHealthy = await checkServerHealth();
    setServerStatus(isServerHealthy);
    
    if (!isServerHealthy) {
      setError('Backend server is not responding. Please ensure the server is running on port 3001.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await compareDocuments(oldFile, newFile);
      setComparison(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while comparing documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setComparison(null);
    setError('');
    setServerStatus(null);
  };

  const exportResults = () => {
    if (!comparison) return;
    
    const doc = new jsPDF();
    
    // Set up the PDF
    doc.setFontSize(20);
    doc.text('Document Comparison Report', 20, 30);
    
    doc.setFontSize(12);
    doc.text(`Original: ${comparison.oldDocument.name}`, 20, 50);
    doc.text(`Updated: ${comparison.newDocument.name}`, 20, 60);
    
    // Summary section
    doc.setFontSize(16);
    doc.text('Summary', 20, 85);
    doc.setFontSize(12);
    doc.text(`Total Changes: ${comparison.summary.totalChanges}`, 20, 100);
    doc.text(`Additions: ${comparison.summary.additions}`, 20, 110);
    doc.text(`Deletions: ${comparison.summary.deletions}`, 20, 120);
    doc.text(`Modifications: ${comparison.summary.modifications}`, 20, 130);
    
    // Changes section
    let yPosition = 150;
    doc.setFontSize(16);
    doc.text('Detailed Changes', 20, yPosition);
    yPosition += 20;
    
    comparison.changes.forEach((change, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`${index + 1}. ${change.explanation.summary}`, 20, yPosition);
      yPosition += 10;
      
      doc.setFont(undefined, 'normal');
      doc.text(`Type: ${change.type.toUpperCase()}`, 25, yPosition);
      yPosition += 8;
      doc.text(`Impact: ${change.impact.toUpperCase()}`, 25, yPosition);
      yPosition += 8;
      doc.text(`Category: ${change.explanation.category}`, 25, yPosition);
      yPosition += 8;
      
      // Split long text into multiple lines
      const splitDetail = doc.splitTextToSize(change.explanation.detail, 160);
      doc.text(splitDetail, 25, yPosition);
      yPosition += splitDetail.length * 5 + 10;
    });
    
    // Save the PDF
    doc.save('document-comparison-report.pdf');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#040b13' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Server status indicator */}
        {serverStatus === false && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-center max-w-4xl mx-auto">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
            <div>
              <span className="text-yellow-700 font-medium">Backend Server Not Running</span>
              <p className="text-yellow-600 text-sm mt-1">
                Please start the backend server by running <code className="bg-yellow-100 px-1 rounded">npm run server</code> in a separate terminal.
              </p>
            </div>
          </div>
        )}

        {!comparison ? (
          <div className="max-w-4xl mx-auto">
            <DocumentUpload 
              onFilesUploaded={handleFilesUploaded}
              isLoading={isLoading}
            />
            
            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-center max-w-4xl mx-auto">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                <div>
                  <span className="text-red-700 font-medium">Error</span>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header with actions */}
            <div className="flex items-center justify-between rounded-lg shadow-sm p-4" style={{ backgroundColor: '#040b13', border: '1px solid #374151' }}>
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-blue-400" />
                <div>
                  <h1 className="text-xl font-semibold text-white">
                    Document Comparison Results
                  </h1>
                  <p className="text-sm text-gray-400">
                    {comparison.oldDocument.name} vs {comparison.newDocument.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={exportResults}
                  className="inline-flex items-center px-4 py-2 border border-gray-500 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
                  style={{ backgroundColor: '#0a1520' }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </button>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  New Comparison
                </button>
              </div>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <DocumentViewer
                  oldDocumentName={comparison.oldDocument.name}
                  newDocumentName={comparison.newDocument.name}
                  differences={comparison.differences}
                  changes={comparison.changes}
                />
              </div>
              <div>
                <ChangesSummary
                  changes={comparison.changes}
                  summary={comparison.summary}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;