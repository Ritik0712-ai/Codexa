'use client';

import { useEffect, useState } from 'react';
import { userAPI } from '@/lib/api';
import { Code2, FileCode, TrendingUp, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalReviews: number;
  avgScore: number;
  reviewsByLanguage: { language: string; count: number }[];
  recentActivity: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getStats()
      .then(res => setStats(res.data))
      .catch(console.error)
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
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
              <FileCode className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats?.totalReviews || 0}</p>
              <p className="text-gray-400 text-sm">Total Reviews</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats?.avgScore || 0}</p>
              <p className="text-gray-400 text-sm">Average Score</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Code2 className="w-6 h-6 text-cyan-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {stats?.reviewsByLanguage?.length || 0}
              </p>
              <p className="text-gray-400 text-sm">Languages Used</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <Link
          href="/dashboard/new-review"
          className="btn-primary inline-flex items-center gap-2"
        >
          <FileCode className="w-4 h-4" />
          Start New Review
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>
        {stats?.recentActivity && stats.recentActivity.length > 0 ? (
          <div className="divide-y divide-white/10">
            {stats.recentActivity.map((review) => (
              <Link
                key={review.id}
                href={`/dashboard/review/${review.id}`}
                className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <FileCode className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{review.language}</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    review.overallScore >= 80
                      ? 'bg-green-500/20 text-green-400'
                      : review.overallScore >= 60
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {review.overallScore}/100
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No reviews yet</p>
            <Link href="/dashboard/new-review" className="btn-primary">
              Create Your First Review
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
