'use client';

import { useEffect, useState, use } from 'react';
import { reviewAPI, Review, ReviewFinding, ReviewMetric } from '@/lib/api';
import { ArrowLeft, Loader2, AlertTriangle, CheckCircle, Clock, FileCode, Code2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await reviewAPI.getReview(id);
        setReview(response.data);
        
        // Keep polling if still processing
        if (response.data.status === 'PROCESSING') {
          setPolling(true);
        }
      } catch (error) {
        console.error('Failed to fetch review:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReview();
  }, [id]);

  // Poll for updates if processing
  useEffect(() => {
    if (!polling) return;
    
    const interval = setInterval(async () => {
      try {
        const response = await reviewAPI.getReview(id);
        setReview(response.data);
        
        if (response.data.status !== 'PROCESSING') {
          setPolling(false);
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [polling, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!review) {
    return (
      <div className="p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Review not found</h2>
        <Link href="/dashboard/history" className="btn-primary inline-block mt-4">
          Back to History
        </Link>
      </div>
    );
  }

  const findings = review.findings || [];
  const metrics = review.metrics;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'LOW': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'INFO': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{review.language} Code Review</h1>
          <p className="text-gray-400 text-sm">
            {new Date(review.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
          review.status === 'COMPLETED'
            ? 'bg-green-500/20 text-green-400'
            : review.status === 'PROCESSING'
            ? 'bg-yellow-500/20 text-yellow-400'
            : 'bg-red-500/20 text-red-400'
        }`}>
          {polling && <Loader2 className="w-4 h-4 animate-spin inline mr-2" />}
          {review.status}
        </span>
      </div>

      {/* Processing State */}
      {review.status === 'PROCESSING' && (
        <div className="card p-12 text-center mb-6">
          <Clock className="w-16 h-16 text-indigo-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-xl font-semibold mb-2">Analyzing your code...</h2>
          <p className="text-gray-400">This usually takes 5-10 seconds</p>
        </div>
      )}

      {/* Failed State */}
      {review.status === 'FAILED' && (
        <div className="card p-12 text-center mb-6 border-red-500/30">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Review Failed</h2>
          <p className="text-gray-400 mb-4">Something went wrong. Please try again.</p>
          <Link href="/dashboard/new-review" className="btn-primary inline-block">
            Try Again
          </Link>
        </div>
      )}

      {/* Results */}
      {review.status === 'COMPLETED' && (
        <>
          {/* Score and Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="card p-6 text-center">
              <p className="text-gray-400 text-sm mb-2">Overall Score</p>
              <div className="relative w-32 h-32 mx-auto mb-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-gray-700"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${review.overallScore * 3.52} 352`}
                    className={review.overallScore >= 80 ? 'text-green-500' : review.overallScore >= 60 ? 'text-yellow-500' : 'text-red-500'}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold">{review.overallScore}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">out of 100</p>
            </div>

            <div className="md:col-span-2 card p-6">
              <h3 className="font-semibold mb-3">Summary</h3>
              <p className="text-gray-400">{review.summary}</p>
            </div>
          </div>

          {/* Metrics */}
          {metrics && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="card p-4 text-center">
                <Code2 className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{metrics.linesOfCode}</p>
                <p className="text-xs text-gray-500">Lines of Code</p>
              </div>
              <div className="card p-4 text-center">
                <FileCode className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">{metrics.functions}</p>
                <p className="text-xs text-gray-500">Functions</p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-2xl font-bold">{metrics.classes}</p>
                <p className="text-xs text-gray-500">Classes</p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-2xl font-bold">{metrics.cyclomaticComplexity}</p>
                <p className="text-xs text-gray-500">Complexity</p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-2xl font-bold">{metrics.fileComplexity}</p>
                <p className="text-xs text-gray-500">File Complexity</p>
              </div>
            </div>
          )}

          {/* Findings */}
          <div className="card">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-lg font-semibold">
                Findings ({findings.length})
              </h2>
            </div>

            {findings.length === 0 ? (
              <div className="p-12 text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No issues found!</h3>
                <p className="text-gray-400">Great job! Your code looks clean.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {findings.map((finding, index) => (
                  <div key={finding.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(finding.severity)}`}>
                        {finding.severity}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{finding.category}</span>
                          {finding.fileName && (
                            <>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-400 text-sm">{finding.fileName}</span>
                            </>
                          )}
                          {finding.lineNumber && (
                            <>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-400 text-sm">Line {finding.lineNumber}</span>
                            </>
                          )}
                        </div>
                        <p className="font-medium mb-2">{finding.issue}</p>
                        <p className="text-gray-400 text-sm mb-3">{finding.explanation}</p>
                        {finding.suggestedFix && (
                          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                            <p className="text-sm text-green-400 font-medium mb-1">Suggested Fix:</p>
                            <p className="text-sm text-gray-300">{finding.suggestedFix}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
