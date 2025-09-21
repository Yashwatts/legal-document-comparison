export async function generateLegalDocumentAnalysis(oldText, newText) {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Extract comprehensive analysis for both documents
  const oldAnalysis = await extractComprehensiveDocumentAnalysis(oldText, 'Original Document');
  const newAnalysis = await extractComprehensiveDocumentAnalysis(newText, 'Updated Document');
  
  // Generate detailed change analysis
  const changes = await analyzeDocumentChanges(oldText, newText);
  
  // Generate executive summary
  const executiveSummary = generateExecutiveSummary(oldAnalysis, newAnalysis, changes);
  
  return {
    oldDocumentSummary: oldAnalysis,
    newDocumentSummary: newAnalysis,
    changes: changes,
    executiveSummary: executiveSummary,
    totalChanges: changes.length,
    additions: changes.filter(c => c.type === 'addition').length,
    deletions: changes.filter(c => c.type === 'deletion').length,
    modifications: changes.filter(c => c.type === 'modification').length,
    riskAssessment: generateRiskAssessment(changes)
  };
}

async function extractComprehensiveDocumentAnalysis(text, docTitle) {
  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const analysis = {
    title: docTitle,
    executiveSummary: generateDocumentExecutiveSummary(text),
    documentType: identifyDocumentType(text),
    keyFindings: extractKeyFindings(text),
    mainClauses: extractMainClauses(text),
    obligations: extractObligations(text),
    rights: extractRights(text),
    financialTerms: extractFinancialTerms(text),
    timeframes: extractTimeframes(text),
    terminationClauses: extractTerminationClauses(text),
    riskFactors: identifyRiskFactors(text),
    complianceRequirements: extractComplianceRequirements(text)
  };
  
  return analysis;
}

function generateDocumentExecutiveSummary(text) {
  const docType = identifyDocumentType(text);
  const parties = identifyParties(text);
  const purpose = identifyPurpose(text);
  const keyTerms = extractKeyTerms(text);
  
  let summary = `This ${docType.toLowerCase()} establishes a formal agreement`;
  
  if (parties.length > 0) {
    summary += ` between ${parties.slice(0, 2).join(' and ')}`;
    if (parties.length > 2) summary += ' and other parties';
  }
  
  if (purpose) {
    summary += ` for the purpose of ${purpose.toLowerCase()}`;
  }
  
  summary += '. ';
  
  // Add key highlights
  const highlights = [];
  if (keyTerms.payment) highlights.push(`payment terms of ${keyTerms.payment}`);
  if (keyTerms.duration) highlights.push(`duration of ${keyTerms.duration}`);
  if (keyTerms.termination) highlights.push(`termination conditions`);
  
  if (highlights.length > 0) {
    summary += `The agreement includes ${highlights.join(', ')}.`;
  }
  
  return summary;
}

function identifyDocumentType(text) {
  const types = {
    'Service Agreement': ['service', 'services', 'provision', 'perform'],
    'Employment Contract': ['employee', 'employment', 'job', 'position', 'salary'],
    'Lease Agreement': ['lease', 'rent', 'tenant', 'landlord', 'property'],
    'Purchase Agreement': ['purchase', 'buy', 'sale', 'goods', 'product'],
    'Partnership Agreement': ['partner', 'partnership', 'joint venture', 'collaborate'],
    'Non-Disclosure Agreement': ['confidential', 'non-disclosure', 'nda', 'proprietary'],
    'License Agreement': ['license', 'intellectual property', 'copyright', 'patent'],
    'Contract': ['contract', 'agreement', 'terms', 'conditions']
  };
  
  const lowerText = text.toLowerCase();
  
  for (const [type, keywords] of Object.entries(types)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return type;
    }
  }
  
  return 'Legal Document';
}

function identifyParties(text) {
  const parties = [];
  
  // Look for common party identifiers
  const partyPatterns = [
    /(?:The|This)\s+([A-Z][a-zA-Z\s]+?)(?:\s+(?:hereinafter|shall|agrees|is))/g,
    /([A-Z][a-zA-Z\s]+?)\s+(?:and|&)\s+([A-Z][a-zA-Z\s]+?)(?:\s+(?:agree|enter|hereby))/g,
    /Party\s+(?:A|One|1):\s*([A-Z][a-zA-Z\s]+)/gi,
    /Party\s+(?:B|Two|2):\s*([A-Z][a-zA-Z\s]+)/gi
  ];
  
  partyPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match[1]) parties.push(match[1].trim());
      if (match[2]) parties.push(match[2].trim());
    }
  });
  
  // Filter out common legal terms that might be captured
  const excludeTerms = ['Agreement', 'Contract', 'Document', 'Terms', 'Conditions'];
  return [...new Set(parties)].filter(party => 
    !excludeTerms.includes(party) && party.length > 2 && party.length < 50
  ).slice(0, 4);
}

function identifyPurpose(text) {
  const purposePatterns = [
    /purpose of\s+([^.!?]+)[.!?]/gi,
    /for\s+the\s+([^.!?]*?(?:of|to|for)[^.!?]+)[.!?]/gi,
    /in order to\s+([^.!?]+)[.!?]/gi,
    /to\s+provide\s+([^.!?]+)[.!?]/gi
  ];
  
  for (const pattern of purposePatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].length < 200) {
      return match[1].trim();
    }
  }
  
  return null;
}

function extractKeyFindings(text) {
  const findings = [];
  
  // Identify critical elements
  if (text.toLowerCase().includes('liability') || text.toLowerCase().includes('damages')) {
    findings.push('📋 Contains liability and damages provisions');
  }
  
  if (text.toLowerCase().includes('intellectual property') || text.toLowerCase().includes('copyright')) {
    findings.push('💡 Includes intellectual property terms');
  }
  
  if (text.toLowerCase().includes('confidential') || text.toLowerCase().includes('non-disclosure')) {
    findings.push('🔒 Contains confidentiality requirements');
  }
  
  if (text.toLowerCase().includes('payment') || text.toLowerCase().includes('fee')) {
    findings.push('💰 Specifies financial obligations');
  }
  
  if (text.toLowerCase().includes('terminate') || text.toLowerCase().includes('cancel')) {
    findings.push('⚠️ Includes termination conditions');
  }
  
  if (text.toLowerCase().includes('insurance') || text.toLowerCase().includes('coverage')) {
    findings.push('🛡️ Requires insurance coverage');
  }
  
  if (findings.length === 0) {
    findings.push('📄 Standard contractual terms and conditions');
  }
  
  return findings;
}

function extractMainClauses(text) {
  const clauses = [];
  
  // Extract main numbered sections or clauses
  const numberedSections = text.match(/\d+\.\s*[A-Z][^.!?]*[.!?]/g) || [];
  clauses.push(...numberedSections.slice(0, 5));
  
  // Extract important clause patterns
  const importantPatterns = [
    /(?:This agreement|The parties agree|It is hereby agreed)[^.!?]*[.!?]/gi,
    /(?:The contractor shall|The client shall|The company will)[^.!?]*[.!?]/gi,
    /(?:In consideration of|Subject to the terms|Provided that)[^.!?]*[.!?]/gi
  ];
  
  importantPatterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    clauses.push(...matches.slice(0, 3));
  });
  
  return clauses.map(clause => ({
    text: clause.trim(),
    significance: determineClauseSignificance(clause)
  })).slice(0, 6);
}

function determineClauseSignificance(clause) {
  const highSignificance = ['payment', 'liability', 'termination', 'breach', 'damages'];
  const mediumSignificance = ['delivery', 'performance', 'notification', 'approval'];
  
  const lowerClause = clause.toLowerCase();
  
  if (highSignificance.some(term => lowerClause.includes(term))) return 'High';
  if (mediumSignificance.some(term => lowerClause.includes(term))) return 'Medium';
  return 'Standard';
}

function extractFinancialTerms(text) {
  const financial = [];
  
  // Payment amounts
  const amountPattern = /\$[\d,]+(?:\.\d{2})?|\d+\s*(?:dollars?|USD|cents?)/gi;
  const amounts = text.match(amountPattern) || [];
  if (amounts.length > 0) {
    financial.push(`💵 Payment amounts: ${amounts.slice(0, 3).join(', ')}`);
  }
  
  // Payment terms
  const paymentPattern = /(?:payment|fee|cost|invoice|billing)[^.!?]*[.!?]/gi;
  const paymentTerms = text.match(paymentPattern);
  if (paymentTerms) {
    financial.push(`📅 Payment schedule: ${paymentTerms[0]}`);
  }
  
  // Late fees or penalties
  if (text.toLowerCase().includes('late fee') || text.toLowerCase().includes('penalty')) {
    financial.push('⚡ Contains late payment penalties');
  }
  
  return financial.length > 0 ? financial : ['💰 Standard financial terms apply'];
}

function extractTimeframes(text) {
  const timeframes = [];
  
  // Duration patterns
  const durationPatterns = [
    /(?:duration|term|period)[^.!?]*[.!?]/gi,
    /(?:\d+\s*(?:days?|weeks?|months?|years?))[^.!?]*[.!?]/gi,
    /(?:commence|start|begin|end|expire)[^.!?]*[.!?]/gi
  ];
  
  durationPatterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    timeframes.push(...matches.slice(0, 2));
  });
  
  return timeframes.map(tf => `⏰ ${tf.trim()}`).slice(0, 3);
}

function extractTerminationClauses(text) {
  const termination = [];
  
  const terminationPatterns = [
    /(?:terminat|cancel|end|expir)[^.!?]*[.!?]/gi,
    /(?:breach|default|violation)[^.!?]*[.!?]/gi,
    /(?:notice|notification)\s+(?:of|for)\s+termination[^.!?]*[.!?]/gi
  ];
  
  terminationPatterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    termination.push(...matches.slice(0, 2));
  });
  
  return termination.length > 0 
    ? termination.map(t => `🚪 ${t.trim()}`).slice(0, 3)
    : ['🚪 Standard termination provisions'];
}

function identifyRiskFactors(text) {
  const risks = [];
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('liability') && lowerText.includes('unlimited')) {
    risks.push('🔴 HIGH RISK: Unlimited liability exposure');
  } else if (lowerText.includes('liability')) {
    risks.push('🟡 MEDIUM RISK: Limited liability provisions');
  }
  
  if (lowerText.includes('penalty') || lowerText.includes('fine')) {
    risks.push('🔴 HIGH RISK: Financial penalties apply');
  }
  
  if (lowerText.includes('indemnif')) {
    risks.push('🟡 MEDIUM RISK: Indemnification requirements');
  }
  
  if (lowerText.includes('breach') && lowerText.includes('immediate')) {
    risks.push('🔴 HIGH RISK: Immediate termination for breach');
  }
  
  if (lowerText.includes('confidential') || lowerText.includes('non-disclosure')) {
    risks.push('🟡 MEDIUM RISK: Confidentiality obligations');
  }
  
  return risks.length > 0 ? risks : ['🟢 LOW RISK: Standard risk profile'];
}

function extractComplianceRequirements(text) {
  const compliance = [];
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('compliance') || lowerText.includes('regulation')) {
    compliance.push('📋 Must comply with applicable regulations');
  }
  
  if (lowerText.includes('audit') || lowerText.includes('inspection')) {
    compliance.push('🔍 Subject to audits or inspections');
  }
  
  if (lowerText.includes('certification') || lowerText.includes('accreditation')) {
    compliance.push('🏆 Requires certification or accreditation');
  }
  
  if (lowerText.includes('license') && lowerText.includes('maintain')) {
    compliance.push('📜 Must maintain required licenses');
  }
  
  if (lowerText.includes('report') || lowerText.includes('documentation')) {
    compliance.push('📊 Requires regular reporting');
  }
  
  return compliance.length > 0 ? compliance : ['✅ Standard compliance requirements'];
}

async function analyzeDocumentChanges(oldText, newText) {
  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const changes = [];
  
  // Analyze structural changes
  const oldAnalysis = await extractComprehensiveDocumentAnalysis(oldText, 'Old');
  const newAnalysis = await extractComprehensiveDocumentAnalysis(newText, 'New');
  
  // Compare obligations
  const obligationChanges = compareArrays(
    oldAnalysis.obligations, 
    newAnalysis.obligations, 
    'obligation'
  );
  changes.push(...obligationChanges);
  
  // Compare rights
  const rightsChanges = compareArrays(
    oldAnalysis.rights, 
    newAnalysis.rights, 
    'rights'
  );
  changes.push(...rightsChanges);
  
  // Compare financial terms
  if (oldAnalysis.financialTerms.join('') !== newAnalysis.financialTerms.join('')) {
    changes.push({
      type: 'modification',
      category: 'financial',
      impact: 'high',
      businessImpact: 'Financial obligations have changed, requiring budget review',
      plainLanguage: 'The money-related terms in this contract have been updated',
      technicalDetail: 'Financial terms comparison shows modifications in payment structure',
      recommendedAction: 'Review budget implications and cash flow impact',
      riskLevel: 'High',
      explanation: {
        summary: 'Financial terms modified',
        detail: 'Changes detected in payment amounts, schedules, or financial obligations. This may affect your budget and payment timelines.',
        category: 'financial'
      }
    });
  }
  
  // Compare termination clauses
  if (oldAnalysis.terminationClauses.join('') !== newAnalysis.terminationClauses.join('')) {
    changes.push({
      type: 'modification',
      category: 'termination',
      impact: 'high',
      businessImpact: 'Contract termination conditions have changed',
      plainLanguage: 'The rules for ending this contract have been updated',
      technicalDetail: 'Termination clause analysis reveals modifications in exit conditions',
      recommendedAction: 'Review new termination procedures and notice requirements',
      riskLevel: 'High',
      explanation: {
        summary: 'Termination conditions updated',
        detail: 'The conditions under which either party can end this contract have been modified. This affects your exit strategy and notice requirements.',
        category: 'termination'
      }
    });
  }
  
  // Compare risk factors
  const oldRisks = oldAnalysis.riskFactors;
  const newRisks = newAnalysis.riskFactors;
  
  const addedRisks = newRisks.filter(risk => !oldRisks.includes(risk));
  const removedRisks = oldRisks.filter(risk => !newRisks.includes(risk));
  
  addedRisks.forEach(risk => {
    changes.push({
      type: 'addition',
      category: 'risk',
      impact: determineRiskImpact(risk),
      businessImpact: 'New risk exposure identified',
      plainLanguage: 'A new risk has been added to the contract',
      technicalDetail: risk,
      recommendedAction: 'Assess risk mitigation strategies and insurance coverage',
      riskLevel: determineRiskImpact(risk),
      explanation: {
        summary: 'New risk factor identified',
        detail: `A new risk has been introduced: ${risk.replace(/[🔴🟡🟢]/g, '').trim()}`,
        category: 'risk'
      }
    });
  });
  
  removedRisks.forEach(risk => {
    changes.push({
      type: 'deletion',
      category: 'risk',
      impact: 'medium',
      businessImpact: 'Risk exposure reduced',
      plainLanguage: 'A previous risk has been removed from the contract',
      technicalDetail: risk,
      recommendedAction: 'Confirm risk mitigation is no longer needed',
      riskLevel: 'Low',
      explanation: {
        summary: 'Risk factor removed',
        detail: `A previous risk has been eliminated: ${risk.replace(/[🔴🟡🟢]/g, '').trim()}`,
        category: 'risk'
      }
    });
  });
  
  // Compare compliance requirements
  const complianceChanges = compareArrays(
    oldAnalysis.complianceRequirements,
    newAnalysis.complianceRequirements,
    'compliance'
  );
  changes.push(...complianceChanges);
  
  // If no specific changes found, add comprehensive comparison
  if (changes.length === 0) {
    // Check for textual differences
    if (oldText !== newText) {
      changes.push({
        type: 'modification',
        category: 'general',
        impact: 'medium',
        businessImpact: 'Document content has been updated',
        plainLanguage: 'The contract text has been modified with various updates',
        technicalDetail: 'Comprehensive document comparison reveals textual modifications',
        recommendedAction: 'Review updated document sections carefully',
        riskLevel: 'Medium',
        explanation: {
          summary: 'Document text updated',
          detail: 'The document has been updated with various changes that may affect specific terms and conditions.',
          category: 'general'
        }
      });
    }
  }

  // Add more detailed change analysis for all important sections
  const importantSections = [
    { pattern: /payment|fee|cost|invoice|billing/gi, category: 'financial', name: 'Payment Terms' },
    { pattern: /terminate|cancel|end|expir/gi, category: 'termination', name: 'Termination Clauses' },
    { pattern: /liability|damage|responsible|accountable/gi, category: 'liability', name: 'Liability Provisions' },
    { pattern: /right|benefit|entitle/gi, category: 'rights', name: 'Rights and Benefits' },
    { pattern: /obligation|duty|must|shall|require/gi, category: 'obligation', name: 'Obligations' },
    { pattern: /date|deadline|time|period|duration/gi, category: 'date', name: 'Dates and Deadlines' },
    { pattern: /insurance|coverage|protect/gi, category: 'risk', name: 'Insurance and Protection' },
    { pattern: /confidential|proprietary|secret/gi, category: 'compliance', name: 'Confidentiality' }
  ];

  importantSections.forEach(section => {
    const oldMatches = oldText.match(section.pattern) || [];
    const newMatches = newText.match(section.pattern) || [];
    
    if (oldMatches.length !== newMatches.length || 
        oldMatches.join('').toLowerCase() !== newMatches.join('').toLowerCase()) {
      
      const existingChange = changes.find(c => c.category === section.category);
      if (!existingChange) {
        changes.push({
          type: oldMatches.length < newMatches.length ? 'addition' : 
                oldMatches.length > newMatches.length ? 'deletion' : 'modification',
          category: section.category,
          impact: section.category === 'financial' || section.category === 'termination' || section.category === 'liability' ? 'high' : 'medium',
          businessImpact: `Changes detected in ${section.name.toLowerCase()}`,
          plainLanguage: `The ${section.name.toLowerCase()} section has been updated`,
          technicalDetail: `Analysis of ${section.name} reveals modifications in contract provisions`,
          recommendedAction: `Review ${section.name.toLowerCase()} changes carefully`,
          riskLevel: section.category === 'financial' || section.category === 'termination' || section.category === 'liability' ? 'High' : 'Medium',
          explanation: {
            summary: `${section.name} updated`,
            detail: `Changes have been detected in the ${section.name.toLowerCase()} section of the document.`,
            category: section.category
          }
        });
      }
    }
  });
  
  return changes;
}

function compareArrays(oldArray, newArray, category) {
  const changes = [];
  
  // Find additions
  const additions = newArray.filter(item => 
    !oldArray.some(oldItem => similarContent(oldItem, item))
  );
  
  // Find deletions
  const deletions = oldArray.filter(item => 
    !newArray.some(newItem => similarContent(item, newItem))
  );
  
  additions.forEach(item => {
    changes.push(createChangeObject('addition', category, item));
  });
  
  deletions.forEach(item => {
    changes.push(createChangeObject('deletion', category, item));
  });
  
  return changes;
}

function createChangeObject(type, category, content) {
  const isAddition = type === 'addition';
  const plainContent = typeof content === 'string' ? content.replace(/[🔴🟡🟢📋💡🔒💰⚠️🛡️📄⏰🚪]/g, '').trim() : JSON.stringify(content);
  
  return {
    type,
    category,
    impact: determineContentImpact(plainContent),
    businessImpact: generateBusinessImpact(type, category, plainContent),
    plainLanguage: generatePlainLanguage(type, category, plainContent),
    technicalDetail: plainContent,
    recommendedAction: generateRecommendedAction(type, category, plainContent),
    riskLevel: determineRiskLevel(type, category, plainContent),
    explanation: {
      summary: generateChangeSummary(type, category, plainContent),
      detail: generateChangeDetail(type, category, plainContent),
      category
    }
  };
}

function generateBusinessImpact(type, category, content) {
  // Generate user-friendly business impact explanations
  const impacts = {
    financial: {
      addition: 'New costs or payment changes - this affects your budget and cash flow',
      deletion: 'Some costs removed - this could save you money and improve cash flow'
    },
    rights: {
      addition: 'New benefits for you - this strengthens your position in the contract',
      deletion: 'You lost some benefits - this may weaken your position'
    },
    obligation: {
      addition: 'New things you must do - you may need more time or resources',
      deletion: 'Fewer things you must do - this reduces your workload'
    },
    termination: {
      addition: 'New exit rules - changes how you can end this contract',
      deletion: 'Simpler exit process - it may be easier to end the contract'
    },
    liability: {
      addition: 'More risk for you - consider insurance or legal advice',
      deletion: 'Less risk for you - this is generally good news'
    },
    compliance: {
      addition: 'New rules to follow - you may need to update your processes',
      deletion: 'Fewer rules to follow - this simplifies compliance'
    }
  };
  
  return impacts[category]?.[type] || `${category} ${type} - review how this affects your business`;
}

function generatePlainLanguage(type, category, content) {
  // Generate simple, conversational explanations
  const templates = {
    financial: {
      addition: "💰 New payment rules have been added. You may need to pay more or receive different payments.",
      deletion: "💰 Some payment rules have been removed. This could mean you pay less or have fewer payment obligations.",
      modification: "💰 Payment terms have changed. The amount you pay or receive may be different now."
    },
    termination: {
      addition: "🚪 New rules about ending the contract have been added. There are now more ways or conditions for ending this agreement.",
      deletion: "🚪 Some contract ending rules have been removed. It might be easier or harder to end the contract now.",
      modification: "🚪 The rules for ending this contract have changed. Pay attention to how you can exit this agreement."
    },
    rights: {
      addition: "✅ Good news! You've gained new rights or benefits. This is usually in your favor.",
      deletion: "❌ You've lost some rights or benefits. This may not be in your favor - consider negotiating.",
      modification: "⚖️ Your rights and benefits have changed. Make sure you understand what you're gaining or losing."
    },
    liability: {
      addition: "⚠️ You might now be responsible for more things or face new risks. Consider if you need insurance.",
      deletion: "✅ Great! You're no longer responsible for some things. Your risk has been reduced.",
      modification: "⚠️ What you're responsible for has changed. Review these changes carefully."
    },
    obligation: {
      addition: "📋 You now have new things you must do. Make sure you can fulfill these requirements.",
      deletion: "📋 You no longer have to do some things. This reduces your workload and obligations.",
      modification: "📋 Your responsibilities have changed. Check what you need to do differently."
    },
    date: {
      addition: "📅 New dates or deadlines have been added. Mark these on your calendar.",
      deletion: "📅 Some dates or deadlines have been removed. You may have more flexibility now.",
      modification: "📅 Important dates have changed. Update your schedule and deadlines."
    },
    compliance: {
      addition: "📋 New rules you must follow have been added. You may need to update your procedures.",
      deletion: "📋 Some compliance requirements have been removed. This reduces regulatory burden.",
      modification: "📋 Rules you must follow have changed. Update your compliance procedures."
    }
  };
  
  const template = templates[category]?.[type];
  if (template) {
    return template;
  }
  
  // Fallback for other categories
  const verb = type === 'addition' ? 'added to' : type === 'deletion' ? 'removed from' : 'changed in';
  return `📄 Something related to ${category} has been ${verb} the contract. Review this carefully.`;
}

function generateRecommendedAction(type, category, content) {
  // Generate simple, actionable recommendations for regular users
  const actions = {
    financial: {
      addition: '💡 Check your budget - you may need to pay more or receive different amounts',
      deletion: '💡 Good news for your budget - some costs may be reduced',
      modification: '💡 Review your budget and payment schedules for changes'
    },
    rights: {
      addition: '💡 Great news! Make sure you understand and use your new benefits',
      deletion: '💡 Important: You lost some benefits - consider negotiating to keep them',
      modification: '💡 Review what changed - make sure you still have what you need'
    },
    termination: {
      addition: '💡 Learn the new exit rules - update your contract management process',
      deletion: '💡 Check if ending the contract is now easier or harder for you',
      modification: '💡 Important: How you end this contract has changed - review carefully'
    },
    liability: {
      addition: '💡 You may face more risk - consider insurance or legal advice',
      deletion: '💡 Your risk is reduced - that\'s usually good news!',
      modification: '💡 Your risk level changed - understand what you\'re now responsible for'
    },
    obligation: {
      addition: '💡 You have new duties - make sure you can handle the extra work',
      deletion: '💡 Less work for you - some duties have been removed',
      modification: '💡 Your duties changed - update your procedures and plans'
    },
    date: {
      addition: '💡 New deadlines added - mark these dates on your calendar',
      deletion: '💡 Some deadlines removed - you may have more time now',
      modification: '💡 Important dates changed - update your calendar and schedules'
    },
    compliance: {
      addition: '💡 New rules to follow - update your compliance procedures',
      deletion: '💡 Fewer rules to follow - this simplifies your compliance',
      modification: '💡 Compliance rules changed - update your procedures'
    }
  };
  
  const action = actions[category]?.[type];
  if (action) {
    return action;
  }
  
  return '💡 Review this change carefully and consider how it affects your business';
}

function determineRiskLevel(type, category, content) {
  const highRiskCategories = ['financial', 'termination', 'liability'];
  const highRiskTerms = ['penalty', 'damages', 'breach', 'unlimited'];
  
  const lowerContent = content.toLowerCase();
  
  if (highRiskCategories.includes(category) || 
      highRiskTerms.some(term => lowerContent.includes(term))) {
    return 'High';
  }
  
  if (type === 'deletion' && ['rights', 'protections'].includes(category)) {
    return 'High';
  }
  
  if (type === 'addition' && ['obligation', 'compliance'].includes(category)) {
    return 'Medium';
  }
  
  return 'Low';
}

function generateChangeSummary(type, category, content) {
  // Generate friendly, non-technical summaries
  const summaries = {
    financial: {
      addition: '💰 New Payment Rule Added',
      deletion: '💰 Payment Rule Removed', 
      modification: '💰 Payment Terms Changed'
    },
    rights: {
      addition: '✅ New Benefit Added',
      deletion: '❌ Benefit Removed',
      modification: '⚖️ Rights Changed'
    },
    termination: {
      addition: '🚪 New Exit Rule',
      deletion: '🚪 Exit Rule Removed',
      modification: '🚪 Exit Rules Changed'
    },
    liability: {
      addition: '⚠️ New Risk Added',
      deletion: '✅ Risk Removed',
      modification: '⚠️ Risk Level Changed'
    },
    obligation: {
      addition: '📋 New Duty Added',
      deletion: '📋 Duty Removed',
      modification: '📋 Duties Changed'
    },
    date: {
      addition: '📅 New Deadline Added',
      deletion: '📅 Deadline Removed',
      modification: '📅 Dates Changed'
    },
    compliance: {
      addition: '📋 New Rule Added',
      deletion: '📋 Rule Removed',
      modification: '📋 Rules Changed'
    }
  };
  
  const summary = summaries[category]?.[type];
  if (summary) {
    return summary;
  }
  
  const action = type === 'addition' ? 'Added' : type === 'deletion' ? 'Removed' : 'Changed';
  return `${action} ${category.charAt(0).toUpperCase() + category.slice(1)}`;
}

function generateChangeDetail(type, category, content) {
  // Generate detailed but user-friendly explanations
  const explanations = {
    financial: {
      addition: 'A new payment-related term has been added to your contract. This might change how much you pay, when you pay, or what payments you receive.',
      deletion: 'A payment-related term has been removed from your contract. This could reduce your payment obligations or change your payment schedule.',
      modification: 'Payment terms in your contract have been updated. The amounts, timing, or conditions of payments may have changed.'
    },
    rights: {
      addition: 'You now have a new right or benefit under this contract. This is generally good news and gives you more protection or advantages.',
      deletion: 'A right or benefit you previously had has been removed. This may reduce your protection or advantages under the contract.',
      modification: 'Your rights or benefits under this contract have changed. Review carefully to understand what you gained or lost.'
    },
    termination: {
      addition: 'New conditions or procedures for ending this contract have been added. There are now additional ways the contract can be terminated.',
      deletion: 'Some termination conditions have been removed. This may change how easily you or the other party can end the contract.',
      modification: 'The rules for ending this contract have changed. Pay attention to notice periods, conditions, and procedures.'
    },
    liability: {
      addition: 'You may now be responsible for additional risks or damages. Consider whether you need insurance or legal protection.',
      deletion: 'Your responsibility for certain risks or damages has been reduced or eliminated. This generally reduces your exposure.',
      modification: 'Your liability and risk exposure under this contract has changed. Review what you are and aren\'t responsible for.'
    }
  };
  
  const explanation = explanations[category]?.[type];
  if (explanation) {
    return explanation + ` The specific change involves: "${content}"`;
  }
  
  const action = type === 'addition' ? 'has been added to' : 
                 type === 'deletion' ? 'has been removed from' : 
                 'has been modified in';
  
  return `A ${category}-related provision ${action} your contract. ${content}. Please review this change to understand how it affects you.`;
}

function generateExecutiveSummary(oldAnalysis, newAnalysis, changes) {
  const totalChanges = changes.length;
  const highRiskChanges = changes.filter(c => c.riskLevel === 'High').length;
  const mediumRiskChanges = changes.filter(c => c.riskLevel === 'Medium').length;
  
  let summary = `📊 **Document Comparison Executive Summary**\n\n`;
  
  if (totalChanges === 0) {
    summary += `✅ **No Significant Changes Detected**\nThe updated document appears to contain only minor textual modifications without substantial legal or business impact.`;
    return summary;
  }
  
  summary += `📈 **Overview**: ${totalChanges} significant change${totalChanges > 1 ? 's' : ''} identified between document versions.\n\n`;
  
  if (highRiskChanges > 0) {
    summary += `🔴 **HIGH PRIORITY**: ${highRiskChanges} high-risk change${highRiskChanges > 1 ? 's' : ''} require immediate attention.\n`;
  }
  
  if (mediumRiskChanges > 0) {
    summary += `🟡 **MEDIUM PRIORITY**: ${mediumRiskChanges} medium-risk change${mediumRiskChanges > 1 ? 's' : ''} need review.\n`;
  }
  
  const lowRiskChanges = totalChanges - highRiskChanges - mediumRiskChanges;
  if (lowRiskChanges > 0) {
    summary += `🟢 **LOW PRIORITY**: ${lowRiskChanges} low-risk change${lowRiskChanges > 1 ? 's' : ''} for general awareness.\n`;
  }
  
  summary += `\n**Key Areas Affected**:\n`;
  const categories = [...new Set(changes.map(c => c.category))];
  categories.forEach(category => {
    const categoryChanges = changes.filter(c => c.category === category);
    summary += `• ${category.charAt(0).toUpperCase() + category.slice(1)}: ${categoryChanges.length} change${categoryChanges.length > 1 ? 's' : ''}\n`;
  });
  
  summary += `\n**Next Steps**: Review detailed changes below and take recommended actions for high and medium priority items.`;
  
  return summary;
}

function generateRiskAssessment(changes) {
  const highRisk = changes.filter(c => c.riskLevel === 'High');
  const mediumRisk = changes.filter(c => c.riskLevel === 'Medium');
  const lowRisk = changes.filter(c => c.riskLevel === 'Low');
  
  return {
    overall: highRisk.length > 0 ? 'High' : mediumRisk.length > 0 ? 'Medium' : 'Low',
    breakdown: {
      high: highRisk.length,
      medium: mediumRisk.length,
      low: lowRisk.length
    },
    recommendation: highRisk.length > 0 
      ? 'Immediate legal review recommended before proceeding'
      : mediumRisk.length > 0 
        ? 'Thorough business impact assessment recommended'
        : 'Standard review process sufficient'
  };
}

function similarContent(content1, content2, threshold = 0.6) {
  if (typeof content1 !== 'string' || typeof content2 !== 'string') {
    return JSON.stringify(content1) === JSON.stringify(content2);
  }
  
  const clean1 = content1.replace(/[🔴🟡🟢📋💡🔒💰⚠️🛡️📄⏰🚪]/g, '').toLowerCase().trim();
  const clean2 = content2.replace(/[🔴🟡🟢📋💡🔒💰⚠️🛡️📄⏰🚪]/g, '').toLowerCase().trim();
  
  if (clean1 === clean2) return true;
  
  const words1 = clean1.split(/\s+/);
  const words2 = clean2.split(/\s+/);
  
  const intersection = words1.filter(word => words2.includes(word));
  const union = [...new Set([...words1, ...words2])];
  
  return intersection.length / union.length >= threshold;
}

function determineContentImpact(content) {
  const highImpactTerms = ['terminate', 'liability', 'payment', 'breach', 'penalty', 'damages'];
  const mediumImpactTerms = ['notice', 'approval', 'deadline', 'compliance', 'obligation'];
  
  const lowerContent = content.toLowerCase();
  
  if (highImpactTerms.some(term => lowerContent.includes(term))) {
    return 'high';
  } else if (mediumImpactTerms.some(term => lowerContent.includes(term))) {
    return 'medium';
  }
  
  return 'low';
}

function determineRiskImpact(riskText) {
  if (riskText.includes('HIGH RISK') || riskText.includes('🔴')) {
    return 'High';
  } else if (riskText.includes('MEDIUM RISK') || riskText.includes('🟡')) {
    return 'Medium';
  }
  return 'Low';
}

// Helper functions
function extractClauses(text) {
  const clauses = [];
  
  // Look for numbered clauses or sections
  const numberedClauses = text.match(/\d+\.\d*\s*[A-Z][^.!?]*[.!?]/g) || [];
  clauses.push(...numberedClauses.map(clause => clause.trim()));
  
  // Look for common legal clause patterns
  const patterns = [
    /(?:This agreement|The parties|It is agreed|The contractor|The client|The company)[^.!?]*[.!?]/gi,
    /(?:Shall|Must|Will|Should)\s+[^.!?]*[.!?]/gi,
    /(?:In consideration of|Subject to|Provided that|Notwithstanding)[^.!?]*[.!?]/gi
  ];
  
  patterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    clauses.push(...matches.map(clause => clause.trim()));
  });
  
  return [...new Set(clauses)].slice(0, 10); // Remove duplicates and limit
}

function extractObligations(text) {
  const obligations = [];
  
  const patterns = [
    /(?:shall|must|will|is required to|has the obligation to)[^.!?]*[.!?]/gi,
    /(?:The [a-zA-Z]+ agrees to|agrees to|undertakes to)[^.!?]*[.!?]/gi,
    /(?:responsible for|liable for|duty to)[^.!?]*[.!?]/gi
  ];
  
  patterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    obligations.push(...matches.map(obl => obl.trim()));
  });
  
  return [...new Set(obligations)].slice(0, 8);
}

function extractRights(text) {
  const rights = [];
  
  const patterns = [
    /(?:has the right to|entitled to|may|can)[^.!?]*[.!?]/gi,
    /(?:shall receive|will receive|is granted)[^.!?]*[.!?]/gi,
    /(?:protected|coverage|benefit)[^.!?]*[.!?]/gi
  ];
  
  patterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    rights.push(...matches.map(right => right.trim()));
  });
  
  return [...new Set(rights)].slice(0, 8);
}

function extractKeyTerms(text) {
  const terms = {};
  
  // Payment terms
  const paymentPattern = /(?:payment|fee|cost|amount|price)[^.!?]*[.!?]/gi;
  const paymentMatches = text.match(paymentPattern);
  if (paymentMatches) {
    terms.payment = paymentMatches[0].trim();
  }
  
  // Duration terms
  const durationPattern = /(?:term|duration|period|expires|until)[^.!?]*[.!?]/gi;
  const durationMatches = text.match(durationPattern);
  if (durationMatches) {
    terms.duration = durationMatches[0].trim();
  }
  
  // Termination terms
  const terminationPattern = /(?:terminat|cancel|end|expir)[^.!?]*[.!?]/gi;
  const terminationMatches = text.match(terminationPattern);
  if (terminationMatches) {
    terms.termination = terminationMatches[0].trim();
  }
  
  return terms;
}

function truncateText(text, maxLength = 100) {
  if (!text || typeof text !== 'string') return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}