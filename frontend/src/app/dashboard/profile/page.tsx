'use client';

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { User, Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-8">Profile</h1>

      <div className="max-w-lg">
        <div className="bg-[#111827] border border-white/10 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{user.name}</h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Name</label>
              <input type="text" defaultValue={user.name} className="input mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-400">Email</label>
              <input type="email" defaultValue={user.email} className="input mt-1" disabled />
            </div>
            <button disabled={loading} className="btn-primary w-full py-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
