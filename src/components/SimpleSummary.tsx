import { useState } from 'react';
import { EnhancedChange, RiskAssessment } from '../types';
import { 
  DollarSign, 
  Calendar, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  ThumbsUp, 
  ThumbsDown,
  Clock,
  FileText,
  Users,
  Zap
} from 'lucide-react';

interface SimpleSummaryProps {
  changes: EnhancedChange[];
  summary: {
    totalChanges: number;
    additions: number;
    deletions: number;
    modifications: number;
  };
  riskAssessment: RiskAssessment;
}

export function SimpleSummary({ changes, summary, riskAssessment }: SimpleSummaryProps) {
  const [selectedChange, setSelectedChange] = useState<number | null>(null);

  // Convert technical categories to user-friendly ones
  const getUserFriendlyCategory = (category: string) => {
    const categoryMap: { [key: string]: { icon: any, name: string, color: string } } = {
      financial: { icon: DollarSign, name: "Money Matters", color: "text-green-600" },
      termination: { icon: AlertTriangle, name: "Contract Ending", color: "text-red-600" },
      liability: { icon: Shield, name: "Protection & Risk", color: "text-orange-600" },
      rights: { icon: Users, name: "Your Rights", color: "text-blue-600" },
      date: { icon: Calendar, name: "Important Dates", color: "text-purple-600" },
      duration: { icon: Clock, name: "Time Limits", color: "text-indigo-600" },
      obligation: { icon: FileText, name: "What You Must Do", color: "text-gray-600" },
      compliance: { icon: CheckCircle, name: "Rules to Follow", color: "text-cyan-600" },
      risk: { icon: Zap, name: "Risks & Safety", color: "text-yellow-600" },
      general: { icon: Info, name: "General Changes", color: "text-gray-500" }
    };
    
    return categoryMap[category] || categoryMap.general;
  };

  // Convert impact to simple terms
  const getSimpleImpact = (impact: string) => {
    if (impact === 'high') {
      return { 
        text: "🔴 Very Important", 
        description: "This change is very important and affects you significantly",
        bgColor: "bg-red-50 border-red-200",
        textColor: "text-red-800"
      };
    } else if (impact === 'medium') {
      return { 
        text: "🟡 Somewhat Important", 
        description: "This change is moderately important",
        bgColor: "bg-yellow-50 border-yellow-200",
        textColor: "text-yellow-800"
      };
    } else {
      return { 
        text: "🟢 Minor Change", 
        description: "This is a small change that may not affect you much",
        bgColor: "bg-green-50 border-green-200",
        textColor: "text-green-800"
      };
    }
  };

  // Convert change type to simple explanation
  const getSimpleChangeType = (type: string) => {
    switch (type) {
      case 'addition':
        return { icon: <ThumbsUp className="h-4 w-4" />, text: "Something New Added", color: "text-green-600" };
      case 'deletion':
        return { icon: <ThumbsDown className="h-4 w-4" />, text: "Something Removed", color: "text-red-600" };
      case 'modification':
        return { icon: <Info className="h-4 w-4" />, text: "Something Changed", color: "text-blue-600" };
      default:
        return { icon: <Info className="h-4 w-4" />, text: "Changed", color: "text-gray-600" };
    }
  };

  // Generate simple explanation
  const getSimpleExplanation = (change: EnhancedChange) => {
    const category = getUserFriendlyCategory(change.category);
    const changeType = getSimpleChangeType(change.type);
    
    return {
      whatChanged: `${category.name}: ${changeType.text}`,
      whatItMeans: generateWhatItMeans(change),
      whatToDo: generateWhatToDo(change)
    };
  };

  const generateWhatItMeans = (change: EnhancedChange) => {
    const { category, type } = change;
    
    // Simple explanations based on category and type
    if (category === 'financial') {
      if (type === 'addition') return "💰 You might need to pay more money or receive different payments.";
      if (type === 'deletion') return "💰 Some payment requirements have been removed - this could save you money.";
      return "💰 The money terms in your contract have changed.";
    }
    
    if (category === 'termination') {
      if (type === 'addition') return "🚪 New rules have been added about how to end this contract.";
      if (type === 'deletion') return "🚪 Some contract ending rules have been removed.";
      return "🚪 The rules about ending this contract have changed.";
    }
    
    if (category === 'rights') {
      if (type === 'addition') return "✅ You've gained new rights or benefits - this is usually good for you!";
      if (type === 'deletion') return "❌ You've lost some rights or benefits - this might not be good for you.";
      return "⚖️ Your rights and benefits have changed.";
    }
    
    if (category === 'liability' || category === 'risk') {
      if (type === 'addition') return "⚠️ You might be responsible for more things or face new risks.";
      if (type === 'deletion') return "✅ You're no longer responsible for some things - your risk is reduced.";
      return "⚠️ Your responsibilities and risks have changed.";
    }
    
    if (category === 'date' || category === 'duration') {
      return "📅 Important dates, deadlines, or time periods have changed.";
    }
    
    if (category === 'obligation') {
      if (type === 'addition') return "📋 You have new things you must do.";
      if (type === 'deletion') return "📋 You no longer have to do some things.";
      return "📋 What you're required to do has changed.";
    }
    
    return "📄 Something in your contract has been updated.";
  };

  const generateWhatToDo = (change: EnhancedChange) => {
    const { impact, category, type } = change;
    
    if (impact === 'high') {
      if (category === 'financial') return "💡 Check your budget and talk to your finance team immediately.";
      if (category === 'termination') return "💡 Read the new ending rules carefully and update your records.";
      if (category === 'liability' || category === 'risk') return "💡 Consider getting legal advice or updating your insurance.";
      if (category === 'rights' && type === 'deletion') return "💡 This is important - you may want to negotiate to keep these rights.";
      return "💡 This is very important - review this change carefully and consider getting advice.";
    }
    
    if (impact === 'medium') {
      return "💡 Take some time to understand this change and how it affects you.";
    }
    
    return "💡 Good to know - keep this in mind for future reference.";
  };

  return (
    <div className="rounded-lg shadow-lg overflow-hidden" style={{ backgroundColor: '#040b13' }}>
      {/* Header with overall summary */}
      <div className="px-6 py-6 border-b border-gray-600" style={{ backgroundColor: '#0a1520' }}>
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-white mb-2">📋 What Changed in Your Contract</h2>
          <p className="text-gray-300">Simple explanation of all the changes</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 rounded-lg border border-gray-600" style={{ backgroundColor: '#040b13' }}>
            <div className="text-3xl font-bold text-white">{summary.totalChanges}</div>
            <div className="text-sm text-gray-400">Total Changes</div>
          </div>
          <div className="text-center p-4 rounded-lg border border-gray-600" style={{ backgroundColor: '#040b13' }}>
            <div className="text-3xl font-bold text-green-500">{summary.additions}</div>
            <div className="text-sm text-gray-400">New Things Added</div>
          </div>
          <div className="text-center p-4 rounded-lg border border-gray-600" style={{ backgroundColor: '#040b13' }}>
            <div className="text-3xl font-bold text-red-500">{summary.deletions}</div>
            <div className="text-sm text-gray-400">Things Removed</div>
          </div>
          <div className="text-center p-4 rounded-lg border border-gray-600" style={{ backgroundColor: '#040b13' }}>
            <div className="text-3xl font-bold text-yellow-500">{summary.modifications}</div>
            <div className="text-sm text-gray-400">Things Changed</div>
          </div>
        </div>

        {/* Overall Risk Assessment */}
        <div className="text-center p-4 rounded-lg border border-gray-600" style={{ backgroundColor: '#040b13' }}>
          <h3 className="text-lg font-semibold text-white mb-2">Overall Impact</h3>
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
            riskAssessment.overall === 'High' 
              ? 'bg-red-100 text-red-800 border border-red-200' 
              : riskAssessment.overall === 'Medium' 
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                : 'bg-green-100 text-green-800 border border-green-200'
          }`}>
            {riskAssessment.overall === 'High' && '🔴 Very Important Changes'}
            {riskAssessment.overall === 'Medium' && '🟡 Moderately Important Changes'}
            {riskAssessment.overall === 'Low' && '🟢 Minor Changes'}
          </div>
          <p className="text-gray-300 mt-2 text-sm">{riskAssessment.recommendation}</p>
        </div>
      </div>

      {/* Changes List */}
      <div className="max-h-96 overflow-y-auto">
        {changes.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-lg font-medium text-white mb-2">No Major Changes!</h3>
            <p>The documents are very similar. Any changes are minor and don't significantly affect the contract.</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {changes.map((change, index) => {
              const category = getUserFriendlyCategory(change.category);
              const impact = getSimpleImpact(change.impact);
              const changeType = getSimpleChangeType(change.type);
              const explanation = getSimpleExplanation(change);
              const IconComponent = category.icon;

              return (
                <div 
                  key={index} 
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedChange === index 
                      ? 'border-blue-400 bg-blue-50/5' 
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                  style={{ backgroundColor: selectedChange === index ? '#0a1520' : '#040b13' }}
                  onClick={() => setSelectedChange(selectedChange === index ? null : index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${category.color} bg-gray-800`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white text-lg">{explanation.whatChanged}</h4>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${impact.bgColor} ${impact.textColor}`}>
                            {impact.text}
                          </span>
                          <div className={`flex items-center space-x-1 ${changeType.color}`}>
                            {changeType.icon}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {/* What it means */}
                        <div className="bg-blue-50/10 rounded-lg p-3 border border-blue-600/30">
                          <h5 className="text-sm font-medium text-blue-300 mb-1">🤔 What This Means for You:</h5>
                          <p className="text-white text-sm">{explanation.whatItMeans}</p>
                        </div>

                        {selectedChange === index && (
                          <>
                            {/* Original text in simple terms */}
                            <div className="bg-gray-50/10 rounded-lg p-3 border border-gray-600/30">
                              <h5 className="text-sm font-medium text-gray-300 mb-1">📝 The Change:</h5>
                              <p className="text-white text-sm">
                                {change.plainLanguage || change.explanation.summary}
                              </p>
                            </div>

                            {/* What to do */}
                            <div className="bg-green-50/10 rounded-lg p-3 border border-green-600/30">
                              <h5 className="text-sm font-medium text-green-300 mb-1">💡 What You Should Do:</h5>
                              <p className="text-white text-sm">{explanation.whatToDo}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedChange !== index && (
                    <div className="mt-2 text-center">
                      <span className="text-xs text-gray-400">Click to see more details</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}