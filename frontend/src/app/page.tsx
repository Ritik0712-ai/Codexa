'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Code2, Zap, Shield, Clock, Github, Sparkles, Brain, Bug, Gauge, FileSearch, ArrowRight, Check } from 'lucide-react';
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

  if (user) return null;

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Header */}
      <header className="w-full border-b border-white/10 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Codexa</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-gray-400">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#how" className="hover:text-white transition">How it Works</a>
            <a href="#languages" className="hover:text-white transition">Languages</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-300 hover:text-white px-4 py-2">Login</Link>
            <Link href="/register" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-base mb-8">
            <Sparkles className="w-4 h-4" />
            Powered by GPT-4 AI
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-8 text-white leading-tight">
            Improve Your Code with<br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              AI-Powered Reviews
            </span>
          </h1>
          <p className="text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Get instant, actionable feedback on your code. Our AI analyzes syntax, style, complexity, and best practices to help you write better software.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/register" className="btn-primary px-10 py-4 text-lg">
              Start Reviewing Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="btn-secondary px-10 py-4 text-lg">
              Try Demo
            </Link>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-8 border-t border-white/10">
            <div>
              <p className="text-4xl font-bold text-white mb-2">10s</p>
              <p className="text-gray-400">Average Review</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-2">19+</p>
              <p className="text-gray-400">Languages</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-2">95%</p>
              <p className="text-gray-400">Accuracy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-8 bg-[#111827]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-white">Why Use Codexa?</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to write better, cleaner, and more secure code.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-8 hover:border-indigo-500/50 transition">
              <div className="w-14 h-14 bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-indigo-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Instant Analysis</h3>
              <p className="text-gray-400 leading-relaxed">Get comprehensive code reviews in seconds. No more waiting for senior developers to review your PRs.</p>
            </div>
            <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-8 hover:border-cyan-500/50 transition">
              <div className="w-14 h-14 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-7 h-7 text-cyan-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Security First</h3>
              <p className="text-gray-400 leading-relaxed">Detect vulnerabilities, injection risks, and security issues before they reach production.</p>
            </div>
            <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition">
              <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">AI-Powered</h3>
              <p className="text-gray-400 leading-relaxed">GPT-4 analyzes your code like a senior engineer would, with detailed explanations.</p>
            </div>
            <div className="bg-[#0F172A] border border-white/10 rounded-2xl p-8 hover:border-green-500/50 transition">
              <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Learn & Grow</h3>
              <p className="text-gray-400 leading-relaxed">Educational explanations help you understand why issues exist and how to fix them.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how" className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-white">How It Works</h2>
            <p className="text-xl text-gray-400">Three simple steps to better code</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white">Paste Your Code</h3>
              <p className="text-gray-400 text-lg">Copy and paste your code snippet or upload a file directly.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white">AI Analysis</h3>
              <p className="text-gray-400 text-lg">Our AI runs static analysis and intelligent review in seconds.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white">Get Insights</h3>
              <p className="text-gray-400 text-lg">Review detailed findings, metrics, and suggested fixes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section id="languages" className="py-24 px-8 bg-[#111827]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-white">Supported Languages</h2>
            <p className="text-xl text-gray-400">Review code in any of these languages</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin'].map((lang) => (
              <div key={lang} className="bg-[#0F172A] border border-white/10 rounded-xl p-4 text-center hover:border-indigo-500/50 transition">
                <p className="text-white font-medium">{lang}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20 rounded-3xl p-16">
          <h2 className="text-5xl font-bold mb-6 text-white">Ready to Improve Your Code?</h2>
          <p className="text-xl text-gray-400 mb-10">
            Join thousands of developers who use Codexa to write better code.
          </p>
          <Link href="/register" className="btn-primary px-12 py-4 text-lg">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-white text-lg">Codexa</span>
          </div>
          <p className="text-gray-500">© 2026 Codexa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}