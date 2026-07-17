'use client';

import { useState } from 'react';
import { reviewAPI } from '@/lib/api';
import { Loader2, Play, Trash2, FileCode } from 'lucide-react';
import { useRouter } from 'next/navigation';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
];

export default function NewReviewPage() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleStartReview = async () => {
    if (!code.trim()) {
      setError('Please enter some code');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await reviewAPI.createSnippetReview({ code: code.trim(), language });
      router.push(`/dashboard/review/${response.data.reviewId}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to start review');
      setLoading(false);
    }
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
        {/* Editor */}
        <div className="lg:col-span-3">
          <div className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-400">Code Editor</span>
              </div>
              <button onClick={() => setCode('')} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="w-full h-[400px] bg-[#0F172A] text-white p-4 font-mono text-sm resize-none focus:outline-none"
            />
            <div className="px-4 py-2 border-t border-white/10 bg-[#0F172A]">
              <span className="text-sm text-gray-400">{code.length} chars • {code.split('\n').length} lines</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
            <h3 className="font-semibold text-white mb-4">Settings</h3>
            <div className="form-group">
              <label className="form-label">Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input">
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>
          </div>

          <button onClick={handleStartReview} disabled={loading || !code.trim()} className="btn-primary w-full py-3">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            Start Review
          </button>

          <div className="bg-[#111827] border border-white/10 rounded-xl p-6">
            <h3 className="font-semibold text-white mb-4">Tips</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Include imports</li>
              <li>• Complete functions</li>
              <li>• Select language</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
