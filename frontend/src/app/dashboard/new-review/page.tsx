'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { reviewAPI } from '@/lib/api';
import { Loader2, Play, Trash2, Upload, FileCode } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'sql', label: 'SQL' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
];

const SAMPLE_CODE = `// Welcome to Codexa!
// Paste your code here and click "Start Review" to get AI-powered feedback

function calculateSum(numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum = sum + numbers[i];
  }
  return sum;
}

console.log(calculateSum([1, 2, 3, 4, 5]));
`;

export default function NewReviewPage() {
  const [code, setCode] = useState(SAMPLE_CODE);
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleStartReview = async () => {
    if (!code.trim()) {
      setError('Please enter some code to review');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await reviewAPI.createSnippetReview({
        code: code.trim(),
        language,
      });
      
      // Navigate to the review page
      router.push(`/dashboard/review/${response.data.reviewId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to start review. Please try again.');
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode('');
    setError('');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">New Code Review</h1>
        <p className="text-gray-400">Paste your code or upload a file for instant AI analysis</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Code Editor */}
        <div className="lg:col-span-3">
          <div className="card overflow-hidden">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-400">Code Editor</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClear}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Clear code"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="h-[500px]">
              <MonacoEditor
                height="100%"
                language={language}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 16, bottom: 16 },
                  wordWrap: 'on',
                }}
              />
            </div>

            {/* Editor Footer */}
            <div className="px-4 py-3 border-t border-white/10 bg-[#0F172A]">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>{code.length} characters</span>
                <span>{code.split('\n').length} lines</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Language Selector */}
          <div className="card p-6">
            <label className="block text-sm font-medium mb-3">Programming Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="input"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="card p-6 space-y-4">
            <button
              onClick={handleStartReview}
              disabled={loading || !code.trim()}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Starting Review...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Review
                </>
              )}
            </button>

            <button className="btn-secondary w-full flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" />
              Upload File
            </button>
          </div>

          {/* Tips */}
          <div className="card p-6">
            <h3 className="font-semibold mb-4">Tips for Better Reviews</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-1">•</span>
                Include function or class definitions for context
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-1">•</span>
                Paste complete, working code snippets
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-1">•</span>
                Include imports and dependencies
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-1">•</span>
                Select the correct language for accurate analysis
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
