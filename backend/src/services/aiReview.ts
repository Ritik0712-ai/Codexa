import OpenAI from 'openai';

interface AIReviewIssue {
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  category: string;
  issue: string;
  explanation: string;
  suggestedFix?: string;
}

interface AIReviewResult {
  issues: AIReviewIssue[];
  summary: string;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function performAIReview(code: string, language: string): Promise<AIReviewResult> {
  // If no API key, return a simulated response for demo
  if (!process.env.OPENAI_API_KEY) {
    return getSimulatedReview(code, language);
  }
  
  try {
    const prompt = `You are an expert code reviewer. Analyze the following ${language} code and provide:
1. A summary of the code quality
2. A list of issues found with severity levels (CRITICAL, HIGH, MEDIUM, LOW, INFO)
3. Each issue should include the issue description, explanation, and suggested fix

Return your response as JSON with this format:
{
  "summary": "Brief summary of code quality",
  "issues": [
    {
      "severity": "HIGH",
      "category": "Security",
      "issue": "Issue description",
      "explanation": "Why this is a problem",
      "suggestedFix": "How to fix it"
    }
  ]
}

Code to review:
\`\`\`${language}
${code}
\`\`\``;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert code reviewer. Provide detailed, actionable feedback.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return getSimulatedReview(code, language);
    }

    const result = JSON.parse(content);
    return {
      issues: result.issues || [],
      summary: result.summary || 'AI review completed.',
    };
  } catch (error) {
    console.error('AI review error:', error);
    return getSimulatedReview(code, language);
  }
}

function getSimulatedReview(code: string, language: string): AIReviewResult {
  // Simulated response for demo purposes
  const issues: AIReviewIssue[] = [];
  
  // Check code length
  if (code.length < 50) {
    issues.push({
      severity: 'INFO',
      category: 'Code Analysis',
      issue: 'Code snippet is too short for comprehensive review',
      explanation: 'A longer code snippet would provide more meaningful analysis.',
      suggestedFix: 'Submit a larger code segment for better review.',
    });
  }
  
  // Basic code smell detection
  if (code.includes('function') && code.match(/function\s+\w+\s*\([^)]*\)\s*{[\s\S]{500,}/)) {
    issues.push({
      severity: 'MEDIUM',
      category: 'Complexity',
      issue: 'Large function detected',
      explanation: 'Functions longer than 50 lines can be difficult to maintain and test.',
      suggestedFix: 'Consider breaking this function into smaller, more focused functions.',
    });
  }
  
  // Check for comments
  if (!code.includes('//') && !code.includes('#') && !code.includes('/*') && code.length > 200) {
    issues.push({
      severity: 'LOW',
      category: 'Documentation',
      issue: 'Code lacks comments',
      explanation: 'Well-documented code is easier to maintain and understand.',
      suggestedFix: 'Add comments explaining complex logic and function purposes.',
    });
  }
  
  // Check for hardcoded values
  if (code.match(/\d{5,}/)) {
    issues.push({
      severity: 'LOW',
      category: 'Code Quality',
      issue: 'Possible magic numbers detected',
      explanation: 'Hardcoded numbers reduce code readability and maintainability.',
      suggestedFix: 'Use named constants instead of magic numbers.',
    });
  }
  
  return {
    issues,
    summary: issues.length > 0 
      ? `AI review identified ${issues.length} area(s) for improvement in your ${language} code.`
      : `Your ${language} code looks good! No major issues detected.`,
  };
}
