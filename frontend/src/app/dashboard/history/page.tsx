'use client';

import { useEffect, useState } from 'react';
import { reviewAPI, Review } from '@/lib/api';
import { Search, Filter, FileCode, Clock, Loader2, Trash2, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await reviewAPI.getReviews({
          page,
          limit: 10,
          search: search || undefined,
          status: statusFilter || undefined,
        });
        setReviews(response.data.reviews);
        setTotalPages(response.data.pagination.pages);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [page, search, statusFilter]);

  const handleDelete = async (e: React.MouseEvent, reviewId: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await reviewAPI.deleteReview(reviewId);
      setReviews(reviews.filter(r => r.id !== reviewId));
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Review History</h1>
        <p className="text-gray-400">Browse and manage your past code reviews</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-auto"
          >
            <option value="">All Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="PROCESSING">Processing</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="card">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No reviews found</h3>
            <p className="text-gray-400 mb-4">
              {search || statusFilter
                ? 'Try adjusting your filters'
                : 'Start by creating your first code review'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 hover:bg-white/5 cursor-pointer transition-colors"
                onClick={() => router.push(`/dashboard/review/${review.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                      <FileCode className="w-6 h-6 text-indigo-500" />
                    </div>
                    <div>
                      <p className="font-medium">{review.language}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {review._count && (
                      <span className="text-sm text-gray-400">
                        {review._count.findings} findings
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      review.status === 'COMPLETED'
                        ? 'bg-green-500/20 text-green-400'
                        : review.status === 'PROCESSING'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {review.status}
                    </span>
                    {review.overallScore > 0 && (
                      <div className="text-right min-w-[60px]">
                        <p className="text-2xl font-bold">{review.overallScore}</p>
                        <p className="text-xs text-gray-500">score</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/review/${review.id}`);
                        }}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="View details"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, review.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-secondary px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
