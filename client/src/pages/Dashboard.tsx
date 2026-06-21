import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Flame, Trophy, TrendingDown, RefreshCw } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export const Dashboard: React.FC = () => {
  const { token, user } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      const resMetrics = await fetch(`${import.meta.env.VITE_API_URL}/carbon/current`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resMetrics.ok) setMetrics(await resMetrics.json());

      const resHist = await fetch(`${import.meta.env.VITE_API_URL}/carbon/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resHist.ok) setHistory(await resHist.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { if (token) fetchDashboardData(); }, [token]);

  const fallbackBreakdown = metrics?.breakdown || { transport: 120, electricity: 90, food: 150, shopping: 60 };

  const doughnutData = {
    labels: ['Transport', 'Electricity', 'Food', 'Shopping'],
    datasets: [{
      data: [fallbackBreakdown.transport, fallbackBreakdown.electricity, fallbackBreakdown.food, fallbackBreakdown.shopping],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899'],
      borderWidth: 0,
    }]
  };

  const trendData = {
    labels: history.length ? history.map(h => new Date(h.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })).reverse() : ['May', 'June'],
    datasets: [{
      label: 'Monthly Footprint Trend (kg CO2e)',
      data: history.length ? history.map(h => h.monthlyEstimate).reverse() : [450, metrics?.monthlyEstimate || 420],
      backgroundColor: '#10b981',
      borderRadius: 6
    }]
  };

  return (
    <div className="space-y-6">
      {/* Top Cards Bar */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-orange-100 dark:bg-orange-950 text-orange-600 rounded-xl"><Flame /></div>
          <div><p className="text-xs font-medium text-slate-500 uppercase">Current Streak</p><p className="text-2xl font-bold">{user?.streak || 3} Weeks</p></div>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-xl"><Trophy /></div>
          <div><p className="text-xs font-medium text-slate-500 uppercase">Eco Score</p><p className="text-2xl font-bold">{user?.sustainabilityScore || 120} XP</p></div>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-950 text-blue-600 rounded-xl"><TrendingDown /></div>
          <div><p className="text-xs font-medium text-slate-500 uppercase">Monthly Output</p><p className="text-2xl font-bold">{metrics?.monthlyEstimate || 420} kg</p></div>
        </div>
      </div>

      {/* Visual Analytics Split Panel */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center">
          <h3 className="font-bold text-base self-start mb-4">Category Composition</h3>
          <div className="w-64 h-64"><Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} /></div>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <h3 className="font-bold text-base mb-4">Emissions Trajectory</h3>
          <div className="h-64"><Bar data={trendData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
        </div>
      </div>
    </div>
  );
};