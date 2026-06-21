import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Shield, BarChart3, Sparkles, ArrowRight } from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 select-none">
      {/* Navbar */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-100 dark:border-slate-900">
        <div className="flex items-center gap-2 font-bold text-xl text-emerald-600 dark:text-emerald-400">
          <Leaf className="w-6 h-6" /> CarbonCompass
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium hover:text-emerald-600 transition-colors">Sign In</Link>
          <Link to="/register" className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-500 rounded-xl text-sm font-medium shadow-sm transition-all">Get Started</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center space-y-8">
        <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Smarter Zero-Carbon Tracking Driven By Intelligence
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto leading-[1.1]">
          Navigate your footprint. <span className="text-emerald-600 dark:text-emerald-400">Heal the planet.</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Track emissions effortlessly, interpret actionable visual indices, and adapt your daily living with real-time optimization updates from an AI-powered climate coach.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="group px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all">
            Start Free Compass <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Feature Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8 border-t border-slate-100 dark:border-slate-900">
        <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center"><BarChart3 /></div>
          <h3 className="text-xl font-bold">Dynamic Diagnostics</h3>
          <p className="text-sm text-slate-500">Seamlessly evaluate transportation, residential utility data, diet, and spending habits using optimized tracking modules.</p>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center"><Sparkles /></div>
          <h3 className="text-xl font-bold">Predictive Coaching</h3>
          <p className="text-sm text-slate-500">Receive precise operational strategies generated dynamically via targeted environmental heuristic processing engines.</p>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center"><Shield /></div>
          <h3 className="text-xl font-bold">Gamified Progress</h3>
          <p className="text-sm text-slate-500">Maintain streak counts, secure dynamic milestone achievements, and systematically improve global environmental index marks.</p>
        </div>
      </section>
    </div>
  );
};