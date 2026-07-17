interface AnalysisIssue {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  category: string;
  issue: string;
  explanation: string;
  suggestedFix?: string;
  fileName?: string;
  lineNumber?: number;
}

interface StaticAnalysisResult {
  issues: AnalysisIssue[];
  summary: string;
}

export async function performStaticAnalysis(code: string, language: string): Promise<StaticAnalysisResult> {
  const issues: AnalysisIssue[] = [];
  
  // Basic pattern-based static analysis
  const lines = code.split('\n');
  
  // Check for common issues based on language
  if (language === 'javascript' || language === 'typescript') {
    // Check for console.log statements
    lines.forEach((line, index) => {
      if (line.includes('console.log')) {
        issues.push({
          severity: 'INFO',
          category: 'Best Practice',
          issue: 'Console statement found',
          explanation: 'Console statements should be removed or replaced with a proper logging library in production.',
          suggestedFix: 'Remove console.log or use a logging library like winston or pino.',
          lineNumber: index + 1,
        });
      }
      
      // Check for TODO comments
      if (line.includes('TODO') || line.includes('FIXME')) {
        issues.push({
          severity: 'LOW',
          category: 'Code Quality',
          issue: 'Incomplete work marker found',
          explanation: 'TODO and FIXME comments indicate incomplete code that should be addressed.',
          suggestedFix: 'Complete the task or create a proper issue tracker item.',
          lineNumber: index + 1,
        });
      }
      
      // Check for var usage
      if (line.includes('var ')) {
        issues.push({
          severity: 'INFO',
          category: 'Modern JavaScript',
          issue: 'Using deprecated var keyword',
          explanation: 'The var keyword is deprecated in modern JavaScript. Use const or let instead.',
          suggestedFix: 'Replace var with const or let.',
          lineNumber: index + 1,
        });
      }
      
      // Check for == instead of ===
      const doubleEquals = line.match(/([^=!])={2}([^=])/);
      if (doubleEquals && !line.includes('===') && !line.includes('!==')) {
        issues.push({
          severity: 'MEDIUM',
          category: 'Type Safety',
          issue: 'Using loose equality operator',
          explanation: 'Using == instead of === can lead to unexpected type coercion.',
          suggestedFix: 'Use strict equality (===) for comparisons.',
          lineNumber: index + 1,
        });
      }
    });
    
    // Check for missing error handling
    if (code.includes('.then(') && !code.includes('catch(')) {
      issues.push({
        severity: 'HIGH',
        category: 'Error Handling',
        issue: 'Promise without catch handler',
        explanation: 'Unhandled promise rejections can cause silent failures.',
        suggestedFix: 'Add a .catch() handler to handle potential errors.',
      });
    }
    
    // Check for eval usage
    if (code.includes('eval(')) {
      issues.push({
        severity: 'CRITICAL',
        category: 'Security',
        issue: 'Use of eval() detected',
        explanation: 'eval() is a security risk as it can execute arbitrary code.',
        suggestedFix: 'Avoid using eval(). Use safer alternatives like JSON.parse() for parsing.',
      });
    }
  }
  
  if (language === 'python') {
    lines.forEach((line, index) => {
      // Check for print statements
      if (line.includes('print(') && !line.includes('logger')) {
        issues.push({
          severity: 'INFO',
          category: 'Best Practice',
          issue: 'Print statement found',
          explanation: 'Print statements should be replaced with proper logging in production.',
          suggestedFix: 'Use Python\'s logging module instead.',
          lineNumber: index + 1,
        });
      }
      
      // Check for bare except clauses
      if (line.trim() === 'except:') {
        issues.push({
          severity: 'HIGH',
          category: 'Error Handling',
          issue: 'Bare except clause',
          explanation: 'Bare except clauses catch all exceptions including SystemExit and KeyboardInterrupt.',
          suggestedFix: 'Use except Exception: to catch specific exceptions.',
          lineNumber: index + 1,
        });
      }
    });
    
    // Check for TODO comments
    if (code.includes('# TODO') || code.includes('# FIXME')) {
      issues.push({
        severity: 'LOW',
        category: 'Code Quality',
        issue: 'Incomplete work marker found',
        explanation: 'TODO and FIXME comments indicate incomplete code.',
        suggestedFix: 'Address the TODO or create a proper issue tracker item.',
      });
    }
  }
  
  // Generic checks for all languages
  // Check for long lines (>120 characters)
  lines.forEach((line, index) => {
    if (line.length > 120) {
      issues.push({
        severity: 'LOW',
        category: 'Code Style',
        issue: 'Line exceeds 120 characters',
        explanation: 'Long lines reduce readability and make code harder to review.',
        suggestedFix: 'Break the line into multiple lines or extract to a variable.',
        lineNumber: index + 1,
      });
    }
  });
  
  // Check for trailing whitespace
  lines.forEach((line, index) => {
    if (line.endsWith(' ') || line.endsWith('\t')) {
      issues.push({
        severity: 'INFO',
        category: 'Code Style',
        issue: 'Trailing whitespace',
        explanation: 'Trailing whitespace is unnecessary and can cause issues in version control.',
        suggestedFix: 'Remove trailing whitespace.',
        lineNumber: index + 1,
      });
    }
  });
  
  return {
    issues,
    summary: `Static analysis found ${issues.length} issue(s).`,
  };
}
