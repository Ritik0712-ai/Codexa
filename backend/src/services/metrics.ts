interface CodeMetrics {
  linesOfCode: number;
  functions: number;
  classes: number;
  cyclomaticComplexity: number;
  fileComplexity: number;
}

export function calculateMetrics(code: string, language: string): CodeMetrics {
  const lines = code.split('\n');
  const nonEmptyLines = lines.filter(line => line.trim().length > 0);
  
  // Count functions
  let functions = 0;
  if (language === 'javascript' || language === 'typescript') {
    // Match function declarations
    functions += (code.match(/(?:^|\n)\s*(?:export\s+)?(?:async\s+)?function\s+\w+/g) || []).length;
    // Match arrow functions assigned to variables
    functions += (code.match(/(?:^|\n)\s*(?:export\s+)?(?:const|let|var)\s+\w+\s*=\s*(?:async\s+)?\([^)]*\)\s*=>/g) || []).length;
    // Match method shorthand
    functions += (code.match(/\n\s*(?:async\s+)?\w+\s*\([^)]*\)\s*{/g) || []).length;
  } else if (language === 'python') {
    functions += (code.match(/(?:^|\n)def\s+\w+/g) || []).length;
  }
  
  // Count classes
  let classes = 0;
  if (language === 'javascript' || language === 'typescript') {
    classes += (code.match(/(?:^|\n)\s*(?:export\s+)?class\s+\w+/g) || []).length;
    // Count React components
    classes += (code.match(/(?:^|\n)\s*(?:export\s+)?(?:const|function)\s+\w+\s*=\s*(?:\([^)]*\)\s*)?=>/g) || []).length;
  } else if (language === 'python') {
    classes += (code.match(/(?:^|\n)class\s+\w+/g) || []).length;
  }
  
  // Calculate cyclomatic complexity (simplified)
  let cyclomaticComplexity = 1; // Base complexity
  
  // Count if/else statements
  const ifCount = (code.match(/\bif\b/g) || []).length;
  cyclomaticComplexity += ifCount;
  
  // Count loops
  const loopCount = (code.match(/\b(for|while|do)\b/g) || []).length;
  cyclomaticComplexity += loopCount;
  
  // Count conditional operators
  const ternaryCount = (code.match(/\?/g) || []).length;
  cyclomaticComplexity += ternaryCount;
  
  // Count && and ||
  const logicalCount = (code.match(/&&|\|\|/g) || []).length;
  cyclomaticComplexity += logicalCount;
  
  // Count try/catch
  const tryCount = (code.match(/\btry\b/g) || []).length;
  cyclomaticComplexity += tryCount;
  
  // Calculate file complexity score (simple heuristic)
  const fileComplexity = Math.min(100, Math.round(
    (nonEmptyLines.length * 0.5) +
    (functions * 2) +
    (classes * 3) +
    (cyclomaticComplexity * 1.5)
  ));
  
  return {
    linesOfCode: nonEmptyLines.length,
    functions,
    classes,
    cyclomaticComplexity,
    fileComplexity,
  };
}
