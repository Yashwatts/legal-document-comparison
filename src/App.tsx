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
    let yPosition = 30;
    const pageHeight = 280;
    const marginLeft = 20;
    const pageWidth = 170;
    
    // Helper function to add a new page if needed
    const checkPageBreak = (requiredHeight: number) => {
      if (yPosition + requiredHeight > pageHeight) {
        doc.addPage();
        yPosition = 30;
      }
    };
    
    // Helper function to add text with word wrapping
    const addWrappedText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      doc.setFont(undefined, isBold ? 'bold' : 'normal');
      const splitText = doc.splitTextToSize(text, pageWidth);
      const textHeight = splitText.length * (fontSize * 0.35);
      checkPageBreak(textHeight + 5);
      doc.text(splitText, marginLeft, yPosition);
      yPosition += textHeight + 5;
    };
    
    // Title Page
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('Professional Legal Document Analysis Report', marginLeft, yPosition);
    yPosition += 20;
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, marginLeft, yPosition);
    yPosition += 10;
    doc.text(`Original Document: ${comparison.oldDocument.name}`, marginLeft, yPosition);
    yPosition += 8;
    doc.text(`Updated Document: ${comparison.newDocument.name}`, marginLeft, yPosition);
    yPosition += 20;
    
    // Executive Summary
    checkPageBreak(40);
    addWrappedText('EXECUTIVE SUMMARY', 18, true);
    yPosition += 5;
    addWrappedText(comparison.executiveSummary, 11);
    yPosition += 10;
    
    // Risk Assessment
    checkPageBreak(30);
    addWrappedText('RISK ASSESSMENT', 16, true);
    addWrappedText(`Overall Risk Level: ${comparison.riskAssessment.overall}`, 12, true);
    addWrappedText(`Recommendation: ${comparison.riskAssessment.recommendation}`, 11);
    addWrappedText(`Risk Breakdown: High (${comparison.riskAssessment.breakdown.high}), Medium (${comparison.riskAssessment.breakdown.medium}), Low (${comparison.riskAssessment.breakdown.low})`, 11);
    yPosition += 10;
    
    // Changes Summary
    checkPageBreak(30);
    addWrappedText('CHANGES SUMMARY', 16, true);
    addWrappedText(`Total Changes: ${comparison.summary.totalChanges}`, 12, true);
    addWrappedText(`Additions: ${comparison.summary.additions} | Deletions: ${comparison.summary.deletions} | Modifications: ${comparison.summary.modifications}`, 11);
    yPosition += 10;
    
    // Document Analysis - Original
    if (comparison.oldDocumentSummary) {
      checkPageBreak(40);
      addWrappedText('ORIGINAL DOCUMENT ANALYSIS', 16, true);
      addWrappedText(`Document Type: ${comparison.oldDocumentSummary.documentType}`, 12, true);
      addWrappedText('Executive Summary:', 12, true);
      addWrappedText(comparison.oldDocumentSummary.executiveSummary, 10);
      
      if (comparison.oldDocumentSummary.keyFindings?.length > 0) {
        addWrappedText('Key Findings:', 12, true);
        comparison.oldDocumentSummary.keyFindings.slice(0, 5).forEach(finding => {
          addWrappedText(`• ${finding}`, 10);
        });
      }
      yPosition += 10;
    }
    
    // Document Analysis - Updated
    if (comparison.newDocumentSummary) {
      checkPageBreak(40);
      addWrappedText('UPDATED DOCUMENT ANALYSIS', 16, true);
      addWrappedText(`Document Type: ${comparison.newDocumentSummary.documentType}`, 12, true);
      addWrappedText('Executive Summary:', 12, true);
      addWrappedText(comparison.newDocumentSummary.executiveSummary, 10);
      
      if (comparison.newDocumentSummary.keyFindings?.length > 0) {
        addWrappedText('Key Findings:', 12, true);
        comparison.newDocumentSummary.keyFindings.slice(0, 5).forEach(finding => {
          addWrappedText(`• ${finding}`, 10);
        });
      }
      yPosition += 10;
    }
    
    // Detailed Changes Analysis
    if (comparison.changes.length > 0) {
      checkPageBreak(40);
      addWrappedText('DETAILED CHANGES ANALYSIS', 16, true);
      
      comparison.changes.forEach((change, index) => {
        checkPageBreak(35);
        addWrappedText(`${index + 1}. ${change.explanation.summary}`, 12, true);
        addWrappedText(`Type: ${change.type.toUpperCase()} | Risk Level: ${change.riskLevel} | Category: ${change.explanation.category}`, 10, true);
        addWrappedText(`Business Impact: ${change.businessImpact}`, 10);
        addWrappedText(`Plain Language: ${change.plainLanguage}`, 10);
        addWrappedText(`Recommended Action: ${change.recommendedAction}`, 10);
        yPosition += 5;
      });
    }
    
    // Footer on each page
    const totalPages = doc.internal.pages.length - 1; // -1 because pages is 1-indexed
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont(undefined, 'normal');
      doc.text(`Professional Legal Document Analysis Report - Page ${i} of ${totalPages}`, marginLeft, 290);
    }
    
    // Save the PDF with a professional name
    const timestamp = new Date().toISOString().split('T')[0];
    doc.save(`Legal_Document_Analysis_Report_${timestamp}.pdf`);
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
                  comparison={comparison}
                />
              </div>
              <div>
                <ChangesSummary
                  changes={comparison.changes}
                  riskAssessment={comparison.riskAssessment}
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