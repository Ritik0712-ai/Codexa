'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { userAPI, reviewAPI, UserStats, Review } from '@/lib/api';
import { Code2, Star, FileCode, TrendingUp, Clock, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, reviewsRes] = await Promise.all([
          userAPI.getStats(),
          reviewAPI.getReviews({ limit: 5 }),
        ]);
        setStats(statsRes.data);
        setRecentReviews(reviewsRes.data.reviews);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-gray-400">Here's an overview of your code review activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
              <Code2 className="w-6 h-6 text-indigo-500" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Reviews</p>
          <p className="text-3xl font-bold">{stats?.totalReviews || 0}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-cyan-500" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Average Score</p>
          <p className="text-3xl font-bold">{stats?.avgScore || 0}%</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <FileCode className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Files Reviewed</p>
          <p className="text-3xl font-bold">
            {stats?.reviewsByLanguage?.reduce((acc, lang) => acc + lang.count, 0) || 0}
          </p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Languages</p>
          <p className="text-3xl font-bold">
            {stats?.reviewsByLanguage?.length || 0}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Link
          href="/dashboard/new-review"
          className="card p-6 hover:border-indigo-500/50 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">New Code Review</h3>
              <p className="text-gray-400">Paste code or upload a file for instant AI review</p>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-indigo-500 transition-colors" />
          </div>
        </Link>

        <Link
          href="/dashboard/history"
          className="card p-6 hover:border-indigo-500/50 transition-colors group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">View History</h3>
              <p className="text-gray-400">Browse your past reviews and findings</p>
            </div>
            <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-indigo-500 transition-colors" />
          </div>
        </Link>
      </div>

      {/* Recent Reviews */}
      <div className="card">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Reviews</h2>
            <Link href="/dashboard/history" className="text-indigo-400 hover:text-indigo-300 text-sm">
              View All
            </Link>
          </div>
        </div>

        {recentReviews.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
            <p className="text-gray-400 mb-4">Start by creating your first code review</p>
            <Link href="/dashboard/new-review" className="btn-primary inline-block">
              Create Review
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {recentReviews.map((review) => (
              <div
                key={review.id}
                className="p-4 hover:bg-white/5 cursor-pointer transition-colors"
                onClick={() => router.push(`/dashboard/review/${review.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                      <FileCode className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="font-medium">{review.language}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
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
                      <div className="text-right">
                        <p className="text-2xl font-bold">{review.overallScore}</p>
                        <p className="text-xs text-gray-500">score</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
