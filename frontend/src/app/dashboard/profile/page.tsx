'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { userAPI } from '@/lib/api';
import { User, Loader2, Save } from 'lucide-react';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await userAPI.updateMe({ name });
      await refreshUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-gray-400">Manage your account information</p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="card p-6 mb-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg mb-6">
            Profile updated successfully!
          </div>
        )}

        {/* Avatar */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
            <span className="text-white text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Profile Picture</h3>
            <p className="text-sm text-gray-400">Your avatar is automatically generated from your name</p>
          </div>
        </div>

        {/* Name */}
        <div className="mb-6">
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
            placeholder="Your name"
          />
        </div>

        {/* Email (read-only) */}
        <div className="mb-6">
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={user?.email || ''}
            className="input opacity-60"
            disabled
          />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || name === user?.name}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </form>

      {/* Account Info */}
      <div className="card p-6">
        <h3 className="font-semibold mb-4">Account Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Account Type</span>
            <span className="font-medium">{user?.role === 'ADMIN' ? 'Administrator' : 'Free User'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Member Since</span>
            <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
