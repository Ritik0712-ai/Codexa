'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { reviewAPI } from '@/lib/api';
import { FileCode, Loader2, AlertTriangle, CheckCircle, Info, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Issue {
  severity: string;
  category: string;
  issue: string;
  explanation: string;
  suggestedFix?: string;
}

interface Review {
  id: string;
  language: string;
  code: string;
  status: string;
  overallScore: number;
  issues: Issue[];
  staticAnalysis: any;
  createdAt: string;
}

export default function ReviewDetailPage() {
  const params = useParams();
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reviewAPI.getReview(params.id as string)
      .then(res => setReview(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!review) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-400 mb-4">Review not found</p>
        <Link href="/dashboard/history" className="btn-primary">Back to History</Link>
      </div>
    );
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity.toUpperCase()) {
      case 'CRITICAL':
      case 'HIGH':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'MEDIUM':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'LOW':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'LOW':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/history" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to History
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{review.language} Code Review</h1>
            <p className="text-gray-400 text-sm mt-1">
              {new Date(review.createdAt).toLocaleDateString()} at {new Date(review.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full text-lg font-bold ${
            review.overallScore >= 80 ? 'bg-green-500/20 text-green-400' :
            review.overallScore >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            Score: {review.overallScore}/100
          </div>
        </div>
      </div>

      {/* Code Preview */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Code Analyzed</h2>
        <div className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden">
          <div className="px-4 py-2 border-b border-white/10 flex items-center gap-2">
            <FileCode className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">{review.language}</span>
          </div>
          <pre className="p-4 text-sm text-gray-300 overflow-x-auto font-mono max-h-64">
            {review.code}
          </pre>
        </div>
      </div>

      {/* Issues */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">
          Issues Found ({review.issues?.length || 0})
        </h2>
        {review.issues && review.issues.length > 0 ? (
          <div className="space-y-4">
            {review.issues.map((issue, index) => (
              <div key={index} className={`border rounded-xl p-5 ${getSeverityColor(issue.severity)}`}>
                <div className="flex items-start gap-3">
                  {getSeverityIcon(issue.severity)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{issue.severity}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-sm opacity-80">{issue.category}</span>
                    </div>
                    <h3 className="font-medium mb-2">{issue.issue}</h3>
                    <p className="text-sm opacity-80 mb-3">{issue.explanation}</p>
                    {issue.suggestedFix && (
                      <div className="bg-black/20 rounded-lg p-3">
                        <p className="text-xs font-medium mb-1">Suggested Fix:</p>
                        <p className="text-sm">{issue.suggestedFix}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#111827] border border-white/10 rounded-xl p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-white font-medium">No issues found!</p>
            <p className="text-gray-400 text-sm mt-1">Your code looks great.</p>
          </div>
        )}
      </div>
    </div>
  );
}