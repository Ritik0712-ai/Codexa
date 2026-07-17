'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Code2, Zap, Shield, Clock } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0F172A] w-full overflow-x-hidden">
      {/* Header */}
      <header className="w-full border-b border-white/10 bg-[#0F172A]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Codexa</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-secondary text-sm">
              Login
            </Link>
            <Link href="/register" className="btn-primary text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-6">
            <Zap className="w-4 h-4" />
            AI-Powered Code Reviews
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
            Improve Your Code with<br />
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              AI-Powered Reviews
            </span>
          </h1>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Get instant, actionable feedback on your code. Our AI analyzes syntax, 
            style, complexity, and best practices to help you write better software.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register" className="btn-primary px-6 py-3">
              Start Reviewing Free
            </Link>
            <Link href="/login" className="btn-secondary px-6 py-3">
              Try Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 px-6 bg-[#111827]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Why Use Codexa?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card p-6">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-indigo-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Instant Analysis</h3>
              <p className="text-gray-400 text-sm">
                Get comprehensive code reviews in seconds. No more waiting for senior developers to review your PRs.
              </p>
            </div>
            <div className="card p-6">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-cyan-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Security Focused</h3>
              <p className="text-gray-400 text-sm">
                Detect potential security vulnerabilities, injection risks, and other critical issues before they reach production.
              </p>
            </div>
            <div className="card p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Learn & Improve</h3>
              <p className="text-gray-400 text-sm">
                Understand why issues exist and how to fix them. Educational explanations help you grow as a developer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Improve Your Code?</h2>
          <p className="text-gray-400 mb-8">
            Join thousands of developers who use Codexa to write better, cleaner code.
          </p>
          <Link href="/register" className="btn-primary px-6 py-3">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white">Codexa</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 Codexa. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
