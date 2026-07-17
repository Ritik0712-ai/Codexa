'use client';

import { useEffect, useState } from 'react';
import { reviewAPI } from '@/lib/api';
import { FileCode, Clock, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reviewAPI.getReviews()
      .then(res => setReviews(res.data.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-8">Review History</h1>

      <div className="bg-[#111827] border border-white/10 rounded-xl">
        {reviews.length > 0 ? (
          <div>
            {reviews.map((review) => (
              <Link key={review.id} href={`/dashboard/review/${review.id}`} className="flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <FileCode className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{review.language} Review</p>
                    <p className="text-gray-400 text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    review.status === 'COMPLETED' 
                      ? (review.overallScore >= 80 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400')
                      : review.status === 'PROCESSING' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {review.status === 'COMPLETED' ? `${review.overallScore}/100` : review.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <FileCode className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No reviews yet</p>
            <Link href="/dashboard/new-review" className="btn-primary">Create First Review</Link>
          </div>
        )}
      </div>
    </div>
  );
}
