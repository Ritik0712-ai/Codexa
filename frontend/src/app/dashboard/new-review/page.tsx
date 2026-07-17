'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { reviewAPI } from '@/lib/api';
import { Loader2, Play, Trash2, FileCode } from 'lucide-react';
import { useRouter } from 'next/navigation';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
];

export default function NewReviewPage() {
  const [code, setCode] = useState('');
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
      router.push(`/dashboard/review/${response.data.reviewId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to start review');
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode('');
    setError('');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">New Code Review</h1>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Code Editor */}
        <div className="lg:col-span-3">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-400">Code Editor</span>
              </div>
              <button
                onClick={handleClear}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

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
          <div className="card p-6">
            <h3 className="font-semibold text-white mb-4">Settings</h3>
            <div className="form-group mb-4">
              <label className="form-label">Language</label>
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
          </div>

          <div className="card p-6 space-y-4">
            <button
              onClick={handleStartReview}
              disabled={loading || !code.trim()}
              className="btn-primary w-full py-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Start Review
                </>
              )}
            </button>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-white mb-4">Tips</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Include imports for context</li>
              <li>• Paste complete functions</li>
              <li>• Select correct language</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
